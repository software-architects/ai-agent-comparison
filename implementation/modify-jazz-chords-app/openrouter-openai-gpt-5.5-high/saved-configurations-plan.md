# Save Named Configurations Implementation Plan

## Goal

Add named practice configurations to the Jazz Chord Flashcards app so a user can save the current player settings under a name, load a saved setup later, rename saved setups, and delete setups from browser `localStorage`.

This plan is based on the current Angular app structure in `jazz-chord-flashcards`:

- `src/app/components/player/player.component.ts` owns the active practice settings and persists the one current setup to `localStorage`.
- `src/app/components/player/player.component.html` contains the configuration card where tempo, chord exercise, mode, root note playback, and key ratings are managed.
- `src/app/model/configuration.ts` defines built-in exercises, keys, and modes.
- `src/app/model/keys-configuration.ts` defines the per-key familiarity ratings used by random and weighted-cycle modes.
- `src/app/components/keys-dialog/*` edits `KeysConfiguration` in a Material dialog.
- `src/app/app.module.ts` imports the Material modules used by the non-standalone `PlayerComponent`.

## Current Configuration Behavior

Today there is only one active unnamed configuration. `PlayerComponent` stores it across separate `localStorage` keys:

| Key | Current source | Meaning |
| --- | --- | --- |
| `tempo` | `toneService.tempo()` | Current tempo number |
| `mode` | `selectedMode()` | Key selection mode, currently values like `R`, `WC`, `5`, `-5` |
| `exercise` | `selectedExercise().name` | Selected built-in exercise name, including `Custom` |
| `playRootNote` | `toneService.playRootNote` | Whether root-note playback is enabled |
| `keysConfiguration` | `this.keysConfiguration` | Key familiarity ratings |
| `customExercise` | `Custom` exercise configuration text | The editable chord progression when the `Custom` exercise is used |

Relevant current methods in `PlayerComponent`:

- `changeTempo()`, `setTempo()`, `setMode()`, `setExercise()`, `setPlayRootNote()`, and `openKeysDialog()` call `saveConfiguration()` after changes.
- `setCustomExercise()` writes `customExercise` directly, but does not currently call `saveConfiguration()`.
- `saveConfiguration()` writes the active unnamed settings to the separate keys listed above.
- `loadConfiguration()` reads those keys during construction and updates the player state.
- `updateProbabilityMap()` must run whenever `keysConfiguration` changes or a saved config is loaded.

The new feature should not remove this current-settings behavior. It is still useful for reopening the app and getting the last active state, even if the user never creates a named configuration.

## Proposed Local Storage Structure

Store named configurations under one new versioned key:

```ts
const SAVED_CONFIGURATIONS_STORAGE_KEY = 'jazzChordFlashcards.savedConfigurations.v1';
```

Use one JSON document instead of one key per saved configuration. This keeps listing, renaming, deleting, and future migration straightforward.

```json
{
  "version": 1,
  "activeId": "cfg_lx4c6p4a_3q9m2",
  "items": [
    {
      "id": "cfg_lx4c6p4a_3q9m2",
      "name": "ii-V-I in all keys",
      "createdAt": "2026-05-20T12:00:00.000Z",
      "updatedAt": "2026-05-20T12:15:00.000Z",
      "settings": {
        "tempo": 90,
        "mode": "R",
        "exerciseName": "Custom",
        "customExercise": "iim*7* - V*7* | I*maj7*",
        "playRootNote": true,
        "keysConfiguration": {
          "keys": [
            { "key": "C", "rating": 1 },
            { "key": "Db", "rating": 3 }
          ]
        }
      }
    }
  ]
}
```

Recommended TypeScript model in a new file, `src/app/model/saved-configuration.ts`:

```ts
import type { KeysConfiguration } from './keys-configuration';

export type PracticeModeKey = string;

export type PracticeConfigurationSettings = {
  tempo: number;
  mode: PracticeModeKey;
  exerciseName: string;
  customExercise: string | null;
  playRootNote: boolean;
  keysConfiguration: KeysConfiguration;
};

export type SavedPracticeConfiguration = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: PracticeConfigurationSettings;
};

export type SavedPracticeConfigurationsStore = {
  version: 1;
  activeId: string | null;
  items: SavedPracticeConfiguration[];
};
```

Notes:

- `mode` should be stored as a string. The existing built-in mode keys are strings, including numeric-looking values such as `5` and `-5`.
- `customExercise` should be captured even when the selected exercise is not `Custom`; this preserves the user's custom text when switching between saved configurations.
- `keysConfiguration` should be stored as plain JSON and validated when read. If the saved key list is missing, malformed, or no longer matches `keys.length`, fall back to `new KeysConfiguration()`.
- `activeId` tracks which saved configuration was last loaded or updated. It is not required to restore the app; the existing current-settings keys still do that. It is only for UI selection state.

## Files To Add

### `src/app/model/saved-configuration.ts`

Add the shared types listed above. Keep this file model-only with no browser or Angular dependencies.

### `src/app/services/saved-configurations.service.ts`

Create a small `providedIn: 'root'` Angular service that owns all saved-configuration storage operations.

Responsibilities:

- Read and parse `jazzChordFlashcards.savedConfigurations.v1`.
- Return an empty default store when the key is missing or invalid.
- Validate/sanitize items before returning them to the UI.
- Save the whole store back to `localStorage`.
- Provide methods such as:
  - `getStore(): SavedPracticeConfigurationsStore`
  - `getAll(): SavedPracticeConfiguration[]`
  - `getActiveId(): string | null`
  - `saveNew(name: string, settings: PracticeConfigurationSettings): SavedPracticeConfiguration`
  - `update(id: string, settings: PracticeConfigurationSettings): SavedPracticeConfiguration | null`
  - `rename(id: string, name: string): SavedPracticeConfiguration | null`
  - `delete(id: string): void`
  - `setActive(id: string | null): void`

Implementation details:

- Generate ids locally with `crypto.randomUUID()` when available; fall back to a timestamp/random suffix for older browsers.
- Trim names before saving.
- Reject empty names at the caller level and guard against empty names in the service.
- Decide whether duplicate names are allowed. Recommended behavior: prevent exact case-insensitive duplicates because duplicate names are confusing in a select list.
- Keep storage writes atomic by reading the latest store, modifying it, then writing the whole JSON object.
- Use defensive `try/catch` around `JSON.parse()` and `localStorage.setItem()` to handle corrupt JSON or storage quota errors.
- Because this app has SSR-related dependencies, the clean implementation should guard browser storage access with `isPlatformBrowser`. Current `PlayerComponent` already uses `localStorage` directly, but moving new storage code behind a service is a good place to avoid expanding that assumption.

### Optional: `src/app/components/saved-configuration-name-dialog/*`

Add a small standalone Material dialog component for entering a configuration name for save-as-new and rename flows.

Recommended files:

- `src/app/components/saved-configuration-name-dialog/saved-configuration-name-dialog.component.ts`
- `src/app/components/saved-configuration-name-dialog/saved-configuration-name-dialog.component.html`
- `src/app/components/saved-configuration-name-dialog/saved-configuration-name-dialog.component.scss`
- `src/app/components/saved-configuration-name-dialog/saved-configuration-name-dialog.component.spec.ts`

Dialog behavior:

- Inputs through `MAT_DIALOG_DATA`:
  - `title: string`
  - `label: string`
  - `initialName?: string`
  - `existingNames: string[]`
- Shows one `mat-form-field` with a name input.
- Disables the primary action when the trimmed name is empty or duplicates another saved config name, ignoring the current config's original name during rename.
- Returns the trimmed name from `dialogRef.close(name)`.
- Returns `undefined`/nothing when canceled.

This is preferable to `window.prompt()` because the app already uses Angular Material dialogs and this keeps validation accessible and testable.

## Files To Change

### `src/app/components/player/player.component.ts`

Inject `SavedConfigurationsService` and add signal-backed UI state for saved configurations.

Suggested additions:

- `readonly savedConfigurations = signal<SavedPracticeConfiguration[]>([]);`
- `readonly selectedSavedConfigurationId = signal<string | null>(null);`
- `readonly savedConfigurationMessage = signal<string | null>(null);` if using inline feedback instead of snack bars.

Add helper methods:

- `private refreshSavedConfigurations(): void`
  - Reads all saved configurations from the service.
  - Updates `savedConfigurations` and `selectedSavedConfigurationId` from `activeId` if still valid.
- `private getCurrentSettingsSnapshot(): PracticeConfigurationSettings`
  - Captures `tempo`, `selectedMode`, `selectedExercise().name`, current `Custom` configuration text, `playRootNote`, and a deep copy of `keysConfiguration`.
  - Use a copy for `keysConfiguration` so a saved configuration is not later mutated by key-rating edits.
- `private applySettings(settings: PracticeConfigurationSettings): void`
  - Stops playback first if `isRunning()` is true, or at least clears queued chord state, so loading a config cannot mix old queued chords with new settings.
  - Sets tempo through `toneService.setTempo()`.
  - Applies `selectedMode`.
  - Applies `playRootNote`.
  - Applies and validates `keysConfiguration`, then calls `updateProbabilityMap()`.
  - Applies `customExercise` to the `Custom` item in `this.exercises`.
  - Selects `exerciseName` if it still exists; otherwise falls back to `Custom` when custom text exists, or `this.exercises[0]`.
  - Calls the existing `saveConfiguration()` at the end so the loaded named configuration also becomes the current unnamed configuration for next app launch.
- `saveCurrentAsNamedConfiguration(): void`
  - Opens the name dialog.
  - Calls service `saveNew()` with the current snapshot.
  - Refreshes list and selects the new item.
- `updateSelectedSavedConfiguration(): void`
  - Overwrites the selected saved configuration with the current snapshot.
  - Useful when the user loads a saved config, tweaks tempo/key ratings, and wants to update the same saved setup.
- `loadSavedConfiguration(id: string | null): void`
  - Finds the selected saved config.
  - Applies its settings.
  - Sets it active in the service.
  - Refreshes list and selected id.
- `renameSelectedSavedConfiguration(): void`
  - Opens the name dialog with the current saved name.
  - Calls service `rename()`.
- `deleteSelectedSavedConfiguration(): void`
  - Confirms deletion. Use a Material confirm dialog if one is added, or a minimal `window.confirm()` if avoiding another component.
  - Calls service `delete()`.
  - Leaves current active practice settings unchanged; deleting a saved config should not reset the player.
  - Clears active id if the deleted config was active.

Adjust existing methods:

- In the constructor, after `loadConfiguration()` and `this.initialized = true`, call `refreshSavedConfigurations()`.
- In `setCustomExercise()`, also call `saveConfiguration()` after writing the custom exercise so the current unnamed configuration stays in sync. This is a small existing consistency fix that supports accurate snapshots.
- Ensure loading a saved configuration does not trigger excessive writes before all fields are applied. A practical approach is to add a private `isApplyingConfiguration = false` flag and have setters or `saveConfiguration()` skip intermediate saves while applying, then save once at the end.

### `src/app/components/player/player.component.html`

Add a new section inside the existing `mat-card`, after the `Configure Keys` button or just before it.

Recommended layout:

```html
<section class="saved-configurations" aria-labelledby="saved-configurations-heading">
  <h3 id="saved-configurations-heading">Saved configurations</h3>

  <mat-form-field>
    <mat-label>Saved configuration</mat-label>
    <mat-select
      [value]="selectedSavedConfigurationId()"
      (valueChange)="loadSavedConfiguration($event)">
      @for (configuration of savedConfigurations(); track configuration.id) {
        <mat-option [value]="configuration.id">{{ configuration.name }}</mat-option>
      }
    </mat-select>
  </mat-form-field>

  <div class="saved-configuration-actions">
    <button mat-fab extended type="button" (click)="saveCurrentAsNamedConfiguration()">
      Save as new
    </button>
    <button
      mat-fab
      extended
      type="button"
      [disabled]="!selectedSavedConfigurationId()"
      (click)="updateSelectedSavedConfiguration()">
      Update
    </button>
    <button
      mat-button
      type="button"
      [disabled]="!selectedSavedConfigurationId()"
      (click)="renameSelectedSavedConfiguration()">
      Rename
    </button>
    <button
      mat-button
      type="button"
      [disabled]="!selectedSavedConfigurationId()"
      (click)="deleteSelectedSavedConfiguration()">
      Delete
    </button>
  </div>
</section>
```

UI notes:

- Loading can happen immediately on select change; this matches the current app pattern where changing `Chords` or `Mode` immediately applies.
- `Save as new` should always be available.
- `Update`, `Rename`, and `Delete` should be disabled until a saved configuration is selected.
- Consider showing helper text when there are no saved configurations, such as `Save your current setup to reuse it later.`
- If immediate loading on select feels risky, split selection and loading into separate controls: a select plus a `Load` button. The user's request says "let me pick one ... to load it again"; immediate load is acceptable, but a separate `Load` button reduces accidental changes.

### `src/app/components/player/player.component.scss`

Add styles that match the existing compact configuration card and work on mobile.

Recommended styling goals:

- Add top spacing and a subtle divider from the main configuration controls.
- Keep `mat-form-field` full width, consistent with existing fields.
- Use a wrapping flex row for action buttons so small screens do not overflow.
- Make destructive delete visually secondary unless Material theme support for warning colors is already configured.

Example target structure:

```scss
.saved-configurations {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid color-mix(in srgb, var(--mat-sys-on-surface) 16%, transparent);

  h3 {
    margin: 0 0 16px;
    font-size: 1rem;
  }
}

.saved-configuration-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
```

### `src/app/app.module.ts`

If the name dialog is standalone, it can import its own Material modules and does not need to be declared in `AppModule`.

Likely module changes:

- Add `MatSnackBarModule` if using snack bars for success/error messages.
- Add `MatDividerModule` only if using `mat-divider`; otherwise a CSS border is enough.
- Add `FormsModule` or `ReactiveFormsModule` only if the new dialog uses Angular forms instead of a template reference or signal state.

Keep imports selective and only add modules actually used by templates.

### `src/app/components/documentation/documentation.component.ts`

Update the user-facing documentation string to mention saved configurations after the implementation is complete.

Suggested content:

- Explain that saved configurations include tempo, chord selection/custom progression, mode, root-note playback, and key ratings.
- Explain that saved configurations are stored only in the current browser via `localStorage`.
- Mention that clearing browser data removes saved configurations.

### Specs

Update or add tests in these files:

- `src/app/services/saved-configurations.service.spec.ts`
- `src/app/components/player/player.component.spec.ts`
- `src/app/components/saved-configuration-name-dialog/saved-configuration-name-dialog.component.spec.ts` if adding the dialog component.

The existing component specs are currently minimal, so service tests will provide most of the feature confidence.

## Data Capture Details

`getCurrentSettingsSnapshot()` should capture the current custom text from the actual `Custom` exercise entry, not only from `localStorage`, because the user may have edited the textarea and the in-memory model is the source of truth during the session.

Pseudo-code:

```ts
private getCurrentSettingsSnapshot(): PracticeConfigurationSettings {
  const customExercise = this.exercises.find((exercise) => exercise.name === 'Custom');

  return {
    tempo: this.toneService.tempo(),
    mode: this.selectedMode().toString(),
    exerciseName: this.selectedExercise().name,
    customExercise:
      typeof customExercise?.configuration === 'string'
        ? customExercise.configuration
        : null,
    playRootNote: this.toneService.playRootNote,
    keysConfiguration: structuredClone(this.keysConfiguration),
  };
}
```

If browser support for `structuredClone()` is a concern, use `JSON.parse(JSON.stringify(...))` for this simple plain-data object.

## Data Apply Details

`applySettings()` should apply fields in an order that avoids stale derived state:

1. Stop playback if running, or clear `currKey`, `nextKey1`, `nextChordTasks`, `currentKeyIndex`, and `nextKey1Index`.
2. Set `isApplyingConfiguration = true` to avoid intermediate saves.
3. Set tempo.
4. Set custom exercise text on the `Custom` exercise object.
5. Set selected exercise by name with a fallback.
6. Set selected mode.
7. Set `playRootNote`.
8. Validate and assign `keysConfiguration`.
9. Call `updateProbabilityMap()`.
10. Set `isApplyingConfiguration = false`.
11. Call `saveConfiguration()` once to update the existing current-settings keys.

The fallback for missing exercises should be:

- If `settings.exerciseName` exists in `this.exercises`, use it.
- Else if `settings.customExercise` exists, select `Custom` and use the saved custom text.
- Else select `this.exercises[0]`.

## Validation And Error Handling

Name validation:

- Trim whitespace.
- Require at least one non-whitespace character.
- Recommended max length: 60 characters.
- Prevent exact case-insensitive duplicates.
- Preserve original capitalization.

Stored-data validation:

- If the saved store cannot be parsed, return an empty store and do not crash the app.
- If `version !== 1`, ignore the store for now or add a migration switch with a default empty store.
- If an item is missing `id`, `name`, or `settings`, skip that item.
- Clamp invalid tempos to `minTempo`/`maxTempo` when applying.
- Validate `keysConfiguration.keys.length === keys.length`; otherwise use `new KeysConfiguration()`.
- Validate ratings are integers from 1 to 5; invalid ratings should become 1.
- Validate mode against `modes`; if not found, fall back to `modes[0].key`.

Storage errors:

- If saving to `localStorage` throws, show a short error message such as `Could not save configuration. Browser storage may be full or disabled.`
- If loading a corrupt saved configuration fails, leave the current player settings unchanged.

## UI Behavior

### Saving A New Configuration

1. User adjusts the current settings as they do today.
2. User clicks `Save as new`.
3. Name dialog opens with an empty input.
4. User enters a unique name and confirms.
5. App saves a snapshot under the new name.
6. New item becomes selected in the saved-configuration select.
7. Optional feedback: `Saved "Name".`

### Updating An Existing Saved Configuration

1. User loads or selects a saved configuration.
2. User changes tempo, chords, mode, key ratings, or root-note setting.
3. User clicks `Update`.
4. App overwrites that saved item with the current snapshot and updates `updatedAt`.
5. Optional feedback: `Updated "Name".`

This avoids autosaving changes into named configurations. Autosave would make it too easy to accidentally destroy a saved setup.

### Loading A Saved Configuration

1. User selects a saved configuration from the select.
2. App applies its snapshot to all existing controls.
3. App updates the existing current-settings keys through `saveConfiguration()`.
4. If playback was running, it should be stopped or reset to avoid stale queued chord state.

### Renaming A Saved Configuration

1. User selects a saved configuration.
2. User clicks `Rename`.
3. Name dialog opens with the current name.
4. User confirms a valid unique name.
5. App updates only `name` and `updatedAt`; settings are unchanged.

### Deleting A Saved Configuration

1. User selects a saved configuration.
2. User clicks `Delete`.
3. App asks for confirmation.
4. App removes it from the saved configurations store.
5. Current active practice settings remain unchanged.
6. The saved select clears, or selects the next available saved configuration without loading it automatically.

## Migration Strategy

No migration is required for existing users because their current unnamed setup remains in the existing keys.

Initial behavior after deployment:

- `loadConfiguration()` continues restoring the last active unnamed setup from existing keys.
- `SavedConfigurationsService` starts with an empty named list if the new key does not exist.
- The user can immediately click `Save as new` to turn the current restored setup into a named configuration.

Optional convenience:

- If there are no saved configurations, show helper text: `Your current setup is still restored automatically. Save it with a name to keep multiple setups.`

## Testing Plan

### Unit Tests For `SavedConfigurationsService`

Cover:

- Returns an empty v1 store when `localStorage` is empty.
- Returns an empty store when JSON is invalid.
- Saves a new configuration with id, name, timestamps, and settings.
- Rejects or reports duplicate names.
- Renames an item without changing settings.
- Updates an item settings and `updatedAt`.
- Deletes an item and clears `activeId` when needed.
- Sanitizes invalid key ratings and malformed key configurations.

### Component Tests For `PlayerComponent`

Cover:

- Renders the saved configurations section.
- Disables update/rename/delete when no saved configuration is selected.
- Captures current tempo, mode, exercise, custom exercise, root-note playback, and key ratings when saving.
- Applies all fields when loading a saved configuration.
- Calls `updateProbabilityMap()` indirectly by verifying key-rating changes affect stored `keysConfiguration` state, or keep this covered through a focused method test if practical.
- Stops or resets playback state when loading while running.

The existing `PlayerComponent` spec will need additional test module setup because the template uses several Angular Material components and `ToneService`.

### Dialog Tests

If using `SavedConfigurationNameDialogComponent`, cover:

- Initial value is shown for rename.
- Empty names disable confirm.
- Duplicate names disable confirm.
- Confirm returns the trimmed name.
- Cancel closes without a value.

### Manual Verification

Run these checks in the browser:

1. Save a built-in exercise configuration and reload the page; it remains listed.
2. Save a custom progression, switch away from `Custom`, then load the saved custom setup; the textarea and selected exercise are restored.
3. Save two configurations with different tempos, modes, and key ratings; loading each updates every control.
4. Rename a saved configuration and reload; the new name remains.
5. Delete a saved configuration and reload; it does not return.
6. Try saving a duplicate or blank name; the UI prevents it.
7. Load a saved configuration while playback is running; playback state resets cleanly.
8. Clear `localStorage`; app starts with default current settings and an empty saved list.

Recommended commands after implementation:

```bash
npm test
npm run build
```

## Implementation Order

1. Add `saved-configuration.ts` model types.
2. Add `SavedConfigurationsService` with localStorage read/write and tests.
3. Add the name dialog component and tests, or choose a simpler inline/name-field approach if minimizing new components is preferred.
4. Add saved-configuration signals and helper methods to `PlayerComponent`.
5. Add the saved-configuration UI block to `player.component.html`.
6. Add responsive styles to `player.component.scss`.
7. Add any required Material/form imports to `app.module.ts` or the standalone dialog component.
8. Update documentation text after behavior is implemented.
9. Run unit tests and build.

## Open Decisions

- Whether selecting an item should load immediately or require a separate `Load` button. Immediate load is simpler; a separate `Load` button is safer against accidental changes.
- Whether to use a Material snack bar for save/load feedback. Snack bars are polished but require one more Material module; inline helper text is simpler.
- Whether duplicate names should be blocked. Recommended: block duplicates case-insensitively.
- Whether delete confirmation should use a reusable Material confirm dialog or `window.confirm()`. A Material dialog is more consistent; `window.confirm()` is acceptable if the goal is a smaller first implementation.
