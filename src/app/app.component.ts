import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Herramientas de navegación

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // Inyectamos las herramientas aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestor-costos';
}