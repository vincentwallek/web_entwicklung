// frontend/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// NEUER IMPORT
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // HIER provideHttpClient() hinzufügen
  providers: [provideRouter(routes), provideHttpClient()] 
};
