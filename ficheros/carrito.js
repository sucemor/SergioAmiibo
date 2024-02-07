function meterCarrito(
  nombre,
  precio,
  franquicia,
  imagen,
  tipo,
  personaje,
  juego
) {
  // Obtén el carrito actual de localStorage y conviértelo de nuevo a un array de objetos
  let Carrito = JSON.parse(localStorage.getItem("miCarro")) || [];

  if (existeCarrito(nombre, personaje)) {
    // Si ya existe, simplemente incrementa la cantidad
    unaMas(nombre);
    alert("Se ha añadido una unidad más");
  } else {
    // Si no existe, agrega un nuevo elemento al carrito
    Carrito.push(
      new Amiibos(franquicia, nombre, personaje, imagen, tipo, juego, 1, precio)
    );

    alert("¡Añadido a la cesta!");
  }

  // Guarda el carrito actualizado en localStorage
  localStorage.setItem("miCarro", JSON.stringify(Carrito));
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
  let Carrito = JSON.parse(localStorage.getItem("miCarro")) || [];
  console.log(Carrito);
  let salida = Carrito.filter((elemento) => {
    // console.log(elemento.nombreAmiibo);
    // console.log(elemento.personaje);
    return elemento.nombreAmiibo === nombre && elemento.personaje === personaje;
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
  let Carrito = JSON.parse(localStorage.getItem("miCarro")) || [];
  Carrito.forEach((element) => {
    if (element.nombreAmiibo === nombre) {
      element.unidades = element.unidades + 1;
    }
  });
  localStorage.removeItem("miCarro");
  localStorage.setItem("miCarro", JSON.stringify(Carrito));
}

function cargarCarrito() {
  // Obtén los datos del localStorage y conviértelos de nuevo a un array de objetos
  let Carrito = JSON.parse(localStorage.getItem("miCarro")) || [];

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
  const confirmacion = window.confirm(
    "¿Estás seguro que quieres eliminarlo de la cesta?"
  );

  if (confirmacion) {
    let Carrito = JSON.parse(localStorage.getItem("miCarro")) || [];
    let indiceAEliminar = Carrito.findIndex(
      (element) => element.nombreAmiibo === nombre
    );
    Carrito.splice(indiceAEliminar, 1);

    localStorage.removeItem("miCarro"); // Elimino el carrito entero del cache
    localStorage.setItem("miCarro", JSON.stringify(Carrito)); // Guardo el nuevo carrito
    // Tras eliminar, recargo el carrito para que se vea los cambios efectuados
    cargarCarrito();
  }
}

function modificar(nombre, unidades) {
  let Carrito = JSON.parse(localStorage.getItem("miCarro")) || [];

  let indiceModificar = Carrito.findIndex(
    (element) => element.nombreAmiibo === nombre
  );

  let Cambio = document.getElementById("cambiarUnidades"); //Recogo el input
  let cambiarUnidades = Math.round(Cambio.value); //Recogo el valor
  if (cambiarUnidades > 0) {
    Carrito[indiceModificar].unidades = cambiarUnidades;

    localStorage.removeItem("miCarro"); // Elimino el carrito entero del cache
    localStorage.setItem("miCarro", JSON.stringify(Carrito)); // Guardo el nuevo carrito
    //Tras modificar, hay que recargar la página
    cargarCarrito();
  }
}
