import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // 1. Importamos el motor de rutas
import { routes } from './app.routes'; // 2. Importamos nuestro archivo de rutas vacío

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes) // 3. Encendemos el motor pasándole nuestro mapa
  ]
};