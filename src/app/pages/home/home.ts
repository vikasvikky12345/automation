import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>{{ appName }}</h1>
    <dl>
      <dt>Platform</dt><dd>{{ platform }}</dd>
      <dt>Build</dt><dd>{{ buildId }}</dd>
      <dt>Launches</dt><dd>{{ launches() }}</dd>
    </dl>
    <a routerLink="/about">About</a>
  `,
})
export class Home implements OnInit {
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
