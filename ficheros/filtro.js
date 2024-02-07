/**
 * Funcion que dado el nombre del inoput radio, comprueba cual esta seleccionado y lo devuelve
 * @param {*} categoria
 * @returns
 */
function grupoSeleccionado(categoria) {
  let radios = document.querySelectorAll(
    `input[type="radio"][name="${categoria}"]`
  );

  let salida = "";

  radios.forEach((radio) => {
    if (radio.checked) {
      salida = radio.value + "";
    }
  });
  return salida;
}

/**
 * Recoge los array seleccionados y los devuelve en un array
 */
function DevuelveArrayFiltro() {
  let categorias = ["tipo", "franquicia", "orden"];
  let salida = [];

  for (let i = 0; i < categorias.length; i++) {
    salida.push("" + grupoSeleccionado(categorias[i]));
  }

  return salida;
}

/**
 * Dado un array de objetos, los filtra cumpliendo unas condiciones
 * @param {*} array
 */
function filtrar(array) {
  array = filtrarPorCategoria(array);
  array = ordenar(array);
  console.log(array);
  return array;
}

function filtrarPorCategoria(array) {
  //Defino los array asociativos
  let tipo = {
    comparar: "type", //Para saber con que hacer la comparación
    productos: "",
    cartas: "Card",
    figuras: "Figure",
  };
  let franquicia = {
    comparar: "amiiboSeries", //Para saber con que hacer la comparación
    todos: "",
    ssb: "Super Smash Bros.",
    sm: "Super Mario",
    mss: "Mario Sports Superstars",
    lz: "Legend Of Zelda",
    ac: "Animal Crossing",
    s: "Splatoon",
    mh: "Monster Hunter",
    smb: "Super Mario Bros.",
    otros: "otros"
  };
  //Y los meto en un array individual
  let elegir = [tipo, franquicia];
  // Recogo los valores de los radios seleccionados
  let escogidos = DevuelveArrayFiltro();

  for (let i = 0; i < escogidos.length - 1; i++) {

    if(elegir[1][escogidos[i]] === "otros"){
      array =
            array &&
            array.filter((elemento) => {
              return (
                elemento.amiiboSeries !== "Splatoon" &&
                elemento.amiiboSeries !== "Animal Crossing" &&
                elemento.amiiboSeries !== "Legend Of Zelda" &&
                elemento.amiiboSeries !== "Mario Sports Superstars" &&
                elemento.amiiboSeries !== "Super Smash Bros." &&
                elemento.amiiboSeries !== "Monster Hunter" &&
                elemento.amiiboSeries !== "Super Mario Bros."
              );
            });
    }else{
      array =
        array &&
        array.filter((elemento) =>
          elemento[elegir[i]["comparar"]].includes(elegir[i][escogidos[i]])
        );
    }
  }
  return array;
}

/**
 * Función que se encarga de de ordenar un array de manera ascendente o descendente
 * @param {*} array
 * @returns Devuelve el array ordenado
 */
function ordenar(array) {
  let seleccionados = "" + grupoSeleccionado("orden");
  if(seleccionados === "ascendente") {
      array = array && array.sort((a, b) => a.name.localeCompare(b.name));
  }else if(seleccionados === "descendente"){
    array = array && array.sort((a, b) => b.name.localeCompare(a.name));
  }

  return array;
}

/**
 * Tras filtrar es necesario volver a cargar el contenedor y limpiear el contenedor
 *
 * Función que reinicia las variables y el contenedor, para después cargar los productos
 */
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
