# Plan: Save Named Practice Configurations

## Goal

Add a way for users to save the current jazz chord practice settings under a user-provided name, load a saved setup later, and manage saved setups by renaming or deleting them. The feature should store everything in the browser's `localStorage` and should not require a backend.

## Current Configuration Flow

The app is an Angular 21 project using Angular Material. The practice page is implemented in `src/app/components/player/player.component.ts` and `src/app/components/player/player.component.html`.

Current settings live directly in `PlayerComponent`:

- Tempo: `toneService.tempo()`
- Chord exercise: `selectedExercise()`
- Custom exercise text: the `Custom` entry in `exercises`
- Mode: `selectedMode()`
- Play root note: `toneService.playRootNote`
- Key ratings: private `keysConfiguration: KeysConfiguration`

Current persistence is also handled directly by `PlayerComponent`:

- `saveConfiguration()` writes the active setup to separate localStorage keys: `tempo`, `mode`, `exercise`, `playRootNote`, and `keysConfiguration`.
- `setCustomExercise()` writes custom text to `customExercise` separately.
- `loadConfiguration()` reads those same localStorage keys during construction.

The existing persistence represents one active working configuration only. Any settings change overwrites the previous active values.

## Proposed Data Model

Create a serializable snapshot type for one complete practice configuration. This should live in a new model file so the shape is shared by the component and storage service.

File to add: `src/app/model/saved-configuration.ts`

```ts
export type PracticeMode = 'R' | 'WC' | '5' | '-5';

export type KeyRating = 1 | 2 | 3 | 4 | 5;

export interface PracticeConfigurationSnapshot {
  tempo: number;
  mode: PracticeMode;
  exerciseName: string;
  customExercise: string;
  playRootNote: boolean;
  keysConfiguration: {
    keys: Array<{
      key: string;
      rating: KeyRating;
    }>;
  };
}

export interface SavedPracticeConfiguration {
  id: string;
  name: string;
  configuration: PracticeConfigurationSnapshot;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPracticeConfigurationsStore {
  version: 1;
  configurations: SavedPracticeConfiguration[];
}
```

Notes:

- Store `mode` as the string values already used by the UI: `'R'`, `'WC'`, `'5'`, and `'-5'`.
- Store `exerciseName` separately from `customExercise`. If `exerciseName` is `Custom`, `customExercise` is the saved custom chord pattern to apply.
- Store a full copy of `keysConfiguration` so key ratings are independent per saved setup.
- Use stable `id` values so rename operations do not break selection if two configurations temporarily have similar names.
- Use ISO strings for `createdAt` and `updatedAt` so the UI can sort and display them later if desired.

## Local Storage Structure

Use one new localStorage key for the saved collection:

```text
jazzChordFlashcards.savedConfigurations.v1
```

Example value:

```json
{
  "version": 1,
  "configurations": [
    {
      "id": "cfg_1716234000000_8f3d2a",
      "name": "ii-V-I in all keys",
      "createdAt": "2026-05-20T12:00:00.000Z",
      "updatedAt": "2026-05-20T12:00:00.000Z",
      "configuration": {
        "tempo": 80,
        "mode": "WC",
        "exerciseName": "ii7 - V7 - Imaj7 (two bars)",
        "customExercise": "iim*7* - V*7* | I*maj7*",
        "playRootNote": true,
        "keysConfiguration": {
          "keys": [
            { "key": "C", "rating": 5 },
            { "key": "Db", "rating": 2 }
          ]
        }
      }
    }
  ]
}
```

Keep the existing active configuration keys for now:

- `tempo`
- `mode`
- `exercise`
- `playRootNote`
- `keysConfiguration`
- `customExercise`

Reason: these keys already define the current active setup and are loaded at app startup. The saved-configurations feature can be added without changing startup behavior. Loading a saved configuration should apply it to component state and then call the existing active save path so the loaded setup becomes the current setup for the next page load.

No migration is required for existing users because their current setup can remain in the existing active keys. Optionally, the UI can offer `Save current settings` so users can explicitly capture their current active setup as the first named configuration.

## Storage Service

Add a focused service for CRUD operations on saved configurations.

File to add: `src/app/services/saved-configurations.service.ts`

Responsibilities:

- Read and parse `jazzChordFlashcards.savedConfigurations.v1`.
- Return an empty versioned store if the key is missing.
- Recover gracefully from invalid JSON by returning an empty store.
- Validate enough of the parsed shape to avoid runtime errors.
- Save the full store back to localStorage.
- Create a saved configuration from a name and snapshot.
- Update an existing saved configuration by `id`.
- Rename an existing saved configuration by `id`.
- Delete an existing saved configuration by `id`.
- Optionally expose a helper to check duplicate names case-insensitively.

Suggested public API:

```ts
getAll(): SavedPracticeConfiguration[];
create(name: string, configuration: PracticeConfigurationSnapshot): SavedPracticeConfiguration;
replace(id: string, configuration: PracticeConfigurationSnapshot): SavedPracticeConfiguration | null;
rename(id: string, name: string): SavedPracticeConfiguration | null;
delete(id: string): void;
```

Implementation notes:

- Generate IDs without adding a dependency, for example `crypto.randomUUID()` with a timestamp fallback for older browsers.
- Trim names before saving.
- Reject empty names in the caller before invoking service methods.
- Sort by `updatedAt` descending in `getAll()` so recently touched configurations appear first.
- Use immutable array updates so future signal-based consumers are straightforward.

## Player Component Changes

Update `src/app/components/player/player.component.ts`.

Inject the new service:

```ts
constructor(
  public toneService: ToneService,
  private dialog: MatDialog,
  private savedConfigurationsService: SavedConfigurationsService,
) { ... }
```

Add state for saved configurations:

```ts
readonly savedConfigurations = signal<SavedPracticeConfiguration[]>([]);
readonly selectedSavedConfigurationId = signal<string | null>(null);
readonly saveConfigurationName = signal('');
```

Add helper methods:

- `private getCurrentSnapshot(): PracticeConfigurationSnapshot`
- `private applySnapshot(snapshot: PracticeConfigurationSnapshot): void`
- `private refreshSavedConfigurations(): void`
- `saveNamedConfiguration(name: string): void`
- `overwriteSavedConfiguration(id: string): void`
- `loadSavedConfiguration(id: string): void`
- `renameSavedConfiguration(id: string, name: string): void`
- `deleteSavedConfiguration(id: string): void`

`getCurrentSnapshot()` should copy all settings from the active component state:

- `tempo: this.toneService.tempo()`
- `mode: this.selectedMode() as PracticeMode`
- `exerciseName: this.selectedExercise().name`
- `customExercise`: the current custom exercise string from the `Custom` exercise entry, or an empty string if unavailable
- `playRootNote: this.toneService.playRootNote`
- `keysConfiguration`: a deep copy of `this.keysConfiguration`

`applySnapshot()` should:

- Stop playback first if `isRunning()` is true, so the current/next chords do not continue from a stale sequence.
- Set tempo through `toneService.setTempo(snapshot.tempo)`.
- Apply custom exercise text to the `Custom` exercise before selecting the saved exercise.
- Set `selectedExercise` from `snapshot.exerciseName`, falling back to the first exercise if the saved name no longer exists.
- Set `selectedMode` from `snapshot.mode`, falling back to the first mode if needed.
- Set `toneService.playRootNote`.
- Replace `keysConfiguration` with a validated copy, falling back to `new KeysConfiguration()` if the stored key list is missing or has the wrong length.
- Clear transient sequence state: `currentKeyIndex`, `nextKey1Index`, `currKey`, `nextKey1`, `cycle`, `cycleKeys`, and `nextChordTasks`.
- Call `saveConfiguration()` so the loaded configuration becomes the active persisted setup.
- Call `updateProbabilityMap()` after replacing key ratings.

Keep `saveConfiguration()` as the active configuration persistence method. The new named-save methods should call `getCurrentSnapshot()` and write to the new collection through the service.

Update `loadConfiguration()` only as needed to normalize active values into the new snapshot shape. Avoid making startup depend on the saved-configuration collection.

## UI Design

Update `src/app/components/player/player.component.html` inside the existing configuration `<mat-card>`, preferably after the existing `Configure Keys` button because saved configurations manage the whole card's settings.

Recommended section:

```html
<section class="saved-configurations" aria-labelledby="saved-configurations-heading">
  <h2 id="saved-configurations-heading">Saved configurations</h2>

  <mat-form-field>
    <mat-label>Configuration name</mat-label>
    <input matInput #configurationName />
  </mat-form-field>

  <button mat-fab extended (click)="saveNamedConfiguration(configurationName.value)">
    Save current settings
  </button>

  <mat-form-field>
    <mat-label>Load saved configuration</mat-label>
    <mat-select [value]="selectedSavedConfigurationId()" (valueChange)="loadSavedConfiguration($event)">
      @for (configuration of savedConfigurations(); track configuration.id) {
      <mat-option [value]="configuration.id">{{ configuration.name }}</mat-option>
      }
    </mat-select>
  </mat-form-field>

  @if (selectedSavedConfigurationId()) {
  <div class="saved-configuration-actions">
    <button mat-button (click)="overwriteSavedConfiguration(selectedSavedConfigurationId()!)">
      Update saved
    </button>
    <button mat-button (click)="openRenameSavedConfigurationDialog(selectedSavedConfigurationId()!)">
      Rename
    </button>
    <button mat-button (click)="deleteSavedConfiguration(selectedSavedConfigurationId()!)">
      Delete
    </button>
  </div>
  }
</section>
```

The exact implementation may differ, but the UI should support these flows:

- Save: user enters a name and clicks `Save current settings`.
- Load: user picks a saved configuration from a dropdown.
- Update: user loads or selects a saved configuration, changes settings, then clicks `Update saved` to overwrite that saved snapshot with the current settings.
- Rename: user renames the selected saved configuration.
- Delete: user deletes the selected saved configuration.

For rename, use a small Angular Material dialog rather than `window.prompt()` to match the existing Material UI and avoid blocking browser dialogs. This can be a reusable dialog for entering a configuration name.

## Name Dialog Component

Add a small standalone dialog component for save/rename if the inline save input is not enough.

File to add: `src/app/components/saved-configuration-name-dialog/saved-configuration-name-dialog.component.ts`

Suggested behavior:

- Inputs through `MAT_DIALOG_DATA`: dialog title, confirm button label, initial name, existing names.
- Uses `MatDialogTitle`, `MatDialogContent`, `MatDialogActions`, `MatFormFieldModule`, `MatInputModule`, and `MatButtonModule`.
- Trims whitespace.
- Disables confirm for empty names.
- Shows a validation message for duplicate names if duplicate prevention is desired.
- Returns the final name string from `dialogRef.close(name)`.

This component can be used for:

- `Save as...` if the plan chooses a dialog-based save flow instead of an inline text field.
- `Rename` for an existing saved configuration.

Minimal alternative: keep the save text field inline and use the dialog only for rename.

## Styling

Update `src/app/components/player/player.component.scss`.

Suggested styles:

- Add top margin and a subtle divider for `.saved-configurations` to separate it from key configuration.
- Keep all form fields full width, matching existing configuration controls.
- Use a compact flex row for `.saved-configuration-actions` on desktop.
- Stack action buttons vertically or wrap them on narrow screens.

Example:

```scss
.saved-configurations {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--mat-sys-outline-variant);

  h2 {
    margin-top: 0;
    font-size: 18px;
  }
}

.saved-configuration-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

## Angular Module Changes

Update `src/app/app.module.ts` if the chosen UI needs additional Angular Material modules.

Likely additions:

- `MatTooltipModule` if action buttons use tooltips.
- No additional module is needed for `mat-select`, `mat-input`, `mat-button`, `mat-dialog`, `mat-card`, or `mat-icon` because they are already imported.

If the name dialog is standalone, import Material modules directly in that component rather than adding them to `AppModule`.

## Validation And Edge Cases

Handle these cases explicitly:

- Empty save or rename name: do not save; show a small validation message or disable confirm.
- Duplicate name: either allow duplicates because IDs are stable, or prevent duplicates case-insensitively. Prefer preventing duplicates for user clarity.
- Corrupt saved-configuration JSON: ignore it and start with an empty saved list.
- Saved exercise no longer exists: fall back to the first exercise and keep the saved custom exercise text available.
- Saved key ratings have the wrong length: fall back to `new KeysConfiguration()`.
- User loads a saved configuration while playback is running: stop playback first.
- User deletes the selected saved configuration: clear `selectedSavedConfigurationId` and refresh the dropdown.
- User updates a saved configuration after changing its name field: update only the selected configuration by `id`, not by name.

## Testing Plan

Add unit tests for the new service.

File to add: `src/app/services/saved-configurations.service.spec.ts`

Test cases:

- `getAll()` returns an empty list when localStorage has no saved store.
- `create()` stores a named snapshot and returns it with an ID and timestamps.
- `rename()` changes only the name and updates `updatedAt`.
- `replace()` overwrites only the snapshot for the matching ID and updates `updatedAt`.
- `delete()` removes only the matching ID.
- Invalid JSON in localStorage does not throw and returns an empty list.

Update `src/app/components/player/player.component.spec.ts` enough to keep the component constructible with the new service and dialog dependencies. If practical, add focused component tests for:

- `saveNamedConfiguration()` passes the current snapshot to the service.
- `loadSavedConfiguration()` applies tempo, mode, exercise, play-root, custom exercise, and key ratings.
- Loading while running calls `stop()` or produces the stopped state.

Because this project uses Angular Material components, prefer Angular Material test harnesses for UI-level tests if adding DOM interaction coverage.

## Implementation Steps

1. Add `src/app/model/saved-configuration.ts` with the snapshot, saved item, and store interfaces.
2. Add `src/app/services/saved-configurations.service.ts` with localStorage CRUD methods.
3. Add service unit tests covering create, read, update, rename, delete, and corrupt storage.
4. Update `PlayerComponent` to inject the service and expose saved-configuration signals.
5. Add `getCurrentSnapshot()` and `applySnapshot()` helpers to `PlayerComponent`.
6. Add save, load, update, rename, and delete methods to `PlayerComponent`.
7. Add the saved-configurations UI section to `player.component.html`.
8. Add or reuse a small name dialog for rename and optionally save-as.
9. Update `player.component.scss` for the new section and responsive actions.
10. Update `player.component.spec.ts` for the new dependencies and add focused behavior tests where feasible.
11. Run `npm test` and `npm run build`.

## Recommended Minimal First Version

For the smallest useful implementation, ship these pieces first:

- New model file.
- New storage service.
- Inline name field plus `Save current settings` button.
- Saved-configuration dropdown to load.
- `Update saved`, `Rename`, and `Delete` actions for the selected saved configuration.
- Existing active localStorage keys preserved unchanged.

This gives users the requested named configurations while keeping the current app architecture recognizable and avoiding a broad refactor.
