# Save Named Configurations Plan

## Goal

Add support for named practice configurations so a user can:

- save the current settings under a custom name
- see a list of saved configurations
- load a saved configuration later
- rename a saved configuration
- delete a saved configuration

The existing behavior where the app remembers the most recent working configuration on this device should stay intact.

## Current State

The current configuration logic lives almost entirely in `src/app/components/player/player.component.ts`.

### Current configuration fields

The player currently persists one active configuration to `localStorage` across these keys:

- `tempo`
- `mode`
- `exercise`
- `playRootNote`
- `keysConfiguration`
- `customExercise`

### Current load/save flow

- `loadConfiguration()` reads the values above when `PlayerComponent` is created.
- `saveConfiguration()` writes the current values back whenever tempo, mode, exercise, root-note playback, or key ratings change.
- `setCustomExercise()` stores the custom progression separately in `customExercise`.
- `KeysDialogComponent` edits `keysConfiguration` in place, and `PlayerComponent` persists it when the dialog closes.

### Important implementation details to preserve

- The app should still auto-save the current working configuration, even if the user never saves a named preset.
- The custom chord progression is tied to the special `Custom` exercise entry in `src/app/model/configuration.ts`, so any saved snapshot has to include the custom text separately.
- Key ratings are mutable and nested (`KeysConfiguration.keys`), so saved snapshots must be deep-copied when loading or saving.

## Recommended Approach

Keep the playback logic in `PlayerComponent`, but move storage and preset CRUD into a small dedicated service. This keeps the new feature from turning `PlayerComponent` into a large local-storage manager.

### Why a service is worth adding

- named presets add CRUD behavior, migration, validation, and serialization logic
- all browser storage access can be centralized and guarded in one place
- `PlayerComponent` can stay focused on translating between UI state and playback state
- the service becomes the right place for one-time migration from the current flat `localStorage` keys

## Data Model

Add typed models for the current practice snapshot and named saved configurations.

### New snapshot type

Suggested file: `src/app/model/practice-configuration.ts`

```ts
export interface PracticeConfigurationSnapshot {
  tempo: number;
  mode: string;
  exerciseName: string;
  customExercise: string | null;
  playRootNote: boolean;
  keysConfiguration: Array<{
    key: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }>;
}
```

Notes:

- `mode` should be stored as a string, not `number | string`.
- This matches the actual values already used in `configuration.ts`: `'R'`, `'WC'`, `'5'`, `'-5'`.
- Using `exerciseName` keeps the snapshot small and aligned with the current selection model.

### New saved preset type

Suggested file: `src/app/model/saved-configuration.ts`

```ts
export interface SavedConfiguration {
  id: string;
  name: string;
  snapshot: PracticeConfigurationSnapshot;
  createdAt: string;
  updatedAt: string;
}
```

Notes:

- `id` should be stable and opaque, for example `crypto.randomUUID()`.
- `createdAt` and `updatedAt` make rename/update behavior easier to reason about and display later if wanted.

## Local Storage Structure

Use one new versioned storage envelope instead of continuing to scatter named-preset data across many keys.

### Proposed key

- `practiceConfigurationStore`

### Proposed value

```json
{
  "version": 1,
  "current": {
    "tempo": 80,
    "mode": "WC",
    "exerciseName": "ii7 - V7 - Imaj7 (two bars)",
    "customExercise": "iim*7* - V*7* | I*maj7*",
    "playRootNote": true,
    "keysConfiguration": [
      { "key": "C", "rating": 5 },
      { "key": "Db", "rating": 2 }
    ]
  },
  "saved": [
    {
      "id": "8d438f7b-4fc6-4897-bfe8-a338d0ff2e12",
      "name": "Slow ii-V-I weak keys",
      "snapshot": {
        "tempo": 60,
        "mode": "WC",
        "exerciseName": "ii7 - V7 - Imaj7 (two bars)",
        "customExercise": null,
        "playRootNote": false,
        "keysConfiguration": []
      },
      "createdAt": "2026-05-20T12:00:00.000Z",
      "updatedAt": "2026-05-20T12:00:00.000Z"
    }
  ],
  "activeSavedConfigurationId": "8d438f7b-4fc6-4897-bfe8-a338d0ff2e12"
}
```

### Why this structure

- `current` preserves the existing auto-save behavior.
- `saved` holds reusable named presets.
- `activeSavedConfigurationId` lets the UI remember which preset is currently loaded and determine whether the current settings are now "dirty" relative to that preset.
- `version` gives a clean path for future storage changes.

## Migration Plan

The app already has users with settings stored under the old flat keys. The first release of named presets should migrate them automatically.

### Migration behavior

On startup, the storage service should:

1. try to read `practiceConfigurationStore`
2. if it exists and parses successfully, use it
3. otherwise, build `current` from the legacy keys:
   - `tempo`
   - `mode`
   - `exercise`
   - `playRootNote`
   - `keysConfiguration`
   - `customExercise`
4. initialize `saved` to `[]`
5. initialize `activeSavedConfigurationId` to `null`
6. write the new versioned store back to `localStorage`

### Cleanup of legacy keys

After the new store has been written successfully, legacy keys can be removed to avoid stale state. If a safer rollout is preferred, removal can be deferred by one release, but the implementation should read from only one source of truth after migration.

## Service Design

Suggested file: `src/app/services/configuration-storage.service.ts`

This service should own all serialization, validation, migration, and CRUD behavior.

### Suggested responsibilities

- guard all `localStorage` access behind browser-safe checks
- read and write the versioned store
- migrate legacy data
- return a default `PracticeConfigurationSnapshot` when storage is missing or invalid
- deep-clone snapshots when saving and loading
- validate saved configuration names

### Suggested public methods

```ts
loadStore(): PracticeConfigurationStore
saveCurrent(snapshot: PracticeConfigurationSnapshot): void
listSaved(): SavedConfiguration[]
loadSaved(id: string): SavedConfiguration | null
saveNew(name: string, snapshot: PracticeConfigurationSnapshot): SavedConfiguration
updateSaved(id: string, snapshot: PracticeConfigurationSnapshot): SavedConfiguration
renameSaved(id: string, name: string): SavedConfiguration
deleteSaved(id: string): void
setActiveSavedConfigurationId(id: string | null): void
```

### Validation rules

- trim whitespace before saving or renaming
- reject empty names
- reject duplicate names case-insensitively
- do not mutate the stored snapshot object in memory after returning it to the component

## Player Component Changes

Primary files:

- `src/app/components/player/player.component.ts`
- `src/app/components/player/player.component.html`
- `src/app/components/player/player.component.scss`

### `player.component.ts`

Add a clear separation between:

- capturing the current UI state into a snapshot
- applying a snapshot into the player state
- persisting the current working configuration
- managing named saved configurations

### New state to add

Suggested new signals or fields:

- `savedConfigurations`
- `selectedSavedConfigurationId`
- `configurationName`
- `isSavedConfigurationDirty`
- optional `nameValidationMessage`

### New helper methods to add

- `captureCurrentConfiguration()`
- `applyConfiguration(snapshot: PracticeConfigurationSnapshot)`
- `persistCurrentConfiguration()`
- `refreshSavedConfigurations()`
- `saveCurrentConfigurationAsNew()`
- `updateSelectedSavedConfiguration()`
- `loadSelectedSavedConfiguration()`
- `renameSelectedSavedConfiguration()`
- `deleteSelectedSavedConfiguration()`
- `markCurrentConfigurationDirtyIfNeeded()`

### Existing methods that should be updated

- replace direct `localStorage` access in `saveConfiguration()` and `loadConfiguration()` with service calls
- update `setCustomExercise()` so it updates the current working snapshot path, not just the legacy `customExercise` key
- keep `openKeysDialog()` behavior the same, but persist through the shared snapshot save path after close

### Important load/apply detail

When applying a saved snapshot:

1. stop playback first if the player is currently running
2. restore `customExercise` before selecting the `Custom` exercise
3. deep-copy `keysConfiguration` before assigning it
4. update the working configuration in storage immediately after loading
5. set `activeSavedConfigurationId` so the UI knows which preset is loaded

Stopping playback before load avoids mid-bar state changes and keeps chord/tempo state predictable.

## UI Plan

Add a new "Saved configurations" block inside the existing configuration card in `player.component.html`.

### Placement

Place it near the top of the configuration card, above the tempo controls. That keeps save/load actions close to the rest of the settings and makes the feature visible without moving the practice controls.

### Suggested UI layout

#### Row 1: saved preset picker

- `mat-form-field` with `mat-select`
- label: `Saved Configurations`
- options: saved preset names
- placeholder or disabled option when there are no saved presets

Use explicit loading rather than auto-loading on select change.

Reason:

- selecting from the dropdown should be safe
- loading should be a deliberate action because it replaces the current working settings

#### Row 2: action buttons for selected preset

- `Load`
- `Delete`

Behavior:

- `Load` is enabled only when a preset is selected
- `Delete` is enabled only when a preset is selected
- `Delete` should ask for confirmation before removal

Deleting a preset must not wipe the current working configuration. It should only remove the named entry from `saved`.

#### Row 3: name input for save/rename

- `mat-form-field` with `matInput`
- label: `Configuration Name`

Behavior:

- blank by default
- after loading a preset, prefill with that preset's name
- if the user selects a different preset from the dropdown, update the input to that preset's current name

#### Row 4: save/rename/update actions

- `Save as New`
- `Update Saved`
- `Rename`

Suggested behavior:

- `Save as New` creates a new saved preset from the current live settings using the name input
- `Update Saved` overwrites the selected preset's snapshot with the current live settings
- `Rename` changes only the selected preset's `name`

### Dirty-state indicator

Show a small helper text when the loaded preset no longer matches the current settings, for example:

`Current settings have changed since this saved configuration was loaded.`

This can be plain text under the saved-configuration controls. No additional Material component is required.

### Mobile layout

The configuration card already adapts to narrow widths, so the new controls should stack vertically on small screens:

- select full width
- name input full width
- buttons wrap into two rows if needed

`player.component.scss` should add layout classes specifically for this saved-config block rather than relying on the existing tempo-control row styles.

## Components That Likely Do Not Need Dedicated Changes

### `KeysDialogComponent`

No dedicated saved-preset UI is needed here. It already edits the current key ratings, and those ratings become part of the captured snapshot when the dialog closes.

### `AppComponent`

No change should be required. The saved-configuration feature belongs on the practice screen.

## Module and Dependency Changes

### `src/app/app.module.ts`

Likely minimal or no changes if the saved-config UI uses the same Material controls already in use:

- `MatButtonModule`
- `MatCardModule`
- `MatInputModule`
- `MatSelectModule`
- `MatIconModule`

If the implementation adds helper UI such as dividers or tooltips, import only the additional modules actually used.

## Testing Plan

### New tests for the storage service

Suggested file: `src/app/services/configuration-storage.service.spec.ts`

Cover:

- legacy key migration into the new store
- default store creation when storage is empty
- saving a new configuration
- updating an existing configuration snapshot
- renaming a saved configuration
- deleting a saved configuration
- duplicate-name rejection
- deep-copy behavior for nested key ratings

### Update `player.component.spec.ts`

Add tests for:

- loading the migrated or stored current configuration on init
- loading a selected saved configuration into live component state
- preserving custom exercise text when saving and loading
- marking a loaded configuration dirty after the user changes tempo, mode, exercise, root note, or key ratings
- keeping the current working configuration after deleting the selected saved preset
- stopping playback before loading a saved preset

## Documentation Updates

Suggested file to update during implementation:

- `src/app/components/documentation/documentation.component.ts`

Add a short section that explains:

- current settings are remembered automatically on this device
- named saved configurations can be created and reused
- loading a saved configuration replaces the current working settings
- deleting a saved configuration does not delete the currently loaded settings from the screen

## Implementation Sequence

1. Add the new snapshot and saved-preset model files.
2. Add the storage service with migration from the legacy keys.
3. Refactor `PlayerComponent` to use snapshot capture/apply helpers instead of direct storage reads and writes.
4. Add the saved-configuration UI to `player.component.html` and `player.component.scss`.
5. Add CRUD actions for save, load, update, rename, and delete.
6. Add dirty-state handling for a loaded preset.
7. Add service and component tests.
8. Update the in-app documentation text.

## Edge Cases To Handle

- invalid JSON in existing `localStorage`
- old `keysConfiguration` arrays with the wrong length
- saving a preset while the selected exercise is `Custom`
- loading a preset with a custom progression after the `Custom` exercise was edited later in the session
- deleting the currently selected preset
- renaming a preset to a name that already exists
- saving or renaming with leading or trailing whitespace
- loading a preset while practice is running

## Summary

The cleanest implementation is:

- keep one auto-saved working configuration
- add a versioned local-storage store that also contains named saved presets
- move storage and migration logic into a dedicated service
- add a compact saved-config section to the existing player settings card
- support `Save as New`, `Load`, `Update Saved`, `Rename`, and `Delete`

This gives users reusable named setups without changing the existing practice flow or removing the current device-local auto-save behavior.
