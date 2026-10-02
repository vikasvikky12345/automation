import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';
import { APP_CONFIG } from '../../core/app-config';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>{{ appName }}</h1>
    <dl>
      <dt>Environment</dt><dd>{{ config.appEnv }}</dd>
      <dt>API</dt><dd>{{ config.apiUrl || '-' }}</dd>
      <dt>Platform</dt><dd>{{ platform }}</dd>
      <dt>Build</dt><dd>{{ buildId }}</dd>
      <dt>Launches</dt><dd>{{ launches() }}</dd>
    </dl>
    <a routerLink="/about">About</a>
  `,
})
export class Home implements OnInit {
  protected readonly config = inject(APP_CONFIG);
  protected readonly appName = environment.appName;
  protected readonly buildId = environment.buildId;
  protected readonly platform = Capacitor.getPlatform();
  protected readonly launches = signal(0);

  async ngOnInit() {
    // Preferences works on web (localStorage), Android and iOS.
    const { value } = await Preferences.get({ key: 'launches' });
    const count = Number(value ?? 0) + 1;
    await Preferences.set({ key: 'launches', value: String(count) });
    this.launches.set(count);
  }
}
