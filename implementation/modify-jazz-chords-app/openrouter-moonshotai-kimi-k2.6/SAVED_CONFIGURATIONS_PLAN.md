# Plan: Save Named Configurations for Jazz Chord Trainer

## 1. Current State Analysis

The application currently stores a **single active configuration** directly in `localStorage` via the `PlayerComponent`:

| Setting | `localStorage` Key | Type |
|---|---|---|
| Tempo | `tempo` | `number` |
| Mode | `mode` | `'R' \| 'WC' \| number` |
| Exercise | `exercise` | `string` (exercise name) |
| Play Root Note | `playRootNote` | `boolean` |
| Keys Configuration | `keysConfiguration` | `JSON` (`KeysConfiguration`) |
| Custom Exercise String | `customExercise` | `string` |

`PlayerComponent.loadConfiguration()` reads these keys in its constructor.  
`PlayerComponent.saveConfiguration()` writes them whenever any setting changes.

**Problem:** This is a singleton snapshot. Changing any setting immediately overwrites the previous state, so users cannot maintain multiple practice setups (e.g., "Slow ii-V-I in C" vs. "Fast Random Maj7/Min7/Dom7").

---

## 2. Goals

1. Allow the user to **save the current settings under a custom name**.
2. Allow the user to **load a previously saved configuration**, restoring all settings at once.
3. Allow the user to **rename** a saved configuration.
4. Allow the user to **delete** a saved configuration.
5. Keep the current "last active" settings behavior as a fallback / auto-save layer.
6. Maintain backward compatibility with existing `localStorage` entries where possible.

---

## 3. Proposed Data Model

### 3.1 `SavedConfiguration` Interface

Create a new file: `src/app/model/saved-configuration.ts`

```typescript
export interface SavedConfiguration {
  /** Unique identifier (e.g. crypto.randomUUID or timestamp + random) */
  id: string;

  /** User-defined name (e.g. "Slow ii-V-I practice") */
  name: string;

  /** ISO timestamp for sorting / metadata */
  createdAt: string;
  updatedAt: string;

  /** The complete snapshot of settings */
  payload: {
    tempo: number;
    mode: 'R' | 'WC' | number;
    exerciseName: string;
    customExercise: string | null;
    playRootNote: boolean;
    keysConfiguration: KeysConfiguration;
  };
}
```

### 3.2 Local Storage Schema

| Key | Value | Purpose |
|---|---|---|
| `jct_savedConfigurations` | `SavedConfiguration[]` (JSON) | The user's library of named presets. |
| `jct_lastActiveConfigurationId` | `string \| null` | The ID of the saved configuration currently in use. Helps the UI indicate "you are editing 'X'". |

> **Backward compatibility:** Leave the existing six `localStorage` keys (`tempo`, `mode`, `exercise`, `playRootNote`, `keysConfiguration`, `customExercise`) untouched. They continue to act as the "current / unsaved" working state. When the app loads with no `jct_lastActiveConfigurationId`, it behaves exactly as it does today.

---

## 4. Architecture Changes

### 4.1 New `ConfigurationService`

Create: `src/app/services/configuration.service.ts`

**Responsibilities:**
- Encapsulate all `localStorage` reads/writes related to saved configurations.
- Provide CRUD operations:
  - `getSavedConfigurations(): SavedConfiguration[]`
  - `saveConfiguration(name: string, payload: ...): SavedConfiguration`
  - `updateConfiguration(id: string, updates: Partial<...>): void`
  - `deleteConfiguration(id: string): void`
  - `getConfigurationById(id: string): SavedConfiguration | undefined`
- Track the currently loaded configuration ID in memory and in `localStorage`.
- Expose signals for reactive UI updates (e.g. `savedConfigurations = signal<SavedConfiguration[]>([])`, `activeConfigurationId = signal<string | null>(null)`).

**Why a service is needed:**
`PlayerComponent` already mixes chord-generation logic with persistence. Extracting saved-config persistence into a service follows the Single Responsibility Principle and makes testing easier.

### 4.2 `PlayerComponent` Refactor

Modify: `src/app/components/player/player.component.ts` and `.html`

**Changes in `.ts`:**
1. Inject `ConfigurationService`.
2. When `saveConfiguration()` is called (after any user change), **also** update the in-memory payload of the currently active saved configuration if `jct_lastActiveConfigurationId` is set.  
   This allows "live editing" of a saved preset: the user loads a preset, tweaks tempo, and the preset stays up to date without requiring an explicit "Save" click for every tweak.
3. Add methods:
   - `openSaveConfigurationDialog()` – opens a dialog to name & save the current state as a new preset.
   - `openManageConfigurationsDialog()` – opens a dialog to list, load, rename, and delete presets.
4. `loadConfiguration()` should remain as-is for bootstrapping the working state from legacy keys, but after initialization it can optionally check `jct_lastActiveConfigurationId` and overlay the saved preset on top.

**Changes in `.html`:**
- Add UI affordances inside or above the configuration card:
  - **"Save as Preset"** button (icon: `save`).
  - **"Presets"** button (icon: `folder_open`) that opens the management dialog.
  - If a preset is currently loaded, display its name as a chip or subtitle (e.g., *Editing: "Slow ii-V-I"*) with an indicator that auto-saves are active.

### 4.3 New Dialog Components

Create a new folder: `src/app/components/configuration-dialog/`

#### `SaveConfigurationDialogComponent`
- **Purpose:** Prompt the user for a name and confirm saving.
- **Inputs:** (via dialog data) suggested name, e.g. `"Preset 1"` or current timestamp.
- **Outputs:** Returns the entered name, or `null` if cancelled.
- **UI:**
  - `mat-form-field` with `matInput` (required, max length 50).
  - "Save" and "Cancel" buttons.
  - Inline validation for duplicate names (warn but allow, or auto-append "(2)").

#### `ManageConfigurationsDialogComponent`
- **Purpose:** List all saved configurations and let the user load, rename, or delete them.
- **State:** Receives the array of `SavedConfiguration[]` from `ConfigurationService` (or reads it directly).
- **UI:**
  - `mat-list` or `mat-table` showing:
    - Name (primary text).
    - Created date (secondary text).
    - Action buttons on the right:
      - **Load** (`mat-icon-button` with `input` icon) – restores the payload into the current app state, closes the dialog, and shows a snackbar: *"Loaded 'X'"*.
      - **Rename** (`mat-icon-button` with `edit` icon) – inline or secondary dialog to edit the name.
      - **Delete** (`mat-icon-button` with `delete` icon, color="warn") – asks for confirmation (`mat-dialog` simple dialog or `window.confirm`), then removes it.
  - Empty state message if no presets exist: *"No saved presets yet. Save your current settings to create one."*

### 4.4 `KeysDialogComponent` – No Structural Change Needed

The keys dialog already mutates the `KeysConfiguration` object in-place and closes. The caller (`PlayerComponent`) already calls `saveConfiguration()` in `afterClosed()`, so the change will propagate to localStorage and, with the refactor, to the active preset automatically.

---

## 5. UI Design Specification

### 5.1 Player Page – Configuration Card Header

Add a new toolbar/chip row **inside** `<mat-card>` at the top:

```
┌─────────────────────────────────────────────┐
│  [Save Preset]  [Presets ▼]                 │  ← new
│  ─────────────────────────────────────────  │
│  Tempo  [  80 ]  -1  +1  -10  +10          │
│  Chords  [Maj 7 / Min 7 / Dom 7 ▼]         │
│  ...                                       │
└─────────────────────────────────────────────┘
```

- **"Save Preset"** (`mat-stroked-button`, icon `save`):
  - Always enabled.
  - Click → `SaveConfigurationDialog`.
  - After save, update the chip to show the new preset name.

- **"Presets"** (`mat-stroked-button`, icon `folder_open`):
  - Click → `ManageConfigurationsDialog`.

- **Active Preset Chip** (`mat-chip` or simple text):
  - Displayed only when `jct_lastActiveConfigurationId` is set.
  - Example text: `"Preset: Slow ii-V-I (auto-saving)"`.
  - If the user changes settings while a preset is active, the preset is silently updated (live edit). The user can also use "Save Preset" to fork a new preset from these changes.

### 5.2 Save Dialog

```
┌─────────────────────────────┐
│  Save Preset                 │
│  ─────────────────────────   │
│  Name: [________________]   │
│        ^ required            │
│                              │
│  [Cancel]    [Save]          │
└─────────────────────────────┘
```

- **Validation:**
  - Required field.
  - Trim whitespace.
  - Max 50 characters.
  - If a name already exists, show a `mat-hint`: *"A preset with this name already exists. Saving will overwrite it."* or generate a unique name.

### 5.3 Manage Dialog

```
┌─────────────────────────────────────────────┐
│  Presets                                     │
│  ─────────────────────────────────────────  │
│  ┌─────────────────────────────────────┐    │
│  │ Slow ii-V-I                  [Load] [Rename] [Delete] │
│  │ May 20, 2026                            │
│  ├─────────────────────────────────────┤    │
│  │ Random Maj7 drills           [Load] [Rename] [Delete] │
│  │ May 19, 2026                            │
│  └─────────────────────────────────────┘    │
│                                              │
│  [Close]                                     │
└─────────────────────────────────────────────┘
```

- **Load:**
  - Immediately applies the payload to the current app state.
  - Updates `jct_lastActiveConfigurationId`.
  - Shows `MatSnackBar` for 2 seconds: *"Loaded 'Slow ii-V-I'"*.
  - Closes the dialog.

- **Rename:**
  - Opens a small inline edit or secondary dialog.
  - Validates for empty / duplicate names.

- **Delete:**
  - Opens a confirmation dialog:
    - Title: *"Delete preset?"*
    - Content: *"Are you sure you want to delete 'Slow ii-V-I'? This cannot be undone."*
    - Actions: `[Cancel]` `[Delete]` (warn color).
  - If the deleted preset was the active one, clear `jct_lastActiveConfigurationId` and remove the active chip from the UI.

---

## 6. File & Component Change List

### New Files

| File | Description |
|---|---|
| `src/app/model/saved-configuration.ts` | `SavedConfiguration` interface and payload type alias. |
| `src/app/services/configuration.service.ts` | Service for CRUD operations on saved presets in `localStorage`. |
| `src/app/components/save-configuration-dialog/` | Dialog for naming and saving a new preset. |
| `src/app/components/manage-configurations-dialog/` | Dialog for listing, loading, renaming, and deleting presets. |

### Modified Files

| File | Changes |
|---|---|
| `src/app/components/player/player.component.ts` | Inject `ConfigurationService`; add dialog-launch methods; update `saveConfiguration()` to sync active preset if applicable. |
| `src/app/components/player/player.component.html` | Add "Save Preset", "Presets" buttons and active-preset chip inside the `<mat-card>`. |
| `src/app/app.module.ts` | Declare new dialog components and import any new Angular Material modules (`MatSnackBarModule`, `MatChipsModule`, `MatListModule`, etc.). |

### Untouched (Backward Compatibility)

| File | Reason |
|---|---|
| `src/app/model/configuration.ts` | Static exercise definitions; no change required. |
| `src/app/model/keys-configuration.ts` | Existing class structure is sufficient; can be reused as-is. |
| `src/app/services/tone.service.ts` | Unrelated to persistence; no change required. |
| `src/app/components/keys-dialog/*` | Already emits changes that `PlayerComponent` captures. |

---

## 7. Local Storage Migration & Safety

- **No migration script is needed** because legacy keys (`tempo`, `mode`, etc.) are kept as the "current working state."
- On first run after the update:
  1. `loadConfiguration()` reads the legacy keys → user sees their last session exactly as before.
  2. `jct_savedConfigurations` is initialized to `[]` if absent.
  3. The user can immediately "Save Preset" to create their first named configuration.
- Future iterations could consider an **Import / Export** feature (JSON file) so users can back up presets, but that is out of scope for this plan.

---

## 8. Edge Cases to Handle

| Edge Case | Strategy |
|---|---|
| **Duplicate preset names** | Allow duplicates but show a warning hint, or auto-suffix with "(2)", "(3)"… |
| **Empty preset name** | Block submission with `mat-error`: *"Name is required."* |
| **Very long preset name** | Cap at 50 chars; truncate visually in the list with ellipsis (`text-overflow: ellipsis`). |
| **User deletes the active preset** | Clear `jct_lastActiveConfigurationId`; keep current settings in memory; remove active chip. |
| **User loads a preset but then changes settings** | Auto-save the changes back into that same preset (live editing). If the user wants to fork, they must use "Save Preset" again with a new name. |
| **`localStorage` is full** | Wrap writes in `try/catch`; show snackbar: *"Could not save preset: storage is full."* |
| **Corrupted `localStorage` JSON** | Wrap `JSON.parse` in `try/catch`; fallback to `[]` for saved configs and log a console warning. |

---

## 9. Suggested Implementation Order

1. **Model & Service**
   - Create `SavedConfiguration` interface.
   - Create `ConfigurationService` with full CRUD, signals, and localStorage I/O.
   - Write unit tests for the service (happy path, duplicate names, corruption, quota exceeded).

2. **Save Dialog**
   - Create `SaveConfigurationDialogComponent` with form validation.
   - Wire it into `PlayerComponent` via a temporary method.

3. **Manage Dialog**
   - Create `ManageConfigurationsDialogComponent` with load / rename / delete actions.
   - Wire it into `PlayerComponent`.

4. **Player UI**
   - Add buttons and active-preset chip to `player.component.html`.
   - Update `player.component.ts` to use `ConfigurationService` and handle auto-save of active presets.

5. **Polish**
   - Add `MatSnackBar` feedback for all user actions (save, load, delete, rename).
   - Verify keyboard accessibility (Enter to save, Escape to close dialogs).
   - Test responsive layout on mobile (stack buttons vertically if needed).

6. **Regression Testing**
   - Confirm that existing `localStorage` settings still load on app start.
   - Confirm that the app behaves identically when no presets are ever created.

---

## 10. Future Enhancements (Out of Scope)

- **Import / Export JSON:** Allow users to download their preset library and load it on another device.
- **Default Presets:** Ship a handful of factory presets (e.g., "Beginner ii-V-I", "All Random") that cannot be deleted.
- **Preset Ordering / Folders:** Drag-and-drop sorting or categorization once the user accumulates many presets.
- **Cloud Sync:** Store presets in a backend database linked to a user account.
