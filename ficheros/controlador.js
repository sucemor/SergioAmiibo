let cambioClaseIcono = false;
let productos = []; //Variable global con todos los productos
let carga = false; // ¿Está cargando o ya ha cargado la página? SCROLL
/**
 * Para evitar que no carge más productos, necesito saber cuantos productos ha cargado
 */
let totalProductos = 0; //TODOS LOS PRODUCTOS CARGADOS

// Evento de desplazamiento
window.addEventListener("scroll", cargarMasProductos);

/**
 * Función asincrona encarga de hacer la llamada a la API
 */
function llamadaApi() {
  return fetch("https://www.amiiboapi.com/api/amiibo/")
    .then(response => {
      if (!response.ok) {
        alert(`Error en el response: ${response.status}`);
      }
      return response.json();
    })
    .then(arrApi => {
      // Trata de datos
      arrApi = arrApi.amiibo;
      // Filtrar
      arrApi = filtrar(arrApi);
      
      let arrProductos = [];

      // Es un json, así que lo convertimos en un array
      arrApi.forEach(elemento => {
        // Al array le metemos objetos Amiibos
        let unidades = Math.floor(Math.random() * 101);
        let precio = (Math.random() * (40 - 10) + 10).toFixed(2);
        arrProductos.push(
          new Amiibos(
            elemento.amiiboSeries,
            elemento.name,
            elemento.character,
            elemento.image,
            elemento.type,
            elemento.gameSeries,
            unidades,
            precio
          )
        );
      });

      return arrProductos;
    })
    .catch(err => {
      alert("Error al llamar la API: " + err);
    });
}


/**
 * Función encargada de cambiar el estado del icono haciendo que pare de salta o salte
 */
function RenderizaIcono(){
  //Cargo el carrito
  let Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];
  //Si el carrito tiene algo y el icono no esta "saltando"
  if (Carrito.length > 0 && cambioClaseIcono === false) { // Si algo en carrito, que salte el icono
    var icono = document.getElementById("iconoCarrito"); //Recogo el icono
    icono.classList.add("fa-bounce"); // Le añado la clase, que hace que salte
    cambioClaseIcono = true; //Indico que el icono está saltando
  }

  //Si el carrito está vacio y el icono esta "saltanto"
  if (cambioClaseIcono === true && Carrito.length < 1) {
    var icono = document.getElementById("iconoCarrito"); // Recogo el icono
    icono.classList.remove("fa-bounce"); //Remuevo la clase que hace que salte
    cambioClaseIcono = false; //Indico que el icono NO está saltando
  }
}

/**
 * Función encargada de cargar los productos
 */
function cargarProductos() {
  RenderizaIcono(); // El icono cambia de estado
  
  llamadaApi()
    .then(nuevosProductos => {
      // Si no hay más productos, elimina el listener del SCROLL
      if (nuevosProductos.length - totalProductos <= 0) {
        // No hay más productos para cargar
        window.removeEventListener("scroll", cargarMasProductos);
      }
      productos = [...productos, ...nuevosProductos];
      mostrarProductos(nuevosProductos.length - totalProductos); // Llamo a la función que mete los productos
      carga = false; // Ya ha cargado
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
    });
}


/**
 * Función encargada de enviar los productos al html
 */
function mostrarProductos(restante = 848) {
  const contenedor = document.getElementById("main-amiibos");
  let productosAMostrar = 8;

  totalProductos += 8; // Vaya sumando cuantos productos lleva
  // Si no se pueden mostrar 8 productos porque hay menos, pues que solo se
  // carguen el número de elementos restantes
  if (restante < 8) {
    productosAMostrar = restante;
  }

  const productosParaMostrar = productos.slice(0, productosAMostrar);
  productos = productos.slice(productosAMostrar);



  // Puede que al filtrar el array quede vacío
  if (productos.length <= 0) {
    const contenido = document.createElement("div");
    contenido.classList.add("main-amiibos-individual");
    contenido.innerHTML = `
      <h1 class="perdon">Disculpe las molestia, no hay ningún artículo</h1>
      `;
    contenedor.appendChild(contenido);
  } else {
    productosParaMostrar.forEach((elemento) => {
      const contenido = document.createElement("div");
      contenido.classList.add("main-amiibos-individual");//Para estilos
      //DETALLES
      /**
       * Añado un lisener al contenedor cuando se click en este para
       * asi poder obtener los detalles
       */
      // contenido.id = `"Contenedor ${elemento.getId()}"`;
      contenido.addEventListener('click', () => {
        const nombre = contenido.querySelector('.amiibo-nombre').innerText;
        const precio = contenido.querySelector('.amiibo-precio').innerText;
        const franquicia = contenido.querySelector('.amiibo-franquicia').innerText;
        const imagen = contenido.querySelector('.amiibo-imagen').src;


        const unidades = contenido.querySelector('.amiibo-oculto-unidades').innerText;
        const tipo = contenido.querySelector('.amiibo-oculto-tipo').innerText;
        const personaje = contenido.querySelector('.amiibo-oculto-personaje').innerText;
        const juego = contenido.querySelector('.amiibo-oculto-juego').innerText;

        // Llama a la función detalles con los detalles correspondientes
        detalles(nombre, precio, franquicia, imagen, unidades, tipo, personaje, juego);
      });

      contenido.innerHTML = `
        <img class="amiibo-imagen" src="${elemento.getImagen()}" alt="${elemento.getNombreAmiibo()}">
        <div  class="main-amiibos-texto-boton">
          <div  class="main-amiibos-individual-texto">
            <h3 class="amiibo-nombre">${elemento.getNombreAmiibo()}</h3>
            <p class="amiibo-franquicia">${elemento.getFranquincia()}</p>
            <p class="amiibo-precio">${elemento.getPrecio()}€</p>

            <p class="amiibo-oculto-unidades">${elemento.getUnidades()}</p>
            <p class="amiibo-oculto-tipo">${elemento.getTipo()}</p>
            <p class="amiibo-oculto-personaje">${elemento.getPersonaje()}</p>
            <p class="amiibo-oculto-juego">${elemento.getJuego()}</p>
          </div>
        </div>
        `;
      contenedor.appendChild(contenido);
    });
  }
}

/**
 * Función que comprueba si se ha llegado al final de la página para dar la orden de cargarProductos
 */
function cargarMasProductos() {
  if (
    window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 &&
    !carga
    // && productos.length <8 && productos.length >1
  ) {
    carga = true;
    cargarProductos();
  }
}


// DETALLES
/**
 * Función encargada de mostrar los detalles de un producto seleccionado
 * @param {*} nombre 
 * @param {*} precio 
 * @param {*} franquicia 
 * @param {*} imagen 
 * @param {*} unidades 
 * @param {*} tipo 
 * @param {*} personaje 
 * @param {*} juego 
 */
function detalles(nombre, precio, franquicia, imagen, unidades, tipo, personaje, juego) {
  window.removeEventListener("scroll", cargarMasProductos); // Que no haga scroll

  // Oculto el contenedor con las características
  var divCaract = document.getElementById("caracteristicas");
  divCaract.style.display = "none";

  const contenido = document.getElementById("main-amiibos"); // Recogo el contenedor
  contenido.classList.add("detalles"); // Para estilos
  contenido.innerHTML = `
        <img class="amiibo-imagen detImagen" src="${imagen}" alt="${nombre}">
        <div class="main-amiibos-texto-boton">
          <div class="main-amiibos-individual-texto">
            <h3 class="amiibo-nombre">${nombre}</h3>
            <p class="amiibo-franquicia">${franquicia}</p>
            <p class="amiibo-precio">${precio}€</p>
            <p>Unidades en el almacén: ${unidades}</p>
            <p>Tipo: ${tipo}</p>
            <p>Personaje: ${personaje}</p>
            <p>Juego de origen: ${juego}</p>
          </div>
          <button class="amiibo-boton" onclick="meterCarrito('${nombre}', '${precio}', '${franquicia}', '${imagen}', '${tipo}', '${personaje}', '${juego}')">Añadir al carrito</button>
        </div>
        `;
}
