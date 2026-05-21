# Plan: Save Named Configurations

## Current State

The app (Angular 19, Angular Material, Tone.js) saves one unnamed configuration via multiple localStorage keys:

| localStorage key      | Type     | Source                            |
|-----------------------|----------|-----------------------------------|
| `tempo`               | number   | `PlayerComponent.saveConfiguration()` |
| `mode`                | string   | same                              |
| `exercise`            | string   | same                              |
| `playRootNote`        | string   | same                              |
| `keysConfiguration`   | JSON     | same                              |
| `customExercise`      | string   | same                              |

All configuration logic lives in `PlayerComponent` (`src/app/components/player/player.component.ts`). There is no service abstraction --- the component directly reads/writes localStorage and holds all config state.

---

## 1. Data Model

### 1.1 Configuration DTO (new file: `src/app/model/saved-configuration.ts`)

Define a TypeScript interface for a named, persisted configuration:

```typescript
export interface SavedConfiguration {
  id: string;            // crypto.randomUUID()
  name: string;          // user-chosen name, e.g. "Latin Jazz Warmup"
  tempo: number;
  mode: string;          // 'R' | 'WC' | number string e.g. '5'
  exerciseName: string;  // name of the selected exercise
  playRootNote: boolean;
  keysConfiguration: {   // KeysConfiguration shape
    keys: {
      key: string;
      rating: 1 | 2 | 3 | 4 | 5;
    }[];
  };
  customConfiguration?: string; // only present when exerciseName === 'Custom'
  createdAt: string;     // ISO 8601 timestamp
  updatedAt: string;     // ISO 8601 timestamp
}
```

### 1.2 localStorage Structure

Replace the current scattered keys with a single structured key:

```
localStorage key: `jazz-chord-configs`
```

Its value is a JSON object:

```json
{
  "activeConfigId": "uuid-of-currently-loaded-config-or-null",
  "configs": [
    { … SavedConfiguration … },
    { … SavedConfiguration … }
  ]
}
```

**Fallback / migration:** If `jazz-chord-configs` does not exist on app load, check for the old scattered keys (`tempo`, `mode`, etc.). If found, hydrate the current settings from them ("activeConfigId": null) and let the user save them as a named configuration.

---

## 2. New / Changed Files

### 2.1 New: `src/app/services/configuration.service.ts`

Extract all config persistence logic from `PlayerComponent` into a dedicated, injectable service with these responsibilities:

| Method                                   | Description                                         |
|------------------------------------------|-----------------------------------------------------|
| `getConfigs(): SavedConfiguration[]`     | Returns all saved configs from localStorage.        |
| `getActiveConfigId(): string|null`       | Returns the ID of the currently active config.      |
| `saveConfig(config: SavedConfiguration)` | Upserts a config to localStorage.                   |
| `deleteConfig(id: string)`               | Removes a config; clears activeConfigId if it was that one. |
| `loadConfig(id: string): SavedConfiguration | null` | Loads a config and sets it as `activeConfigId`; returns it. |
| `setActiveConfigId(id: string|null)`     | Marks which config is currently in use.             |
| `captureCurrentSettings(name: string)`   | Reads current component state, wraps in SavedConfiguration, persists it, sets activeConfigId. |
| `buildConfigFromCurrent(): SavedConfiguration` | Helper: snapshot the current (in-memory) settings into a SavedConfiguration (excluding `id`, `createdAt`, `updatedAt` --- those are set by `captureCurrentSettings`). |

The service should use Angular's `PLATFORM_ID` + `isPlatformBrowser()` guard to safely handle SSR (already a concern in an Angular Universal app --- the app has `main.server.ts`).

### 2.2 New: `src/app/components/config-manager/config-manager.component.ts` + template + styles

A new standalone component (or dialog, if you prefer a modal experience). It provides the full UI for managing saved configurations. Since the app already uses `MatDialog` for the keys dialog, a standalone sidebar or panel component would feel more natural for a persistent manager. **Recommendation:** integrate it into the player page as a collapsible section rather than a dialog, so it remains accessible while settings are modified.

The template should contain:

- **Save section:**
  - A `mat-form-field` text input for the name.
  - A "Save current settings as..." button (disabled if name is empty or matches existing name).
- **Load section:**
  - An **accordion** or **select list** showing all saved configurations. Each entry shows:
    - Config name (bold)
    - "Last used: `<date>`"
    - "Tempo: `<tempo>`, Exercise: `<exerciseName>`, Mode: `<modeName>`"
  - A "Load" button per entry (calls `loadConfig` on the service, then applies all settings to the player).
  - Optional: The currently loaded config is highlighted / marked "active."
- **Manage section** (per entry, via icon buttons):
  - **Rename** (pencil icon) opens a small inline rename field.
  - **Duplicate** (copy icon) creates a copy with a new name (e.g. "My Config (copy)").
  - **Delete** (trash icon) with a confirmation (MatDialog confirm or inline undo-toast).

#### Keyboard accessibility considerations (the app already uses keyboard shortcuts)
All management actions should be reachable via Tab-navigation. The name input should auto-focus when the save section is expanded.

### 2.3 Changed: `src/app/components/player/player.component.ts`

- Inject `ConfigurationService`.
- In `ngOnInit()`, call the migration logic (`ConfigurationService` loads old scattered keys if `jazz-chord-configs` is absent).
- Replace every `localStorage.setItem(...)` call in `saveConfiguration()` with a call to the service (no direct localStorage access from the component anymore).
- When `loadConfiguration()` runs, if an `activeConfigId` is set, load it from the service; otherwise fall back to individual keys / defaults (the migration path above).
- `saveConfiguration()` no longer writes individual keys --- it only marks settings as "dirty" / unsaved (the current settings are *not* a named config yet, but they persist in-memory and can be saved at any time by the user via the config-manager UI).
  - **Important UX decision:** Should the app auto-save the current unnamed configuration to localStorage (so it survives a page reload) even if the user hasn't explicitly named it yet?
    - **Yes**, via a reserved key like `__active_unsaved__` inside the `jazz-chord-configs` store. When the user later clicks "Save", that anonymous temporary config gets named. This avoids losing work on reload.

### 2.4 Changed: `src/app/components/player/player.component.html`

Insert the `<app-config-manager>` component into the player page. A good location is below the configuration card (`<mat-card id="configuration">`) and above the `<h2>Description</h2>` section. Use an `<mat-accordion>` or a simple `<section>` with a header like "Saved Setups".

### 2.5 Changed: `src/app/model/configuration.ts`

No structural changes needed, but the exercises array entries could gain an optional `id` field for stable referencing across config loads (currently referenced by `name`). This is a judgment call --- names are already unique, so referencing by name works today. I would keep name-based for now and defer adding IDs.

### 2.6 New: `src/app/model/saved-configuration.ts`

As described in section 1.1.

### 2.7 Changed: `src/app/app.module.ts`

- Add `ConfigurationService` to `providers` (it's `providedIn: 'root'`, so this happens automatically if you mark it that way).
- Optionally register `ConfigManagerComponent` in `declarations` or import it as a standalone component.

### 2.8 Optional: `src/app/model/keys-configuration.ts`

May need a `toJSON()` / `fromJSON()` static method or serialize/deserialize helpers to prevent issues with the current manual `JSON.parse` / `JSON.stringify` in `PlayerComponent`.

---

## 3. localStorage Migration Strategy

On app startup, in `ConfigurationService.initialize()`:

1. Check if `localStorage.getItem('jazz-chord-configs')` exists.
   - **Exists:** Parse it; load the config identified by `activeConfigId` (or the anonymous `__active_unsaved__`). Done.
   - **Does not exist (legacy user):**
     a. Read all six old keys.
     b. Build a `SavedConfiguration` from them with name `"Imported Settings"`.
     c. Set `activeConfigId` to that imported config.
     d. Save the structured store.
     e. Remove the old individual keys (`removeItem` each) to clean up.

2. This migration should run once per browser (the `jazz-chord-configs` key itself acts as the flag that migration has occurred).

---

## 4. UI Mockup

```
 ┌─────────────────────────────────────────────┐
 │  Practice Jazz Chords                       │
 ├─────────────────────────────────────────────┤
 │   ... [chord display, beats, buttons] ...    │
 │                                             │
 │  Tempo: [60]  Chords: [Maj 7]  ...          │
 │  [ Configure Keys ]                         │
 ├─────────────────────────────────────────────┤
 │  ► Saved Setups                     (panel) │
 ├─────────────────────────────────────────────┤
 │                                             │
 │  ┌─ Save Current ─────────────────────────┐ │
 │  │  Name: [___________________]           │ │
 │  │  [ Save ]                              │ │
 │  └────────────────────────────────────────┘ │
 │                                             │
 │  ┌─ My Warmup ────────────────────────────┐ │
 │  │  Tempo: 80 │ Exercise: ii7-V7-Imaj7     │ │
 │  │  Mode: Random │ Root note: on           │ │
 │  │  Last used: 2026-05-21                  │ │
 │  │  [ Load ]                              │ │
 │  └────────────────────────────────────────┘ │
 │                                             │
 │  ┌─ ii-V-in-all-keys ─────────────────────┐ │
 │  │  Tempo: 120 │ Exercise: ii7-V7-Imaj7    │ │
 │  │  Mode: −5 (4th down) │ Root: on         │ │
 │  │  [ Edit ]  [ Load ]  [ ✕ Delete ]      │ │
 │  │  (currently loaded ● active indicator)  │ │
 │  └────────────────────────────────────────┘ │
 │                                             │
 └─────────────────────────────────────────────┘
```

---

## 5. Implementation Sequence

Recommended order of work, each step testable on its own:

| Step | Task                                                  | Files touched                                             |
|------|-------------------------------------------------------|-----------------------------------------------------------|
| 1    | Create `SavedConfiguration` interface                  | New: `src/app/model/saved-configuration.ts`               |
| 2    | Create `ConfigurationService` (read/write storage)      | New: `src/app/services/configuration.service.ts`          |
| 3    | Add migration logic in the service                     | Same file + `PlayerComponent.constructor()`               |
| 4    | Rewire `PlayerComponent` to use service instead of direct localStorage | `player.component.ts`                     |
| 5    | Add anonymous auto-save for unnamed current settings   | `ConfigurationService`, `PlayerComponent`                 |
| 6    | Create `ConfigManagerComponent` with save + load UI    | New: `src/app/components/config-manager/*`               |
| 7    | Insert manager into player page template               | `player.component.html`                                   |
| 8    | Add rename + delete + duplicate actions                | `ConfigManagerComponent`, `ConfigurationService`          |
| 9    | Style and polish                                       | `config-manager.component.scss`, global styles            |
| 10   | Update unit tests                                      | `*.spec.ts` files                                         |

---

## 6. Edge Cases & Considerations

| Scenario                                          | Handling                                                       |
|--------------------------------------------------|----------------------------------------------------------------|
| Name collision when saving                       | `ConfigurationService` rejects duplicate names (compare case-insensitively trimmed). UI shows inline error. |
| Delete the currently loaded config                | `activeConfigId` set to null; current settings remain in memory but are now "unnamed." Auto-save kicks in for the unnamed state. |
| Custom exercise configuration string              | Stored inside `customConfiguration` field of `SavedConfiguration`. Restored when loading a config whose `exerciseName === 'Custom'`. |
| `KeysConfiguration` shape mismatch on load       | Fall back to default `KeysConfiguration`; log a console warning. |
| localStorage quota exceeded                      | Show a snackbar/toast: "Storage full — delete an old config to save more." localStorage is ~5 MB, enough for thousands of configs, but handle gracefully. |
| SSR (server-side rendering)                      | All localStorage access guarded behind `isPlatformBrowser(this.platformId)`. The service does nothing on the server. |

---

## 7. Summary

**Net new files:** 3 (`saved-configuration.ts`, `configuration.service.ts`, `config-manager` component).

**Modified files:** 2 (`player.component.ts`, `player.component.html`) plus optional changes to `app.module.ts` and `keys-configuration.ts`.

**Deleted code:** ~6 lines of scattered `localStorage.setItem` / `getItem` calls in `PlayerComponent`, replaced by service calls.

**Backward compatibility:** Legacy users with old localStorage keys are migrated on first load; nothing is lost.