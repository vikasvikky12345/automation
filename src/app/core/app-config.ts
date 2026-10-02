import { InjectionToken } from '@angular/core';

// Per-environment settings, read at runtime from /config.json so the same image
// can be promoted from QA to prod. In the container, config.json is generated
// from env vars at startup (docker/40-runtime-config.sh).
export interface AppConfig {
  appEnv: string;
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const fallback: AppConfig = { appEnv: 'unknown', apiUrl: '' };

export async function loadAppConfig(): Promise<AppConfig> {
  try {
    const res = await fetch('config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ...fallback, ...(await res.json()) };
  } catch (err) {
    console.error('Could not load config.json, using defaults', err);
    return fallback;
  }
}
