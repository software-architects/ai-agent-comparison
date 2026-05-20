# Save Named Configurations Implementation Plan

## Current Configuration Flow

The app is an Angular application. The practice screen is implemented primarily in `src/app/components/player/player.component.ts` and `src/app/components/player/player.component.html`.

Current configurable values are owned by `PlayerComponent`:

- `toneService.tempo()`: persisted as `localStorage['tempo']`.
- `selectedMode`: persisted as `localStorage['mode']`.
- `selectedExercise().name`: persisted as `localStorage['exercise']`.
- `toneService.playRootNote`: persisted as `localStorage['playRootNote']`.
- `keysConfiguration`: persisted as `localStorage['keysConfiguration']`.
- The custom exercise text for the built-in `Custom` exercise: persisted as `localStorage['customExercise']`.

The current `saveConfiguration()` method writes the active configuration to these individual keys. `loadConfiguration()` reads those same keys during construction. This means there is exactly one persisted working configuration, and changing any setting overwrites the previous setup.

The available built-in exercises, modes, and key lists are defined in `src/app/model/configuration.ts`. Key ratings are represented by the `KeysConfiguration` class in `src/app/model/keys-configuration.ts`.

## Goals

- Let the user save the current settings under a user-provided name.
- Store saved configurations in browser `localStorage`.
- Let the user load a saved configuration and apply it to the current practice screen.
- Let the user rename saved configurations.
- Let the user delete saved configurations.
- Preserve the existing behavior where the current working configuration is remembered across page reloads.
- Keep the implementation local and lightweight; no backend, accounts, or remote sync.

## Non-Goals

- Do not change the chord-generation behavior.
- Do not change the format of the built-in exercises.
- Do not add import/export or cross-browser sync in the first implementation.
- Do not require a migration that deletes users' existing single active configuration.

## Proposed Data Model

Add explicit types for a serializable practice configuration and a named saved configuration.

Suggested file: `src/app/model/saved-configuration.ts`

```ts
import type { KeysConfiguration } from './keys-configuration';

export type PracticeConfiguration = {
  tempo: number;
  mode: 'R' | 'WC' | number;
  exerciseName: string;
  customExercise: string;
  playRootNote: boolean;
  keysConfiguration: KeysConfiguration;
};

export type SavedConfiguration = {
  id: string;
  name: string;
  configuration: PracticeConfiguration;
  createdAt: string;
  updatedAt: string;
};

export type SavedConfigurationsStore = {
  version: 1;
  configurations: SavedConfiguration[];
};
```

Notes:

- `id` should be generated once per saved configuration. Use `crypto.randomUUID()` when available, with a fallback such as `${Date.now()}-${Math.random().toString(36).slice(2)}` if needed.
- `name` is the user-facing label.
- `createdAt` and `updatedAt` should be ISO strings. They are useful for sorting and future UI improvements.
- `customExercise` should be stored in every saved configuration, not only when `exerciseName === 'Custom'`. This keeps loading deterministic if the user later selects `Custom`.
- `keysConfiguration` should be stored as plain JSON. When loaded, validate that `keysConfiguration.keys` exists and has the same length as the current `keys` array; otherwise replace it with `new KeysConfiguration()`.

## Local Storage Structure

Keep the existing active configuration keys for compatibility and for the current auto-save behavior:

- `tempo`
- `mode`
- `exercise`
- `playRootNote`
- `keysConfiguration`
- `customExercise`

Add one new key for the named configurations collection:

- `savedConfigurations`

Example value for `localStorage['savedConfigurations']`:

```json
{
  "version": 1,
  "configurations": [
    {
      "id": "0e78f0aa-3b6e-4c2b-b0da-08d3c59c7f8a",
      "name": "ii-V-I in all keys",
      "configuration": {
        "tempo": 90,
        "mode": "WC",
        "exerciseName": "ii7 - V7 - Imaj7 (two bars)",
        "customExercise": "iim*7* - V*7* | I*maj7*",
        "playRootNote": true,
        "keysConfiguration": {
          "keys": [
            { "key": "C", "rating": 3 },
            { "key": "Db", "rating": 1 }
          ]
        }
      },
      "createdAt": "2026-05-20T12:00:00.000Z",
      "updatedAt": "2026-05-20T12:00:00.000Z"
    }
  ]
}
```

Storage behavior:

- Existing active configuration keys continue to represent the current working state.
- `savedConfigurations` contains only named snapshots.
- Saving a named configuration copies the current active settings into `savedConfigurations`; it should not change the active configuration except for any normal current auto-save that already happens.
- Loading a named configuration applies it to the current state and writes the active keys, so a refresh keeps the loaded configuration active.
- Renaming updates only the saved item's `name` and `updatedAt`.
- Deleting removes only that saved item. It should not reset the current active configuration, even if the deleted item was the one last loaded.

## Persistence Service

Create a small service to isolate `localStorage` parsing and validation from `PlayerComponent`.

Suggested file: `src/app/services/configuration-storage.service.ts`

Responsibilities:

- Read the current active configuration from existing keys.
- Save the current active configuration to existing keys.
- Read the saved named configurations collection from `savedConfigurations`.
- Write the saved named configurations collection.
- Validate and normalize malformed storage data.
- Provide helper methods:
  - `loadActiveConfiguration(): PracticeConfiguration`
  - `saveActiveConfiguration(configuration: PracticeConfiguration): void`
  - `loadSavedConfigurations(): SavedConfiguration[]`
  - `saveNamedConfiguration(name: string, configuration: PracticeConfiguration): SavedConfiguration`
  - `updateNamedConfiguration(id: string, configuration: PracticeConfiguration): SavedConfiguration | null`
  - `renameSavedConfiguration(id: string, name: string): SavedConfiguration | null`
  - `deleteSavedConfiguration(id: string): void`

Implementation notes:

- Use `inject()` in Angular classes when touching new code.
- Guard all JSON parsing with `try/catch`.
- Treat missing or invalid `savedConfigurations` as `{ version: 1, configurations: [] }`.
- Trim names before saving or renaming.
- Reject empty names in the UI before calling the service.
- Consider case-insensitive duplicate name detection. The simplest user-friendly behavior is to block exact duplicate names after trimming and show an error.
- Keep `localStorage` access in the service. This makes `PlayerComponent` easier to test and avoids spreading storage key names through the app.

## Player Component Changes

File: `src/app/components/player/player.component.ts`

Refactor current persistence logic into explicit conversion methods:

- `private getCurrentPracticeConfiguration(): PracticeConfiguration`
- `private applyPracticeConfiguration(configuration: PracticeConfiguration): void`
- `private saveConfiguration(): void`
- `private loadConfiguration(): void`

`getCurrentPracticeConfiguration()` should collect:

- `tempo` from `toneService.tempo()`.
- `mode` from `selectedMode()`.
- `exerciseName` from `selectedExercise().name`.
- `customExercise` from the current `Custom` exercise's `configuration` value.
- `playRootNote` from `toneService.playRootNote`.
- `keysConfiguration` from the component's private `keysConfiguration` field.

`applyPracticeConfiguration()` should:

- Stop playback first if `isRunning()` is true, so loaded settings do not change mid-bar unpredictably.
- Set the tempo.
- Update the `Custom` exercise's `configuration` before setting the selected exercise.
- Set the selected exercise by name, falling back to the first exercise if the saved exercise no longer exists.
- Set the mode, falling back to the first mode if the saved mode is invalid.
- Set `toneService.playRootNote`.
- Validate and assign `keysConfiguration`.
- Call `updateProbabilityMap()`.
- Save the loaded configuration as the active configuration.

Current methods such as `changeTempo()`, `setTempo()`, `setMode()`, `setExercise()`, `setPlayRootNote()`, `setCustomExercise()`, and `openKeysDialog()` can continue to call `saveConfiguration()` after changes.

Add state for saved configurations UI:

- `readonly savedConfigurations = signal<SavedConfiguration[]>([])`
- `readonly selectedSavedConfigurationId = signal<string | null>(null)`
- `readonly saveConfigurationName = signal('')` if using a bound input, or keep the input local in the template via template refs.

Add public methods used by the template or dialog:

- `saveNamedConfiguration(name: string): void`
- `overwriteSavedConfiguration(id: string): void` if supporting update-in-place.
- `loadSavedConfiguration(id: string): void`
- `renameSavedConfiguration(id: string, name: string): void`
- `deleteSavedConfiguration(id: string): void`

The first implementation can skip overwrite-in-place if the UI clearly offers only `Save Current Settings As...`, `Load`, `Rename`, and `Delete`. However, adding `Update Saved` is useful when a user loads a saved setup, changes tempo or key ratings, and wants to keep the same saved name.

## UI Plan

File: `src/app/components/player/player.component.html`

Add a new section inside the existing configuration `mat-card`, preferably after `Configure Keys` because it acts on the full configuration rather than one field.

Suggested layout:

- A heading or label: `Saved Configurations`.
- A `mat-form-field` with a `mat-select` listing saved configuration names.
- A `Load` button next to or below the select.
- A `mat-form-field` text input labeled `Configuration name`.
- A `Save Current` button that creates a new saved configuration using the typed name.
- If a saved configuration is selected, show management actions:
  - `Update Saved` to overwrite the selected saved configuration with current settings.
  - `Rename` to rename the selected saved configuration.
  - `Delete` to delete it after confirmation.

Desktop layout:

- Keep controls within the existing narrow card.
- Stack form fields vertically for consistency with current `Chords` and `Mode` fields.
- Use a compact horizontal row for action buttons where space allows, wrapping on narrow widths.

Mobile layout:

- Stack every control full-width.
- Make destructive `Delete` visually secondary or warn-confirmed; avoid placing it too close to `Load`.

Suggested empty state:

- If there are no saved configurations, show text: `No saved configurations yet.`
- Keep the name input and `Save Current` button visible.

Suggested confirmation behavior:

- Use `window.confirm()` for the first implementation to keep scope small: `Delete "Name"? This cannot be undone.`
- A Material confirmation dialog can be added later if the app standardizes dialogs beyond `KeysDialogComponent`.

Suggested validation messages:

- Empty name: `Enter a name before saving.`
- Duplicate name: `A saved configuration with this name already exists.`
- Nothing selected for load/rename/delete: disable the action buttons rather than showing an error.

## Optional Management Dialog Alternative

If the card becomes too crowded, create a dedicated dialog for saved configurations.

Suggested files:

- `src/app/components/saved-configurations-dialog/saved-configurations-dialog.component.ts`
- `src/app/components/saved-configurations-dialog/saved-configurations-dialog.component.html`
- `src/app/components/saved-configurations-dialog/saved-configurations-dialog.component.scss`

Dialog approach:

- Keep only a `Saved Configurations` button in `PlayerComponent`.
- Dialog lists saved configurations with `Load`, `Rename`, `Update`, and `Delete` actions.
- Dialog also has a `Save Current As` name input.

Recommendation: start with the inline card section. The current app already has a compact configuration card, and the feature is central enough that hiding it behind another dialog may make discovery worse.

## Angular Material Module Changes

File: `src/app/app.module.ts`

The app already imports these relevant modules:

- `MatButtonModule`
- `MatCardModule`
- `MatDialogModule`
- `MatIconModule`
- `MatInputModule`
- `MatSelectModule`

Likely no new Material module is required for the inline version. If validation errors are rendered with `mat-error`, `MatInputModule` and `MatFormFieldModule` are usually paired, but this app currently relies on Material form-field support through existing module imports. Verify during implementation whether `MatFormFieldModule` is already available transitively or should be imported explicitly.

If adding snack-bar notifications, also import `MatSnackBarModule`, but this is optional. Inline messages are enough for the first implementation.

## Styling Changes

File: `src/app/components/player/player.component.scss`

Add styles for the saved configurations section:

- `.saved-configurations` with `margin-top` to separate it from key configuration.
- `.saved-configurations-actions` as a flex row with wrapping and gaps.
- Full-width form fields, matching the existing `#configuration mat-form-field { width: 100%; }` rule.
- A `.configuration-message` class for validation or success text.
- A `.danger` or similar class for the delete button only if consistent with the current theme.

Keep the layout simple and consistent with the existing Material card.

## Tests

Update or add tests around storage and component behavior.

Suggested service spec: `src/app/services/configuration-storage.service.spec.ts`

Test cases:

- Loads an empty saved list when `savedConfigurations` is missing.
- Loads an empty saved list when `savedConfigurations` contains invalid JSON.
- Saves a named configuration with trimmed name, id, timestamps, and configuration payload.
- Rejects or prevents duplicate names depending on where duplicate handling is implemented.
- Renames a saved configuration and updates `updatedAt`.
- Deletes only the requested configuration.
- Preserves unrelated saved configurations.
- Normalizes invalid key ratings or key list length by falling back to `new KeysConfiguration()`.

Update component spec: `src/app/components/player/player.component.spec.ts`

Current test coverage is minimal. Add focused tests only for the new behavior:

- `saveNamedConfiguration()` stores the current settings through the service and refreshes `savedConfigurations`.
- `loadSavedConfiguration()` applies tempo, exercise, custom exercise, mode, play-root-note, and key ratings.
- Loading stops playback if the player is running.
- `deleteSavedConfiguration()` removes the saved item but does not clear the active current settings.

Testing notes:

- Mock `localStorage` by clearing it in `beforeEach` and `afterEach`.
- Mock or spy on `ToneService` only as much as needed.
- If testing Material-heavy template interactions becomes brittle, prefer direct component method tests for the first implementation.

## Migration and Compatibility

No destructive migration is required.

On first load after the feature ships:

- Existing users still get their current active settings from the existing keys.
- `savedConfigurations` is initialized as an empty list if missing.
- The app should not automatically create a saved named configuration from the existing active settings because there is no user-provided name. The user can save it manually.

Future-proofing:

- Include `version: 1` in the saved collection wrapper.
- Keep all parsing resilient. If future versions add fields, versioned migration can happen in `ConfigurationStorageService`.

## Implementation Steps

1. Add `src/app/model/saved-configuration.ts` with the new types.
2. Add `src/app/services/configuration-storage.service.ts` to centralize active and named configuration persistence.
3. Refactor `PlayerComponent` to use the service for existing active load/save behavior without changing UI yet.
4. Add component state and methods for saving, loading, renaming, updating, and deleting named configurations.
5. Add the saved configurations UI section to `player.component.html`.
6. Add responsive styling in `player.component.scss`.
7. Add service tests for local storage parsing and saved configuration management.
8. Add focused component tests for applying and managing saved configurations.
9. Run `npm test` and `npm run build`.
10. Manually verify in the browser:
    - Existing settings still load after refresh.
    - A named configuration can be saved.
    - Multiple named configurations can coexist.
    - Loading one applies all settings, including custom exercise text and key ratings.
    - Renaming changes only the name.
    - Deleting one saved configuration does not change the active current settings.

## Edge Cases to Handle

- Empty or whitespace-only names.
- Duplicate names with different casing, such as `ii-V-I` and `II-v-i`.
- Invalid JSON in `savedConfigurations`.
- Saved configuration references an exercise name that no longer exists.
- Saved mode is not one of the current modes.
- Saved key ratings have the wrong key count after the key list changes.
- User loads a configuration while playback is running.
- User deletes the selected saved configuration and the select still points to the removed id.
- Browser local storage is unavailable or quota is exceeded. For this small feature, catch the write error and show a concise message instead of crashing.

## Suggested First-Cut UX Copy

- Section title: `Saved Configurations`
- Empty state: `No saved configurations yet.`
- Save input label: `Configuration name`
- Save button: `Save Current`
- Update button: `Update Saved`
- Load button: `Load`
- Rename button: `Rename`
- Delete button: `Delete`
- Empty name error: `Enter a name before saving.`
- Duplicate name error: `A saved configuration with this name already exists.`
- Delete confirmation: `Delete "{name}"? This cannot be undone.`

## Recommended Scope for the First Implementation

Implement the inline UI and storage service, including save, load, rename, update, and delete. Keep notifications inline rather than adding snack bars or new dialogs. Preserve the existing active auto-save keys and add `savedConfigurations` only for named snapshots. This gives the user the requested feature while minimizing changes to the chord generation and practice flow.
