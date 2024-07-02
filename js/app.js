// Variables
const carrito = document.querySelector('#carrito');
const listaProductos = document.querySelector('#lista-productos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
let articulosCarrito = [];

// Acá anuncio las funciones que voy a usar
// por ejemplo agregar-carrito, que ejecuta la funcion agregarProducto()
const agregarProducto = (e) => {
     e.preventDefault();
     // acá valido si el click fue en el boton agregar-carrito
     if(e.target.classList.contains('agregar-carrito')) {
          // acá selecciono el producto que voy a agregar al carrito
          const producto = e.target.parentElement.parentElement;
          // Enviamos el producto seleccionado para tomar sus datos
          leerDatosProducto(producto);
     }
};

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaProductos.addEventListener('click', agregarProducto);
     // Cuando se elimina un producto del carrito
     carrito.addEventListener('click', eliminarProducto);

     // Al cargar el documento, mostrar LocalStorage
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
     // imprimir el carrito en el DOM
          carritoHTML();
     });


     // Al Vaciar el carrito
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
};

// Lee los datos del producto
function leerDatosProducto(producto) {
     const infoProducto = {
          imagen: producto.querySelector('img').src,
          titulo: producto.querySelector('h4').textContent,
          precio: producto.querySelector('.cajaInf textoDerecha').textContent,
          id: producto.querySelector('a').getAttribute('data-id'), 
          stock: 1
     }

     if( articulosCarrito.some( producto => producto.id === infoProducto.id ) ) { 
          const Productos = articulosCarrito.map( producto => {
               if( producto.id === infoProducto.id ) {
                    producto.stock++;
                     return producto;
                } else {
                     return producto;
             }
          })
          articulosCarrito = [...Productos];
     }  else {
          articulosCarrito = [...articulosCarrito, infoProducto];
     }

     // console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el producto del carrito en el DOM
function eliminarProducto(e) {
     e.preventDefault();
     if(e.target.classList.contains('borrar-producto') ) {
          // e.target.parentElement.parentElement.remove();
          const productoId = e.target.getAttribute('data-id')
          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

          carritoHTML();
     }
}

// Muestra el producto seleccionado en el Carrito
function carritoHTML() {
     vaciarCarrito();
     articulosCarrito.forEach(producto => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  <img src="${producto.imagen}" width=100>  </td>
               <td>  ${producto.titulo}   </td>
               <td>  ${producto.precio}   </td>
               <td>  ${producto.stock} </td>
               <td>
                    <a href="#" class="borrar-producto" data-id="${producto.id}">X</a>
               </td>
          `;
          contenedorCarrito.appendChild(row);
     });

     // Agregar el Carrito de Compras al LocalStorage
     sincronizarStorage();

}

function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimino los productos del carrito
function vaciarCarrito() {
     while(contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
}

document.addEventListener('DOMContentLoaded', cargarProductos);

// Función para renderizar los productos
function renderizarProductos(productos) {
     const listaProductos = document.getElementById('lista-productos');
     let html = '';
     productos.forEach(producto => {
       html += `
         <div class="row">
              <div class="four columns">
                   <div class="card">
                        <img src="img/${producto.id}.jpg" class="imagen-producto u-full-width">
                        <div class="info-card">
                        <h4>${producto.nombre}</h4>
                        <p>cod: ${producto.id}</p>
                        <p class="cajaInf">stock:${producto.stock}  
                             <textoDerecha class="u-pull-right ">$${producto.precio}</textoDerecha></p>
                        <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${producto.id}">Agregar Al Carrito</a>
                   </div>
              </div>
         </div> 
       `;
     });
     listaProductos.innerHTML = html;
   }
   
   // Modificación de cargarProductos para que use la nueva función de renderización
   //function cargarProductos() {
   //  fetch('data/productos.json')
   //    .then(response => response.json())
   //    .then(productos => {
   //      // Llamo a la función de renderización pasando los productos obtenidos
   //      renderizarProductos(productos);
   //    })
   //    .catch(error => console.error('Error al cargar los productos:', error));
   //}


   function cargarProductos() {
     // URL del backend que devuelve los datos de los productos
     fetch('http://127.0.0.1:3000/productos')
         .then(response => {
             // Verifica si la solicitud fue exitosa
             if (!response.ok) {
                 throw new Error('Error al cargar los productos');
             }
             return response.json(); // Convierte la respuesta en JSON
         })
         .then(datos => {
             // Acá mando a renderizar lo trajo del backend
             renderizarProductos(datos);
         })
         .catch(error => {
             console.error('Error al cargar los productos:', error);
         });
 }




  //Evento que se dispara EL BOTON al enviar el formulario
  document.getElementById('Guardar').onsubmit = (event) => {
     event.preventDefault(); // Evita que la página se recargue
     // Crea el objeto Producto con los datos del formulario
     let Producto = {
         nombre: document.getElementById('nombre').value,
         precio: document.getElementById('precio').value,
         stock: document.getElementById('stock').value,
         urlImagenProducto: document.getElementById('urlImagenProducto').value,
         disponibilidad: document.getElementById('disponibilidad').checked
     };
     // Llama a la función cargarProductoN con el objeto Producto, asi lo cargar en el array
     cargarProducto(Producto);
 };

  //Boton con evento que envía el array de objetos al backend
  document.getElementById('enviarProductos').onclick = () => {
     // Envío el array de objetos al backend
     enviarObjetoEnJSON(productos);
     }


