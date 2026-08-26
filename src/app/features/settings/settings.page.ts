import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

interface OptionItem {
  readonly label: string;
  readonly value: string;
}

interface PreferenceSnapshot {
  readonly persistence: string;
  readonly enabledModules: readonly string[];
}

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, JsonPipe, ButtonModule, CardModule, SelectModule, MultiSelectModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  protected readonly persistenceOptions: OptionItem[] = [
    { label: 'Current shift only', value: 'session' },
    { label: 'Remember for 7 days', value: '7d' },
    { label: 'Remember for 30 days', value: '30d' },
  ];

  protected readonly focusAreaOptions: OptionItem[] = [
    { label: 'Dispatch board', value: 'dispatch' },
    { label: 'Field operations', value: 'field' },
    { label: 'Customer accounts', value: 'accounts' },
    { label: 'Reports', value: 'reports' },
    { label: 'Routing map', value: 'routing' },
    { label: 'SLA alerts', value: 'alerts' },
  ];

  protected readonly selectedPersistence = signal<string>('session');
  protected readonly selectedFocusAreas = signal<string[]>(['dispatch', 'field']);

  protected readonly preview = computed<PreferenceSnapshot>(() => ({
    persistence: this.selectedPersistence(),
    enabledModules: this.selectedFocusAreas(),
  }));

  protected resetPreferences(): void {
    this.selectedPersistence.set('session');
    this.selectedFocusAreas.set(['dispatch', 'field']);
  }

  protected updatePersistence(value: string): void {
    this.selectedPersistence.set(value);
  }

  protected updateFocusAreas(value: string[] | null): void {
    this.selectedFocusAreas.set(value ?? []);
  }

  protected savePreferences(): void {
    const payload = this.preview();
    const storageTarget = payload.persistence === 'session' ? sessionStorage : localStorage;
    storageTarget.setItem('fieldline.preferences', JSON.stringify(payload));
  }
}
