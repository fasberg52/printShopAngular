// src/main.server.ts (کد صحیح نهایی)

// ایمپورت‌ها باید از '@angular/platform-browser' باشند
import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
