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
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  // Implementamos OnInit (Al Iniciar)

  // --- ZONA DE VARIABLES (ESTADO) ---
  // 1. Iniciamos la lista VACÍA. ¡Ya no hay datos falsos!
  misCompras: Ingrediente[] = [];
  nuevoIngrediente: Ingrediente = { nombre: '', precioTotal: 0 };
  idEnEdicion: number | null = null;
  terminoBusqueda: string = '';

  // 2. Inyectamos a nuestro cartero para poder usarlo
  private http = inject(HttpClient);

  // 3. Este método es automático. Se ejecuta apenas la página web se abre.
  ngOnInit() {
    this.cargarInventario();
  }

  // --- ZONA DE LECTURA (GET) ---
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

  // Getter que devuelve la lista filtrada en tiempo real
  get ingredientesFiltrados(): Ingrediente[] {
    //Si el buscador está vacío, mostramos toda la lista
    if (!this.terminoBusqueda) {
      return this.misCompras;
    }

    //Convertimos lo que escribió el usuario a minúsculas
    const termino = this.terminoBusqueda.toLowerCase();

    //Filtramos la lista: solo dejamos los que incluyan el texto buscado
    return this.misCompras.filter((item) =>
      item.nombre.toLowerCase().includes(termino),
    );
  }

  // --- ZONA DE EDICIÓN (NUEVOS MÉTODOS) ---
  //Carga los datos en el formulario cuando presionamos
  editarCompra(ingrediente: Ingrediente) {
    if (ingrediente.id) {
      this.idEnEdicion = ingrediente.id;
      //Copiamos los datos a las cajitas del formulario
      this.nuevoIngrediente = {
        nombre: ingrediente.nombre,
        precioTotal: ingrediente.precioTotal,
      };
    }
  }

  //Limpia el formulario y sale del modo edición
  cancelarEdicion() {
    this.idEnEdicion = null;
    this.nuevoIngrediente = { nombre: '', precioTotal: 0 };
  }

  // --- ZONA DE GUARDADO (POST / PUT) ---
  guardarCompra() {
    if (!this.nuevoIngrediente.nombre || this.nuevoIngrediente.precioTotal <= 0)
      return;

    if (this.idEnEdicion) {
      // MODO EDICIÓN: Hacemos un PUT a tu nueva ruta
      this.http
        .put<Ingrediente>(
          `http://localhost:8080/inventario/editar/${this.idEnEdicion}`,
          this.nuevoIngrediente,
        )
        .subscribe({
          next: () => {
            this.cargarInventario(); // Recargamos la tabla
            this.cancelarEdicion(); // Limpiamos todo
          },
          error: (err) => {
            console.error('Error al editar:', err);
            alert('Error al intentar guardar los cambios.');
          },
        });
    } else {
      // MODO CREACIÓN: Tu código POST original
      this.http
        .post<Ingrediente>(
          'http://localhost:8080/inventario/guardar',
          this.nuevoIngrediente,
        )
        .subscribe({
          next: () => {
            this.cargarInventario();
            this.cancelarEdicion();
          },
          error: (err) => {
            // err.error contiene el texto puro que envió nuestro @ExceptionHandler desde Java
            // Si no hay texto (por si el servidor se cae de verdad), usamos un mensaje por defecto
            const mensajeBackend = err.error ? err.error : 'Error de conexión con el servidor.';

            // Mostramos el mensaje exacto a la dueña de la pyme
            alert(mensajeBackend);

            console.error('Detalle del error:', err);
          }
        });
    }
  }

  // --- ZONA DE BORRADO (DELETE) ---
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
