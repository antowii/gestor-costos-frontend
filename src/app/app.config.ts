import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; // 1. Importamos el cartero

export const appConfig: ApplicationConfig = {
  // 2. Lo agregamos a los proveedores de la aplicación
  providers: [provideHttpClient()]
}