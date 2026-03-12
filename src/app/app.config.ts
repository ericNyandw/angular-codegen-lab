import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch  } from '@angular/common/http'; // 1. On ajoute le client HTTP
import { routes } from './app.routes';
import {BASE_PATH  as PETSTORE_PATH} from './api/generated';
import { BASE_PATH as PRODUCTS_PATH } from './api/products';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // 3. On active HttpClient pour Angular
    provideHttpClient(
      withFetch()
    ) ,
    // Config pour Petstore (L'externe)
    { provide: PETSTORE_PATH, useValue: 'https://petstore.swagger.io/v2' },
    // Config pour TON API (La locale)
    { provide: PRODUCTS_PATH, useValue: 'http://localhost:8081' }
  ]
};
