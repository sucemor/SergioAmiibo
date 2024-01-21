var Carrito = [];


class Amiibos {
  static id = 0;
  constructor(
    franquincia,
    nombreAmiibo,
    personaje,
    imagen,
    tipo,
    juego,
    unidades,
    precio
  ) {
    //Propias de la API
    this.franquincia = franquincia;
    this.nombreAmiibo = nombreAmiibo;
    this.personaje = personaje;
    this.imagen = imagen;
    this.tipo = tipo;
    this.juego = juego;
    //Creadas
    this.unidades = unidades;
    this.precio = precio;
    this.id = ++Amiibos.id;
  }

  // Getter y Setter para franquincia
  getFranquincia() {
    return this.franquincia;
  }

  setFranquincia(value) {
    this.franquincia = value;
  }

  // Getter y Setter para nombreAmiibo
  getNombreAmiibo() {
    return this.nombreAmiibo;
  }

  setNombreAmiibo(value) {
    this.nombreAmiibo = value;
  }

  // Getter y Setter para personaje
  getPersonaje() {
    return this.personaje;
  }

  setPersonaje(value) {
    this.personaje = value;
  }

  // Getter y Setter para imagen
  getImagen() {
    return this.imagen;
  }

  setImagen(value) {
    this.imagen = value;
  }

  // Getter y Setter para tipo
  getTipo() {
    return this.tipo;
  }

  setTipo(value) {
    this.tipo = value;
  }

  // Getter y Setter para juego
  getJuego() {
    return this.juego;
  }

  setJuego(value) {
    this.juego = value;
  }

  // Getter y Setter para unidades
  getUnidades() {
    return this.unidades;
  }

  setUnidades(unidad) {
    if (unidad >= 0) {
      this.unidades = unidad;
    } else {
      console.error("El número de unidades no puede ser negativo.");
    }
  }

  // Getter y Setter para precio
  getPrecio() {
    return this.precio;
  }

  setPrecio(valor) {
    if (valor >= 0) {
      this.precio = valor;
    } else {
      console.error("El precio no puede ser negativo.");
    }
  }

  getId() {
    return this.id;
  }

  // Modifico el toString
  toString() {
    return `Amiibo ID: ${this.id}, Nombre: ${this.nombreAmiibo}, Franquicia: ${this.franquincia}, Unidades: ${this._unidades}, Precio: ${this._precio}`;
  }
}

/**
 * Función asincrona encarga de hacer la llamada a la API
 */
async function llamadaApi() {
  try {
    let todos = [];
    let response = await fetch("https://www.amiiboapi.com/api/amiibo/");
    let salida = await response.json();
    // Trata de datos
    salida = salida.amiibo;
    //Filtrar
    salida = filtro(salida);
    // Es un json, así que lo convertimos en un array
    salida.forEach((elemento) => {
      // Al array le metemos objetos Amiibos
      let unidades = Math.floor(Math.random() * 101);
      let precio = (Math.random() * (40 - 10) + 10).toFixed(2);
      todos.push(
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

    return todos;
  } catch (err) {
    alert("Error al llamar la API: " + err);
  }
}

let cambioClaseIcono = false;
let productos = []; //Variable global con todos los productos
let carga = false; // ¿Esta cargando o ya ha cargado la página?
/**
 * Para evitar que no carge más productos, necesito saber cuantos productos ha cargado
 */
let totalProductos = 0;
/**
 * Función cuya finalidad es cargar los productos
 */
async function cargarProductos() {
  //ICONO CARRITO
  Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];
  if (Carrito.length > 0 && cambioClaseIcono === false) { // Si algo en carrito, que salte el icono
    var icono = document.getElementById("iconoCarrito");
    icono.classList.add("fa-bounce");
    cambioClaseIcono = true;
  }

  if (cambioClaseIcono === true && Carrito.length < 1) {
    var icono = document.getElementById("iconoCarrito");
    icono.classList.remove("fa-bounce");
    cambioClaseIcono = false;
  }


  try {
    const nuevosProductos = await llamadaApi();
    // Si no hay más productos, elimina el lisener del SCROLL
    if (nuevosProductos.length - totalProductos <= 0) {
      // No hay más productos para cargar
      window.removeEventListener("scroll", cargarMasProductos);
    }
    productos = [...productos, ...nuevosProductos];
    mostrarProductos(nuevosProductos.length - totalProductos); // Llamo a la función que mete los productos
    carga = false; //Ya ha cargado
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
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

function cargarMasProductos() {
  if (
    window.scrollY + window.innerHeight >= document.body.offsetHeight - 700 &&
    !carga
    // && productos.length <8 && productos.length >1
  ) {
    carga = true;
    cargarProductos();
  }
}

// Evento de desplazamiento
window.addEventListener("scroll", cargarMasProductos);


//FILTRO
/**
 * Funcion que dado el nombre del inoput radio, comprueba cual esta seleccionado y lo devuelve
 * @param {*} categoria 
 * @returns 
 */
function grupoSeleccionado(categoria) {
  let radios = document.querySelectorAll(`input[type="radio"][name="${categoria}"]`);

  let salida = "";

  radios.forEach((radio) => {
    if (radio.checked) {
      salida = radio.value + "";
    }
  });
  return salida;
}

/**
 * Dado un array de objetos, los filtra cumpliendo unas condiciones
 * @param {*} array 
 */
function filtro(array) {
  let devolverArray = array;
  /**
   * Necesito comprobar los seleccionados de cada grupo, cada vez que acciona alguno de ellos
   * Asi que tengo que comprobar los tres grupos todas las veces
   */
  let seleccionados = "" + grupoSeleccionado("tipo");
  switch (seleccionados) {
    case "productos":
      //Nada
      break;
    case "cartas":
      devolverArray = devolverArray && devolverArray.filter((elemento) => {
        return elemento.type === "Card"
      });
      break;
    case "figuras":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.type === "Figure" })
      break;
  }


  seleccionados = "" + grupoSeleccionado("franquicia");
  switch (seleccionados) {
    case "todos-franquicia":
      //Nada
      break;

    case "ssb":
      devolverArray = devolverArray && devolverArray.filter((elemento) => {
        return elemento.amiiboSeries === "Super Smash Bros."
      });
      break;
    case "sm":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries.includes("Super Mario") })
      break;
    case "mss":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries === "Mario Sports Superstars" })
      break;

    case "lz":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries === "Legend Of Zelda" })
      break;
    case "ac":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries === "Animal Crossing" })
      break;
    case "s":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries === "Splatoon" })
      break;

    case "mh":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries === "Monster Hunter" })
      break;

    case "yugi":
      devolverArray = devolverArray && devolverArray.filter((elemento) => { return elemento.amiiboSeries.includes("Yu-Gi-Oh!") })
      break;

    case "otros":
      devolverArray = devolverArray && devolverArray.filter((elemento) => {
        return (elemento.amiiboSeries !== "Splatoon"
          && elemento.amiiboSeries !== "Animal Crossing"
          && elemento.amiiboSeries !== "Legend Of Zelda"
          && elemento.amiiboSeries !== "Mario Sports Superstars"
          && elemento.amiiboSeries !== "Super Smash Bros."
          && elemento.amiiboSeries !== "Monster Hunter")
      })
      break;
  }


  seleccionados = "" + grupoSeleccionado("orden");
  switch (seleccionados) {
    case "ascendente":
      devolverArray = devolverArray && devolverArray.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "descendente":
      devolverArray = devolverArray && devolverArray.sort((a, b) => b.name.localeCompare(a.name));
  }
  // console.log(devolverArray);
  return devolverArray;
}


function aplicarCategoria() {
  //Vacio el contenedor
  const contenedor = document.getElementById("main-amiibos");
  contenedor.innerHTML = ""; // Esto eliminará todo el contenido del div con id "main-amiibos"

  //Reinicio las variables globales
  productos = [];
  totalProductos = 0;
  carga = false;

  //Muestro los productos
  cargarProductos();
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
async function detalles(nombre, precio, franquicia, imagen, unidades, tipo, personaje, juego) {

  window.removeEventListener("scroll", cargarMasProductos); // Que noo haga scroll

  //Oculto el contenedor con las caracteristicas
  var divCaract = document.getElementById("caracteristicas");
  divCaract.style.display = "none";

  const contenido = document.getElementById("main-amiibos"); //Recogo el contenedor
  contenido.classList.add("detalles");//Para estilos
  contenido.innerHTML = `
        <img class="amiibo-imagen" src="${imagen}" alt="${nombre}">
        <div  class="main-amiibos-texto-boton">
          <div  class="main-amiibos-individual-texto">
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

function meterCarrito(nombre, precio, franquicia, imagen, tipo, personaje, juego) {
  // Obtén el carrito actual de localStorage y conviértelo de nuevo a un array de objetos
  Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];

  if (existeCarrito(nombre, personaje)) {
    // Si ya existe, simplemente incrementa la cantidad
    unaMas(nombre);
    alert("Se ha añadido una unidad más");
  } else {
    // Si no existe, agrega un nuevo elemento al carrito
    Carrito.push(new Amiibos(
      franquicia,
      nombre,
      personaje,
      imagen,
      tipo,
      juego,
      1,
      precio
    ));

    alert("¡Añadido a la cesta!");
  }

  // Guarda el carrito actualizado en localStorage
  localStorage.setItem('miCarro', JSON.stringify(Carrito));
}


/**
 * Comprueba que el arary Carrito no exista ningún objeto con el mismo nombre ni personaje
 * Si existe le añade una unidad y devuelve true
 * No existe devuelve false
 * @param {*} nombre 
 * @param {*} personaje 
 * @returns 
 */
function existeCarrito(nombre, personaje) {
  let result = false;
  Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];
  console.log(Carrito);
  let salida = Carrito.filter((elemento) => {
    // console.log(elemento.nombreAmiibo);
    // console.log(elemento.personaje);
    return elemento.nombreAmiibo === nombre && elemento.personaje === personaje
  });
  if (salida.length > 0) {
    result = true;
  }

  return result;
}

/**
 * Añade una unidad más al objeto dado
 */
function unaMas(nombre) {
  Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];
  Carrito.forEach(element => {
    if (element.nombreAmiibo === nombre) {
      element.unidades = element.unidades + 1;
    }
  });
  localStorage.removeItem('miCarro');
  localStorage.setItem('miCarro', JSON.stringify(Carrito));
}

function cargarCarrito() {
  // Obtén los datos del localStorage y conviértelos de nuevo a un array de objetos
  Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];

  const contenedorPrincipal = document.getElementById("carro");
  contenedorPrincipal.innerHTML = ""; // Esto eliminará todo el contenido del º

  if (Carrito.length > 0) {
    console.log(Carrito);
    Carrito.forEach((elemento) => {
      const contenido = document.createElement("div");
      contenido.classList.add("detalles");
      contenido.innerHTML = `
          <img class="amiibo-imagen" src="${elemento.imagen}" alt="${elemento.nombreAmiibo}">
          <div  class="main-amiibos-texto-boton">
            <div  class="main-amiibos-individual-texto">
              <h3 class="amiibo-nombre">${elemento.nombreAmiibo}</h3>
              <p class="amiibo-franquicia">${elemento.franquincia}</p>
              <p class="amiibo-precio">${elemento.precio}€</p>
              <p>Unidades: ${elemento.unidades}</p>
              <p>Tipo: ${elemento.tipo}</p>
              <p>Personaje: ${elemento.personaje}</p>
              <p>Juego de origen: ${elemento.juego}</p>
            </div>
          </div>
          
          <div class="interactuar">
            <input type="text" class="boton-modificar" id="cambiarUnidades">
            <button onclick="modificar('${elemento.nombreAmiibo}', '${elemento.unidades}')">Modificar</button>
            <button onclick="eliminar('${elemento.nombreAmiibo}')">Eliminar</button>
          </div>
        `;

      contenedorPrincipal.appendChild(contenido);
    });
  } else {
    const contenido = document.createElement("div");
    contenido.innerHTML = `Esta vacío`;
    contenedorPrincipal.appendChild(contenido);
  }
}

/**
 * Función encargada de eliminar un objeto guardado, solicita confirmacion
 * @param {*} nombre 
 */
function eliminar(nombre) {
  const confirmacion = window.confirm("¿Estás seguro que quieres eliminarlo de la cesta?");

  if (confirmacion) {
    Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];
    let indiceAEliminar = Carrito.findIndex(element => element.nombreAmiibo === nombre);
    Carrito.splice(indiceAEliminar, 1);

    localStorage.removeItem('miCarro'); // Elimino el carrito entero del cache
    localStorage.setItem('miCarro', JSON.stringify(Carrito)); // Guardo el nuevo carrito
    // Tras eliminar, recargo el carrito para que se vea los cambios efectuados
    cargarCarrito();
  }
}

function modificar(nombre, unidades) {
  Carrito = JSON.parse(localStorage.getItem('miCarro')) || [];

  let indiceModificar = Carrito.findIndex(element => element.nombreAmiibo === nombre);

  let Cambio = document.getElementById('cambiarUnidades'); //Recogo el input
  let cambiarUnidades = Math.round(Cambio.value); //Recogo el valor
  if (cambiarUnidades > 0) {
    Carrito[indiceModificar].unidades = cambiarUnidades;

    localStorage.removeItem('miCarro');// Elimino el carrito entero del cache
    localStorage.setItem('miCarro', JSON.stringify(Carrito)); // Guardo el nuevo carrito
    //Tras modificar, hay que recargar la página
    cargarCarrito();
  }
}
