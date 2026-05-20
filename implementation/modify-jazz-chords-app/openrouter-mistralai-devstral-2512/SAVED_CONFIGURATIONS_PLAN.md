# Plan for Implementing Saved Configurations

## Overview
The goal is to allow users to save, load, rename, and delete named configurations for the Jazz Chord Flashcards app. This will enable users to maintain multiple configurations and switch between them easily.

## Current State
- The app currently saves a single configuration to `localStorage` with keys: `tempo`, `mode`, `exercise`, `playRootNote`, and `keysConfiguration`.
- The configuration is automatically saved whenever any setting is changed.
- There is no support for multiple named configurations.

## Proposed Changes

### 1. Data Structure for Saved Configurations

#### Local Storage Structure
Saved configurations will be stored in `localStorage` under a new key: `savedConfigurations`. The value will be a JSON string representing an array of configuration objects:

```typescript
interface SavedConfiguration {
  id: string; // Unique identifier (UUID)
  name: string; // User-provided name
  tempo: number;
  mode: 'R' | 'WC' | number;
  exercise: string;
  playRootNote: boolean;
  keysConfiguration: KeysConfiguration;
  customExercise?: string; // Only if exercise is 'Custom'
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

Example:
```json
{
  "savedConfigurations": [
    {
      "id": "abc123",
      "name": "Beginner Practice",
      "tempo": 60,
      "mode": "R",
      "exercise": "Major 7",
      "playRootNote": false,
      "keysConfiguration": {"keys": [...]},
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Files and Components to Modify

#### New Files
1. **`src/app/model/saved-configuration.ts`**: Define the `SavedConfiguration` interface and related types.
2. **`src/app/services/configuration.service.ts`**: Service to manage saved configurations (CRUD operations).
3. **`src/app/components/saved-configurations-dialog/saved-configurations-dialog.component.ts`**: Dialog component for managing saved configurations.
4. **`src/app/components/saved-configurations-dialog/saved-configurations-dialog.component.html`**: Template for the dialog.
5. **`src/app/components/saved-configurations-dialog/saved-configurations-dialog.component.scss`**: Styles for the dialog.

#### Modified Files
1. **`src/app/components/player/player.component.ts`**:
   - Add methods to interact with the `ConfigurationService`.
   - Modify `saveConfiguration()` and `loadConfiguration()` to support named configurations.
   - Add a button to open the saved configurations dialog.

2. **`src/app/components/player/player.component.html`**:
   - Add a button to open the saved configurations dialog.

3. **`src/app/app.module.ts`**:
   - Declare the new `SavedConfigurationsDialogComponent`.

### 3. UI Design

#### Saved Configurations Dialog
The dialog will include:
1. **List of Saved Configurations**:
   - Display each configuration's name and a summary (e.g., exercise type, tempo).
   - Buttons for each configuration: Load, Rename, Delete.

2. **Save Current Configuration**:
   - Input field for the configuration name.
   - Save button.

3. **Actions**:
   - Load: Apply the selected configuration to the current session.
   - Rename: Edit the name of a saved configuration.
   - Delete: Remove a saved configuration.

#### Example UI Structure
```html
<mat-dialog-content>
  <h2>Saved Configurations</h2>
  
  <div class="save-section">
    <mat-form-field>
      <mat-label>Configuration Name</mat-label>
      <input matInput [(ngModel)]="newConfigName">
    </mat-form-field>
    <button mat-raised-button (click)="saveCurrentConfiguration()">Save Current</button>
  </div>
  
  <div class="list-section">
    @for (config of savedConfigs; track config.id) {
      <mat-card>
        <div class="config-info">
          <h3>{{ config.name }}</h3>
          <p>{{ config.exercise }} | Tempo: {{ config.tempo }} | Mode: {{ getModeName(config.mode) }}</p>
        </div>
        <div class="config-actions">
          <button mat-icon-button (click)="loadConfiguration(config)">
            <mat-icon>download</mat-icon>
          </button>
          <button mat-icon-button (click)="renameConfiguration(config)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteConfiguration(config.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card>
    }
  </div>
</mat-dialog-content>
```

### 4. Implementation Steps

#### Step 1: Create the `SavedConfiguration` Interface
Define the interface and any utility functions in `src/app/model/saved-configuration.ts`.

#### Step 2: Create the `ConfigurationService`
Implement methods for:
- `saveConfiguration(config: SavedConfiguration): void`
- `loadConfiguration(id: string): SavedConfiguration | undefined`
- `deleteConfiguration(id: string): void`
- `renameConfiguration(id: string, newName: string): void`
- `getAllConfigurations(): SavedConfiguration[]`

#### Step 3: Create the `SavedConfigurationsDialogComponent`
Implement the dialog with:
- Input for new configuration name.
- List of saved configurations with actions.
- Logic to interact with `ConfigurationService`.

#### Step 4: Modify `PlayerComponent`
- Inject `ConfigurationService`.
- Add method to open the saved configurations dialog.
- Update `saveConfiguration()` and `loadConfiguration()` to support named configurations.

#### Step 5: Update UI
- Add a button in the player component to open the saved configurations dialog.

### 5. Detailed Component Changes

#### `PlayerComponent` Changes
1. **Add Button to HTML**:
```html
<button mat-fab extended (click)="openSavedConfigurationsDialog()">Saved Configurations</button>
```

2. **Add Method to Open Dialog**:
```typescript
openSavedConfigurationsDialog(): void {
  const dialogRef = this.dialog.open(SavedConfigurationsDialogComponent, {
    data: { currentConfig: this.getCurrentConfig() }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result && result.action === 'load') {
      this.loadConfiguration(result.config);
    }
  });
}
```

3. **Modify `saveConfiguration` and `loadConfiguration`**:
Update these methods to handle both the current single configuration and named configurations.

### 6. Testing
- Ensure that configurations are saved, loaded, renamed, and deleted correctly.
- Verify that the UI updates appropriately when switching configurations.
- Test edge cases (e.g., duplicate names, empty names).

### 7. Future Enhancements
- Add support for exporting/importing configurations as JSON files.
- Allow users to duplicate configurations.
- Add tags or categories for better organization.
