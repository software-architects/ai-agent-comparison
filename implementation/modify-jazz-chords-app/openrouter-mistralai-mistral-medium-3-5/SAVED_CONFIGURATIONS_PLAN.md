# Implementation Plan: Named Configurations for Jazz Chord Flashcards

## Overview

The jazz-chord-flashcards app currently stores a single configuration in localStorage (tempo, mode, exercise, playRootNote, keysConfiguration, customExercise). This plan adds the ability to save, name, load, rename, and delete multiple configurations.

## Current State Analysis

### Current Configuration Structure
The app stores these individual items in localStorage:
- `tempo` (number)
- `mode` (string: 'R' | 'WC' | number)
- `exercise` (string: exercise name)
- `playRootNote` (boolean)
- `keysConfiguration` (JSON string of KeysConfiguration object)
- `customExercise` (string)

### Key Components
- **PlayerComponent** (`src/app/components/player/player.component.ts`): Contains all configuration logic, `saveConfiguration()` and `loadConfiguration()` methods (lines 377-434)
- **Configuration Model** (`src/app/model/configuration.ts`): Defines exercises, keys, modes
- **KeysConfiguration Model** (`src/app/model/keys-configuration.ts`): Defines the keys with ratings
- **KeysDialogComponent**: Allows configuring key ratings

## Proposed Solution

### 1. Local Storage Structure

```typescript
// New structure for saved configurations
interface SavedConfiguration {
  id: string;           // UUID v4 for unique identification
  name: string;         // User-provided name
  tempo: number;
  mode: 'R' | 'WC' | number;
  exercise: string;
  customExercise: string | null;  // Only for "Custom" exercise
  playRootNote: boolean;
  keysConfiguration: Object;  // The KeysConfiguration object
  createdAt: number;    // Timestamp
  updatedAt: number;    // Timestamp
}

// localStorage key: 'savedConfigurations'
// Value: JSON string of SavedConfiguration[]
```

Current single configuration keys (`tempo`, `mode`, `exercise`, etc.) will be migrated to a new key `currentConfigurationId` that references one of the saved configurations. The individual keys will remain for backward compatibility but will not be the source of truth.

### 2. New Model File

**File: `src/app/model/saved-configuration.ts`**
```typescript
export interface SavedConfiguration {
  id: string;
  name: string;
  tempo: number;
  mode: 'R' | 'WC' | number;
  exercise: string;
  customExercise: string | null;
  playRootNote: boolean;
  keysConfiguration: any;
  createdAt: number;
  updatedAt: number;
}

export interface ConfigurationsState {
  savedConfigurations: SavedConfiguration[];
  currentConfigurationId: string | null;
}
```

### 3. New Service

**File: `src/app/services/configuration.service.ts`**

This service will manage all configuration-related operations:

```typescript
import { Injectable } from '@angular/core';
import { SavedConfiguration } from '../model/saved-configuration';
import { KeysConfiguration } from '../model/keys-configuration';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private readonly STORAGE_KEY = 'savedConfigurations';
  private readonly CURRENT_ID_KEY = 'currentConfigurationId';

  // Get all saved configurations
  getAll(): SavedConfiguration[] {
    const json = localStorage.getItem(this.STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  }

  // Get current configuration by ID
  getCurrent(): SavedConfiguration | null {
    const id = localStorage.getItem(this.CURRENT_ID_KEY);
    if (!id) return null;
    const all = this.getAll();
    return all.find(c => c.id === id) ?? null;
  }

  // Save a new configuration
  save(configuration: Omit<SavedConfiguration, 'id' | 'createdAt' | 'updatedAt'>): string {
    const all = this.getAll();
    const id = crypto.randomUUID();
    const newConfig: SavedConfiguration = {
      ...configuration,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    all.push(newConfig);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    localStorage.setItem(this.CURRENT_ID_KEY, id);
    return id;
  }

  // Update an existing configuration
  update(id: string, updates: Partial<SavedConfiguration>): boolean {
    const all = this.getAll();
    const index = all.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    all[index] = { ...all[index], ...updates, updatedAt: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return true;
  }

  // Delete a configuration
  delete(id: string): boolean {
    const all = this.getAll();
    const index = all.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    all.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    
    // If deleted config was current, clear current
    if (localStorage.getItem(this.CURRENT_ID_KEY) === id) {
      localStorage.removeItem(this.CURRENT_ID_KEY);
    }
    return true;
  }

  // Set current configuration
  setCurrent(id: string): boolean {
    const all = this.getAll();
    if (!all.some(c => c.id === id)) return false;
    localStorage.setItem(this.CURRENT_ID_KEY, id);
    return true;
  }

  // Migrate legacy single configuration to new system
  migrateLegacy(): void {
    // Check if migration already done
    if (localStorage.getItem(this.STORAGE_KEY)) return;
    
    const tempo = localStorage.getItem('tempo');
    const mode = localStorage.getItem('mode');
    const exercise = localStorage.getItem('exercise');
    const playRootNote = localStorage.getItem('playRootNote');
    const keysConfiguration = localStorage.getItem('keysConfiguration');
    const customExercise = localStorage.getItem('customExercise');

    if (tempo || mode || exercise) {
      const id = crypto.randomUUID();
      const config: SavedConfiguration = {
        id,
        name: 'Default',
        tempo: tempo ? parseInt(tempo) : 60,
        mode: mode as 'R' | 'WC' | number | null ?? 'R',
        exercise: exercise || 'Major 7',
        customExercise: customExercise || null,
        playRootNote: playRootNote === 'true',
        keysConfiguration: keysConfiguration ? JSON.parse(keysConfiguration) : new KeysConfiguration(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([config]));
      localStorage.setItem(this.CURRENT_ID_KEY, id);
    }
  }
}
```

### 4. Component Changes

#### PlayerComponent Changes
The PlayerComponent will be refactored to use the ConfigurationService:

**Changes to `src/app/components/player/player.component.ts`:**

1. Import and inject `ConfigurationService`
2. Remove individual localStorage operations from `saveConfiguration()` and `loadConfiguration()`
3. Replace with service calls
4. Add method to create saved configuration from current state
5. Add method to load a saved configuration

Key new methods:
```typescript
// Create a named configuration from current settings
save CurrentAsNew(name: string): void {
  const currentConfig = {
    name,
    tempo: this.toneService.tempo(),
    mode: this.selectedMode(),
    exercise: this.selectedExercise().name,
    customExercise: this.selectedExercise().name === 'Custom' 
      ? this.selectedExercise().configuration as string 
      : null,
    playRootNote: this.toneService.playRootNote,
    keysConfiguration: this.keysConfiguration
  };
  this.configurationService.save(currentConfig);
}

// Load a saved configuration
loadConfiguration(config: SavedConfiguration): void {
  this.toneService.setTempo(config.tempo);
  this.selectedMode.set(config.mode as 'R' | 'WC' | number);
  
  const exercise = this.exercises.find(e => e.name === config.exercise) ?? this.exercises[0];
  this.selectedExercise.set(exercise);
  
  if (config.exercise === 'Custom' && config.customExercise) {
    exercise.configuration = config.customExercise;
  }
  
  this.toneService.playRootNote = config.playRootNote;
  this.keysConfiguration = config.keysConfiguration;
  
  this.configurationService.setCurrent(config.id);
  this.updateProbabilityMap();
}
```

#### AppModule Changes
Add ConfigurationService to providers.

### 5. New Dialog Components

#### Save Configuration Dialog
**File: `src/app/components/save-configuration-dialog/save-configuration-dialog.component.ts`**
```typescript
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-save-configuration-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './save-configuration-dialog.component.html',
  styleUrl: './save-configuration-dialog.component.scss'
})
export class SaveConfigurationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<SaveConfigurationDialogComponent>);
  readonly data = inject<{ existingName?: string }>(MAT_DIALOG_DATA);
  
  name: string = this.data.existingName || '';
  
  save(): void {
    if (this.name.trim()) {
      this.dialogRef.close(this.name.trim());
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
```

**Template: `save-configuration-dialog.component.html`**
```html
<h2 mat-dialog-title>Save Configuration</h2>
<mat-dialog-content>
  <mat-form-field>
    <mat-label>Configuration Name</mat-label>
    <input matInput [(ngModel)]="name" placeholder="Enter a name" />
  </mat-form-field>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button (click)="cancel()">Cancel</button>
  <button mat-button (click)="save()" [disabled]="!name.trim()" cdkFocusInitial>Save</button>
</mat-dialog-actions>
```

#### Manage Configurations Dialog
**File: `src/app/components/manage-configurations-dialog/manage-configurations-dialog.component.ts`**
```typescript
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from '../../services/configuration.service';
import { SavedConfiguration } from '../../model/saved-configuration';

@Component({
  selector: 'app-manage-configurations-dialog',
  standalone: true,
  imports: [/* Material modules */],
  templateUrl: './manage-configurations-dialog.component.html',
  styleUrl: './manage-configurations-dialog.component.scss'
})
export class ManageConfigurationsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ManageConfigurationsDialogComponent>);
  readonly configurationService = inject(ConfigurationService);
  
  configurations: SavedConfiguration[] = this.configurationService.getAll();
  currentId: string | null = this.configurationService.getCurrent()?.id ?? null;
  
  load(config: SavedConfiguration): void {
    // Close with the config to load
    this.dialogRef.close({ action: 'load', config });
  }
  
  edit(config: SavedConfiguration): void {
    this.dialogRef.close({ action: 'edit', config });
  }
  
  delete(config: SavedConfiguration): void {
    this.configurationService.delete(config.id);
    this.configurations = this.configurationService.getAll();
    if (this.currentId === config.id) {
      this.currentId = null;
    }
  }
  
  createNew(): void {
    this.dialogRef.close({ action: 'new' });
  }
}
```

**Template: `manage-configurations-dialog.component.html`**
```html
<h2 mat-dialog-title>Manage Configurations</h2>
<mat-dialog-content>
  <div class="config-list">
    @for (config of configurations; track config.id) {
    <mat-card class="config-item" [class.current]="config.id === currentId">
      <div class="config-info">
        <span class="config-name">{{ config.name }}</span>
        <span class="config-details">
          Tempo: {{ config.tempo }}, Mode: {{ getModeName(config.mode) }}, 
          Exercise: {{ config.exercise }}
        </span>
      </div>
      <div class="config-actions">
        <button mat-icon-button (click)="load(config)" title="Load">
          <mat-icon>download</mat-icon>
        </button>
        <button mat-icon-button (click)="edit(config)" title="Rename">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button (click)="delete(config)" title="Delete">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </mat-card>
    }
  </div>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button (click)="createNew()">New Configuration</button>
  <button mat-button (click)="dialogRef.close()">Close</button>
</mat-dialog-actions>
```

### 6. UI Integration in Player Component

**HTML Changes to `player.component.html`:**

Add a new section for configuration management in the configuration card:

```html
<!-- Add to the mat-card in configuration section -->
<div class="configuration-management">
  <button mat-fab extended (click)="openSaveDialog()" title="Save current configuration">
    <mat-icon>save</mat-icon> Save Configuration
  </button>
  <button mat-fab extended (click)="openManageDialog()" title="Manage saved configurations">
    <mat-icon>folder</mat-icon> Manage Configurations
  </button>
</div>

<!-- Add current configuration display -->
@if (currentConfigurationName()) {
<div class="current-config">
  Current: {{ currentConfigurationName() }}
</div>
}
```

**CSS Changes to `player.component.scss`:**
```scss
.configuration-management {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--mat-sys-surface-container-high);
}

.current-config {
  margin-top: 8px;
  font-size: 0.875rem;
  color: var(--mat-sys-on-surface-variant);
  text-align: center;
}
```

### 7. Migration Strategy

1. **Backward Compatibility**: The `ConfigurationService.migrateLegacy()` method will:
   - Check if `savedConfigurations` exists in localStorage
   - If not, create a single "Default" configuration from the individual keys
   - Set that as the current configuration
   - Legacy keys remain but are ignored after migration

2. **Runtime Migration**: Call `migrateLegacy()` in:
   - `PlayerComponent.constructor()` before loading any configuration
   - OR in `ConfigurationService.constructor()`

### 8. File Summary - New Files

| File | Purpose |
|------|---------|
| `src/app/model/saved-configuration.ts` | TypeScript interfaces for saved configurations |
| `src/app/services/configuration.service.ts` | Service to manage configuration persistence |
| `src/app/components/save-configuration-dialog/` | Dialog for naming/saving configurations |
| `src/app/components/manage-configurations-dialog/` | Dialog for listing, loading, renaming, deleting |

### 9. File Summary - Modified Files

| File | Changes |
|------|---------|
| `src/app/app.module.ts` | Add ConfigurationService to providers |
| `src/app/components/player/player.component.ts` | Use service, add save/load methods, add dialog opening methods |
| `src/app/components/player/player.component.html` | Add save/manage buttons, current config display |
| `src/app/components/player/player.component.scss` | Add styles for new UI elements |

### 10. Angular Module Updates

Add new components to app.module.ts:
```typescript
imports: [
  // ... existing imports
  SaveConfigurationDialogComponent,
  ManageConfigurationsDialogComponent,
]
```

### 11. UI/UX Considerations

- **Save Button**: Opens a dialog to name the configuration
- **Manage Button**: Opens a dialog listing all saved configurations with actions
- **Current Configuration Indicator**: Shows which configuration is currently loaded
- **Loading a Configuration**: Immediate effect - settings are applied right away
- **Deleting Current Configuration**: Falls back to no current configuration (retains in-memory state)
- **Validation**: Configuration names must be non-empty and unique

### 12. Error Handling

- UUID generation: Use `crypto.randomUUID()` with fallback for older browsers
- JSON parsing: Wrap in try-catch for corrupted data
- Empty configurations: Handle gracefully
- Duplicate names: Prevent or auto-resolve (e.g., append " (1)")

### 13. Testing Considerations

- Test migration from legacy format
- Test save, load, rename, delete operations
- Test switching between configurations
- Test edge cases: empty names, duplicate names,删除当前配置
- Test localStorage persistence across browser sessions

### 14. Implementation Order

1. Create `saved-configuration.ts` model
2. Create `ConfigurationService`
3. Add migration logic
4. Create dialog components
5. Modify `PlayerComponent` to use the service
6. Update HTML/CSS
7. Update `AppModule`
8. Test migration
9. Test all CRUD operations
