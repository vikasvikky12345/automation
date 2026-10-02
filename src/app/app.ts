import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  async ngOnInit() {
    if (!Capacitor.isNativePlatform()) return;

    await StatusBar.setStyle({ style: Style.Dark });
    await SplashScreen.hide();

    // Android hardware back button: navigate back, or exit on the root page.
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else CapApp.exitApp();
    });
  }
}
