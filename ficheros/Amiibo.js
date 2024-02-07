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