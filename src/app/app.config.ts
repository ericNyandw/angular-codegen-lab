import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch  } from '@angular/common/http'; // 1. On ajoute le client HTTP
import { routes } from './app.routes';
import {BASE_PATH} from './api/generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // 3. On active HttpClient pour Angular
    provideHttpClient(
      withFetch()
    ) ,
    { provide: BASE_PATH, useValue: 'https://petstore.swagger.io/v2' }
  ]
};
