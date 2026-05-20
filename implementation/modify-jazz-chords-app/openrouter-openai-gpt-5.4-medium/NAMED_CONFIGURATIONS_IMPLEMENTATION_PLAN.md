# Named Saved Configurations Implementation Plan

## Current State

The app currently persists one working configuration directly from `PlayerComponent` via separate `localStorage` keys.

Current persistence lives in:

- `src/app/components/player/player.component.ts`

Current keys written by `saveConfiguration()` and read by `loadConfiguration()` are:

- `tempo`
- `mode`
- `exercise`
- `playRootNote`
- `keysConfiguration`
- `customExercise`

That means the app remembers exactly one current setup, but it has no concept of a named snapshot that can be saved, listed, loaded, renamed, or deleted.

## Goal

Add support for multiple named saved configurations while preserving the current behavior where the app remembers the user's latest working setup.

The feature should let the user:

- save the current settings under a name
- load a previously saved configuration
- rename an existing saved configuration
- delete a saved configuration
- keep editing the current settings without losing them on refresh

## Recommended Approach

Separate the concept of:

- the current working configuration
- the collection of named saved configurations

This is the cleanest behavior for users:

- loading a saved configuration copies it into the live player settings
- further edits update the current working configuration only
- a saved configuration is changed only when the user explicitly saves or renames it

This avoids an easy failure mode where loading a saved configuration and making one quick tweak silently overwrites the saved preset.

## Data Model

### 1. Current working configuration

Create a single structured representation of all player settings.

Suggested TypeScript model:

```ts
export type PracticeConfiguration = {
  tempo: number;
  mode: 'R' | 'WC' | number;
  exerciseName: string;
  customExercise: string | null;
  playRootNote: boolean;
  keysConfiguration: {
    key: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }[];
};
```

This should capture everything `PlayerComponent` currently restores today.

### 2. Saved named configurations

Suggested saved entry shape:

```ts
export type SavedPracticeConfiguration = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  configuration: PracticeConfiguration;
};
```

Suggested collection wrapper:

```ts
export type SavedPracticeConfigurationStore = {
  version: 1;
  items: SavedPracticeConfiguration[];
};
```

## Local Storage Structure

Use namespaced keys instead of adding more top-level generic keys.

Suggested keys:

- `jazz-chord-flashcards.current-configuration`
- `jazz-chord-flashcards.saved-configurations`

Suggested values:

### `jazz-chord-flashcards.current-configuration`

```json
{
  "tempo": 120,
  "mode": "WC",
  "exerciseName": "ii7 - V7 - Imaj7 (two bars)",
  "customExercise": "iim*7* - V*7* | I*maj7*",
  "playRootNote": true,
  "keysConfiguration": [
    { "key": "C", "rating": 3 },
    { "key": "Db", "rating": 1 }
  ]
}
```

### `jazz-chord-flashcards.saved-configurations`

```json
{
  "version": 1,
  "items": [
    {
      "id": "1716548075123",
      "name": "Drop 2 warmup",
      "createdAt": "2026-05-20T18:00:00.000Z",
      "updatedAt": "2026-05-20T18:00:00.000Z",
      "configuration": {
        "tempo": 90,
        "mode": "R",
        "exerciseName": "Major 7",
        "customExercise": null,
        "playRootNote": false,
        "keysConfiguration": [
          { "key": "C", "rating": 5 }
        ]
      }
    }
  ]
}
```

## Why This Storage Shape

- It groups related data instead of spreading one configuration across six unrelated keys.
- It makes save/load logic much easier to reason about.
- It supports future additions without another round of top-level storage keys.
- It gives room for a `version` field so the browser data can evolve later.

## Migration Strategy

Because users may already have an existing current setup stored in the old keys, the feature should migrate gracefully.

Recommended behavior:

1. On startup, first try to read `jazz-chord-flashcards.current-configuration`.
2. If it does not exist, reconstruct a `PracticeConfiguration` from the legacy keys currently used in `PlayerComponent`.
3. Save that reconstructed object into the new current-configuration key.
4. Keep the legacy-read fallback for now so existing users do not lose their current setup.

This migration matters because persisted browser settings are shipped behavior, and existing users may already rely on them.

## File And Component Changes

### 1. New model file for the current configuration

Add:

- `src/app/model/practice-configuration.ts`

Purpose:

- define the live configuration shape used by persistence
- provide a single source of truth for what counts as a saveable configuration

### 2. New model file for saved entries

Add:

- `src/app/model/saved-practice-configuration.ts`

Purpose:

- define saved preset metadata (`id`, `name`, timestamps)
- keep `PlayerComponent` from accumulating more inline types

### 3. New storage service

Add:

- `src/app/services/configuration-storage.service.ts`

Responsibilities:

- read and write the current working configuration
- read and write the saved configurations collection
- migrate legacy local-storage keys into the new current configuration object
- expose small methods such as:

```ts
loadCurrentConfiguration(): PracticeConfiguration
saveCurrentConfiguration(configuration: PracticeConfiguration): void
loadSavedConfigurations(): SavedPracticeConfiguration[]
saveNamedConfiguration(name: string, configuration: PracticeConfiguration): SavedPracticeConfiguration
updateNamedConfiguration(id: string, name: string, configuration: PracticeConfiguration): void
renameNamedConfiguration(id: string, newName: string): void
deleteNamedConfiguration(id: string): void
getNamedConfiguration(id: string): SavedPracticeConfiguration | null
```

Implementation note:

- this service should be the only place that talks to `localStorage`
- that keeps browser persistence concerns out of the playback logic in `PlayerComponent`

### 4. `PlayerComponent` TypeScript changes

Update:

- `src/app/components/player/player.component.ts`

Main changes:

- replace direct `localStorage` access with the storage service
- add methods to convert between component state and `PracticeConfiguration`
- keep automatic saving of the current working configuration whenever tempo, mode, exercise, custom text, root-note setting, or key ratings change
- load the saved configurations list for display in the UI
- add handlers for:
  - save current configuration under a new name
  - load saved configuration by id
  - rename saved configuration
  - delete saved configuration
- track a selected saved configuration id for the load/manage controls

Suggested helper methods inside `PlayerComponent`:

```ts
private buildCurrentConfiguration(): PracticeConfiguration
private applyConfiguration(configuration: PracticeConfiguration): void
private refreshSavedConfigurations(): void
saveNamedConfiguration(name: string): void
loadNamedConfiguration(id: string): void
renameNamedConfiguration(id: string, name: string): void
deleteNamedConfiguration(id: string): void
```

Important behavioral detail:

- `applyConfiguration()` should update the same state the existing setters already manage
- after applying a loaded preset, call the same persistence path used by normal edits so the loaded preset becomes the current working configuration

### 5. `PlayerComponent` template changes

Update:

- `src/app/components/player/player.component.html`

Add a new "Saved Configurations" section inside the existing configuration card.

Recommended layout:

1. A `mat-form-field` with a `mat-select` showing all saved configuration names.
2. A primary button labeled `Load`.
3. A secondary button labeled `Save Current` or `Save As`.
4. A small manage button or menu with `Rename` and `Delete` actions for the selected saved configuration.
5. A short helper text when no saved configurations exist yet.

Suggested user flow:

- User changes settings in the existing controls.
- User clicks `Save Current`.
- A dialog asks for a name.
- The new name appears in the saved configuration selector.
- User later picks a saved item and clicks `Load`.
- User can rename or delete the selected saved item from the same area.

Why this UI fits the existing app:

- it stays inside the current `mat-card` instead of adding a new full screen area
- it keeps the save/load controls near the settings they affect
- it matches the existing Angular Material control set already used in the player

### 6. `PlayerComponent` styles

Update:

- `src/app/components/player/player.component.scss`

Add styles for:

- the saved-configurations control row
- button wrapping on small screens
- spacing between the selector and action buttons
- a compact empty-state hint

Mobile behavior should be explicit because the current card already adapts for narrow widths and this new control group will add horizontal pressure.

### 7. New name-entry dialog component

Add:

- `src/app/components/configuration-name-dialog/configuration-name-dialog.component.ts`
- `src/app/components/configuration-name-dialog/configuration-name-dialog.component.html`
- `src/app/components/configuration-name-dialog/configuration-name-dialog.component.scss`

Purpose:

- reuse the same lightweight dialog for both `Save Current` and `Rename`
- validate empty names before submit
- optionally trim whitespace

Dialog behavior:

- title changes based on mode: `Save Configuration` or `Rename Configuration`
- one text input for the name
- `Cancel` and `Save` buttons
- focus the input on open

### 8. `AppModule` updates

Update:

- `src/app/app.module.ts`

Potential changes:

- register/import the new non-standalone pieces if needed
- if the new dialog is standalone, import only the Angular Material modules it needs there instead of expanding `AppModule` more than necessary

## UI Details

### Placement

Place the new saved-configurations controls below the existing core settings and above the `Configure Keys` button, or immediately below that button.

Recommended order inside the card:

1. Tempo
2. Chords
3. Custom configuration textarea when relevant
4. Mode
5. Play Root Note checkbox
6. Configure Keys button
7. Saved Configurations section

Reasoning:

- the saved configuration represents the whole setup, including key ratings
- placing it after all setting controls makes the scope clear

### Save naming behavior

Recommended rules:

- trim leading and trailing whitespace
- disallow empty names
- allow duplicate names only if the app explicitly handles them, otherwise block duplicates and show a validation message

Preferred behavior:

- treat names as unique, case-insensitive for validation
- if a duplicate exists, prompt the user to rename instead of silently overwriting

That is safer than hidden replacement and easier to understand.

### Loading behavior

Recommended behavior when the user clicks `Load`:

- immediately apply the selected saved configuration to the live settings
- update the current working configuration storage
- update the visible controls and any dependent playback state

Do not auto-start playback when loading.

### Rename behavior

Recommended behavior:

- rename only the selected saved configuration entry
- do not touch the current working configuration unless the renamed item is also currently selected in the UI list

### Delete behavior

Recommended behavior:

- require a confirmation step before deleting
- after deletion, clear the selected saved configuration if it was deleted
- do not reset the live player settings just because a saved item was deleted

This keeps deletion scoped to the stored preset list, not the active working session.

## State Management Notes

The current component already has all of the live state needed for snapshotting:

- `toneService.tempo()`
- `selectedMode()`
- `selectedExercise().name`
- `toneService.playRootNote`
- `keysConfiguration`
- the `Custom` exercise text

The main implementation work is organizing that data into one serializable object and routing persistence through a service.

One important edge case is the custom exercise:

- if the selected exercise is not `Custom`, still store the `customExercise` text so the user's last custom progression is preserved for later
- when loading a saved configuration whose `exerciseName` is `Custom`, restore the saved custom text before setting the selected exercise or immediately after, so the textarea and exercise object stay in sync

## Validation And Edge Cases

The implementation should handle:

- malformed JSON in the new saved-configurations key
- malformed JSON in the current-configuration key
- legacy `keysConfiguration` data with the wrong number of keys
- missing exercise names if the preset references a removed or renamed exercise
- duplicate names during save or rename
- loading a preset created before future settings are added

Recommended fallbacks:

- invalid storage data: fall back to defaults, not app failure
- missing exercise: fall back to the first exercise
- invalid key ratings: rebuild `KeysConfiguration` defaults

## Testing Plan

### Unit tests for the storage service

Add tests for:

- loading defaults when storage is empty
- migrating from legacy keys
- saving a new named configuration
- renaming a named configuration
- deleting a named configuration
- rejecting duplicate names if that rule is chosen
- surviving invalid JSON in local storage

### Component tests for `PlayerComponent`

Update or expand:

- `src/app/components/player/player.component.spec.ts`

Cover:

- saved configurations are shown in the UI
- clicking `Load` applies a stored configuration
- saving opens the naming dialog and persists a new entry
- rename and delete actions call the storage service correctly
- current working configuration still auto-saves on ordinary setting changes

### Dialog tests

Add tests for:

- empty name validation
- trimming whitespace
- prefilled name when used for rename

## Suggested Implementation Order

1. Introduce `PracticeConfiguration` and `SavedPracticeConfiguration` models.
2. Add `ConfigurationStorageService` with legacy migration for the current configuration.
3. Refactor `PlayerComponent` to read and write current configuration via the service.
4. Add saved configuration list state and load/save/delete/rename handlers to `PlayerComponent`.
5. Add the name-entry dialog component.
6. Add the saved-configurations UI to `player.component.html` and corresponding styles.
7. Add tests for storage and component behavior.

## Recommended Scope Boundary

For the first implementation, keep the scope to browser-local saved configurations only.

Do not include yet:

- export/import presets
- cloud sync
- sharing presets by URL
- autosaving back into a named preset
- multi-user profile support

That keeps the feature aligned with the current app architecture and the user's request.

## Summary

The core change is to move from scattered one-off `localStorage` keys in `PlayerComponent` to a structured persistence model with:

- one current working configuration object
- one collection of named saved configurations
- one storage service that owns browser persistence
- a small UI section in `PlayerComponent` for save/load/rename/delete

That approach is consistent with the current codebase, keeps the playback logic in `PlayerComponent`, and adds the new feature without forcing a larger architectural rewrite.
