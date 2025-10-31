// src/main.ts
import {
  ApplicationConfig,
  mergeApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// کانفیگ مخصوص مرورگر
const browserConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // <-- Provider مرورگر ۱
    provideClientHydration(withEventReplay()), // <-- Provider مرورگر ۲
  ],
};

// ادغام کانفیگ مشترک و کانفیگ مرورگر
const config = mergeApplicationConfig(appConfig, browserConfig);

// بوت‌استرپ با کانفیگ ادغام شده
bootstrapApplication(App, config).catch((err) => console.error(err));
