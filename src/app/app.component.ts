import { Component, OnInit, inject } from '@angular/core'; // Agregamos OnInit e inject
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // El cartero que habilitamos

interface Ingrediente {
  id?: number;
  nombre: string;
  precioTotal: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Implementamos OnInit (Al Iniciar)

  // 1. Iniciamos la lista VACÍA. ¡Ya no hay datos falsos!
  misCompras: Ingrediente[] = [];
  nuevoIngrediente: Ingrediente = { nombre: '', precioTotal: 0 };

  // 2. Inyectamos a nuestro cartero para poder usarlo
  private http = inject(HttpClient);

  // 3. Este método es automático. Se ejecuta apenas la página web se abre.
  ngOnInit() {
    this.cargarInventario();
  }

  // 4. LA GRAN CONEXIÓN: Hacemos un GET a tu Java
  cargarInventario() {
    this.http.get<Ingrediente[]>('http://localhost:8080/inventario').subscribe({
      next: (datosReales) => {
        // Cuando Java responde, metemos esos datos reales en nuestra variable
        this.misCompras = datosReales;
      },
      error: (err) => {
        console.error('Error conectando con Java:', err);
      },
    });
  }

  // Cálculos matemáticos (se mantienen igual, pero ahora calculan con datos reales)
  get totalGastado(): number {
    return this.misCompras.reduce((sum, item) => sum + item.precioTotal, 0);
  }

  get cantidadProductos(): number {
    return this.misCompras.length;
  }

  guardarCompra() {
    // 1. Validación del Frontend (El guardia de seguridad de la puerta)
    if (!this.nuevoIngrediente.nombre || this.nuevoIngrediente.precioTotal <= 0)
      return;

    // 2. Hacemos un POST a tu API de Java enviando el 'nuevoIngrediente'
    this.http
      .post<Ingrediente>(
        'http://localhost:8080/inventario/guardar',
        this.nuevoIngrediente,
      )
      .subscribe({
        next: (respuestaDeJava) => {
          // Si Java lo guardó con éxito, recargamos la lista para ver el nuevo producto
          this.cargarInventario();

          // Limpiamos las cajitas del formulario para agregar otro
          this.nuevoIngrediente = { nombre: '', precioTotal: 0 };
        },
        error: (err) => {
          // Si Java rechaza el paquete (ej: tu error de nombre vacío), lo atrapamos aquí
          console.error('El Backend rechazó la compra:', err);
          alert(
            'Hubo un error al guardar. Revisa que los datos sean correctos.',
          );
        },
      });
  }

  eliminarCompra(id: number | undefined) {
    if (!id) return; // Si por algún motivo no hay ID, no hacemos nada

    // Le agregamos una pequeña confirmación para que no borres por accidente
    if (confirm('¿Estás segura de que quieres borrar este ingrediente?')) {
      // El cartero dispara el método DELETE a la URL de Java, concatenando el ID
      this.http
        .delete(`http://localhost:8080/inventario/eliminar/${id}`)
        .subscribe({
          next: () => {
            // Si Java confirma que lo borró, recargamos la tabla para que desaparezca
            this.cargarInventario();
          },
          error: (err) => {
            console.error('Error al intentar borrar en Java:', err);
            alert('No se pudo borrar el ingrediente.');
          },
        });
    }
  }
}
