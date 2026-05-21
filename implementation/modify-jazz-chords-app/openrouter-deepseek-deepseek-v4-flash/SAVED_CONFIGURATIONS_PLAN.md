# Plan: Save Named Configurations

## Overview

Add the ability to name, save, load, rename, and delete multiple configurations in the Jazz Chord Flashcards app. Configurations are stored in `localStorage` under a single indexed key.

---

## 1. Local Storage Structure

Replace the current 6 flat keys (`tempo`, `mode`, `exercise`, `playRootNote`, `keysConfiguration`, `customExercise`) with a single structured store under the key `jazzConfigurations`.

### Schema

```typescript
interface SavedConfigStore {
  version: 1;
  activeConfigId: string | null;
  configs: SavedConfiguration[];
}

interface SavedConfiguration {
  id: string;                        // crypto.randomUUID()
  name: string;                      // user-given name
  tempo: number;
  mode: 'R' | 'WC' | number;
  exercise: string;                  // exercise name
  playRootNote: boolean;
  keysConfiguration: { keys: { key: string; rating: 1 | 2 | 3 | 4 | 5 }[] };
  customExercise: string | null;     // only meaningful when exercise === 'Custom'
  createdAt: string;                 // ISO 8601
  updatedAt: string;                 // ISO 8601
}
```

### Migration Path

On first load, check if any of the old flat keys exist. If so, read them into a single migration config named `"Migrated Config"`, save it to the new store, delete the old keys, and set `activeConfigId`. This ensures no data loss for existing users.

---

## 2. New Service: `ConfigurationStorageService`

**File:** `src/app/services/configuration-storage.service.ts`

Encapsulates all `localStorage` read/write. Provides:

| Method | Purpose |
|---|---|
| `getAll(): SavedConfiguration[]` | Returns all saved configs |
| `getActiveId(): string \| null` | Returns the active config ID |
| `setActiveId(id: string \| null)` | Sets the active config ID |
| `getById(id: string): SavedConfiguration \| undefined` | Single lookup |
| `save(name: string, snapshot: ConfigSnapshot): SavedConfiguration` | Creates a new config, returns it |
| `update(id: string, snapshot: Partial<ConfigSnapshot>): void` | Updates an existing config (e.g. after save-overwrite) |
| `rename(id: string, newName: string): void` | Renames |
| `delete(id: string): void` | Deletes and clears `activeConfigId` if it was the active one |
| `duplicate(id: string, newName: string): SavedConfiguration` | Clones an existing config |

The service also handles **migration** from the old flat keys (see §1) and emits a signal or observable when the store changes so the UI stays in sync.

**Key behavior:** Saving a configuration is always an explicit user action (e.g. "Save As") and never automatic. Auto-save of the *active* config (overwriting in place) is a future enhancement — for now, the user must click "Save" to persist changes to a saved config.

---

## 3. Model: `ConfigSnapshot`

**File:** `src/app/model/config-snapshot.ts` (new)

A lightweight interface representing the current settings at a point in time. This is what the player component passes to the storage service when saving.

```typescript
export interface ConfigSnapshot {
  tempo: number;
  mode: 'R' | 'WC' | number;
  exercise: string;
  playRootNote: boolean;
  keysConfiguration: { keys: { key: string; rating: 1 | 2 | 3 | 4 | 5 }[] };
  customExercise: string | null;
}
```

A helper function `snapshotFromPlayer(player: PlayerComponent): ConfigSnapshot` collects the current state into a snapshot.

---

## 4. New Dialog: `ConfigManagerDialogComponent`

**File:** `src/app/components/config-manager-dialog/` (4 files: `.ts`, `.html`, `.scss`, `.spec.ts`)

A standalone Angular Material dialog (like `KeysDialogComponent`) opened from the player.

### UI Layout

```
┌──────────────────────────────────────────────┐
│  Manage Configurations          [X] Close     │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─ Save Current As ──────────────────────┐  │
│  │  [Name input            ] [Save]       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ Saved ────────────────────────────────┐  │
│  │  ● Beginner Practice      [Load] [⋮]   │  │
│  │    Major 7 · Tempo 60 · Random         │  │
│  │                                        │  │
│  │  ○ ii-V-I Fast            [Load] [⋮]   │  │
│  │    ii-V-I (one bar) · Tempo 120 · P4   │  │
│  │                                        │  │
│  │  ○ Modal Jazz             [Load] [⋮]   │  │
│  │    Custom · Tempo 80 · Weighted Cycle   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [Close]                                     │
└──────────────────────────────────────────────┘
```

- **Radio indicator** (●/○) shows which config is currently active.
- **⋮ (more) button** opens a small menu or inline actions: Rename, Duplicate, Delete.
- **Load button** immediately applies the selected config to the player (calls `loadConfiguration` on the player via the dialog result).
- After loading, the dialog can close or stay open.

### Component Behavior

| Action | Effect |
|---|---|
| Type a name + click Save | Validates non-empty name, creates new `SavedConfiguration`, adds to store, sets as active |
| Click **Load** | Returns `{ action: 'load', configId }` via `dialogRef.close()`. Player component applies it. |
| Click **Rename** | Opens a small inline edit or prompt for new name, calls `storage.rename()` |
| Click **Duplicate** | Shows a prompt for name (defaults to "Copy of ..."), calls `storage.duplicate()` |
| Click **Delete** | Shows confirmation, calls `storage.delete()` |

---

## 5. Changes to `PlayerComponent`

### `player.component.ts`

1. **Inject `ConfigurationStorageService`**.
2. **Track active config ID** — a signal or property `activeConfigId: string | null`. On init, call `storage.getActiveId()` to see if we should restore a previously active config.
3. **Modify `loadConfiguration()`** — add an overload that accepts a `SavedConfiguration` (or its ID) and applies every field to the current state. The legacy `loadConfiguration()` (reading flat keys) becomes a migration path only.
4. **Add `openConfigManager()`** — opens the `ConfigManagerDialogComponent`.
5. **Handle dialog results** — when the dialog returns `{ action: 'load', configId }`, look up the config and apply it via the new `loadConfiguration(savedConfig)`.
6. **Add `saveCurrentConfig(name: string)`** — creates a `ConfigSnapshot` from current state and passes it to `storage.save()`.
7. **Update the active config indicator** in the UI (e.g. show the name of the active config in the toolbar area).

The old auto-save (`saveConfiguration()` called in every setter) stays as-is for the *current session state* (storing in memory), but no longer writes to `localStorage` on every change — instead, only explicit save/load operations touch `localStorage`. This prevents the flat-key approach from conflicting with the new store.

### `player.component.html`

1. **Add "Manage Configs" button** in the configuration card, near the "Configure Keys" button.
2. **Show active config name** (if one is active) above or next to the manage button, e.g. "Config: Beginner Practice".

---

## 6. Changes to `AppModule`

1. Import `ConfigManagerDialogComponent` in `app.module.ts` (if using NgModule approach). Since `KeysDialogComponent` is `standalone: true`, follow the same pattern — declare it standalone with its own imports.
2. Add `MatTooltipModule` if needed for better UX.

---

## 7. SSR Consideration

The app uses Angular SSR (`provideClientHydration`). `localStorage` access must be guarded with `isPlatformBrowser` or deferred to `ngAfterViewInit`. Currently the code accesses `localStorage` directly in the constructor, which will throw during SSR. The new `ConfigurationStorageService` should inject `PLATFORM_ID` and guard all `localStorage` access:

```typescript
import { isPlatformBrowser } from '@angular/common';

private isBrowser: boolean;

constructor(@Inject(PLATFORM_ID) platformId: object) {
  this.isBrowser = isPlatformBrowser(platformId);
}
```

If not in browser, read/write methods return defaults / no-op.

---

## 8. File Change Summary

| Action | File |
|---|---|
| **New** | `src/app/model/config-snapshot.ts` |
| **New** | `src/app/services/configuration-storage.service.ts` |
| **New** | `src/app/components/config-manager-dialog/config-manager-dialog.component.ts` |
| **New** | `src/app/components/config-manager-dialog/config-manager-dialog.component.html` |
| **New** | `src/app/components/config-manager-dialog/config-manager-dialog.component.scss` |
| **New** | `src/app/components/config-manager-dialog/config-manager-dialog.component.spec.ts` |
| **Modify** | `src/app/components/player/player.component.ts` |
| **Modify** | `src/app/components/player/player.component.html` |
| **Modify** | `src/app/components/player/player.component.scss` |
| **Modify** | `src/app/app.module.ts` |

---

## 9. Implementation Order

1. Create `ConfigSnapshot` model
2. Create `ConfigurationStorageService` with full CRUD + migration logic
3. Create `ConfigManagerDialogComponent` (standalone, like `KeysDialogComponent`)
4. Modify `PlayerComponent` to inject the service, wire up open/load/apply logic
5. Modify `PlayerComponent` template to add the "Manage Configs" button and active config display
6. Update `AppModule` imports
7. Test: save 3 configs, switch between them, rename one, delete one, verify localStorage
8. Test: first load after migration from old flat keys
