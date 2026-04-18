import { Routes } from '@angular/router';
import { InventarioComponent } from './inventario/inventario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecetasComponent } from './recetas/recetas.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ConfigComponent } from './config/config.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'config', component: ConfigComponent },
  
  // Redirección por defecto al abrir la página
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' } 
];