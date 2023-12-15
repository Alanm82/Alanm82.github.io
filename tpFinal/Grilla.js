class Grilla {
  constructor() {
    this.Cantidad = 10;
    this.tamaño = 60;
    this.posX = 0;
    this.posY = 40;
    this.crearPersonaje();
    this.objLibro=[];
    this.celda = [];
    this.celdasADibujar = [
      [4, 0], [4, 1], [5, 1], [3, 2], [4, 2],
      [5, 2], [3, 3], [4, 3], [5, 3], [6, 3],
      [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
      [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5]
    ];
    this.crearLibro();
    this.personajeEnLibro();
    this.personajeFuera();
  }

  Dibujar() {
    for (let i = 0; i <= this.Cantidad; i++) {
      for (let j = 0; j <= this.Cantidad; j++) {
        if (j % 2 === 0) {
          this.posX = this.tamaño * i + this.tamaño;
        } else if (j % 2 === 1) {
          this.posX = this.tamaño * i + this.tamaño / 2;
        }
        this.posY = this.tamaño * j + 40;

        // Crear una nueva celda y almacenarla en el arreglo
        if (!this.celda[i]) {
          this.celda[i] = [];
        }
        this.celda[i][j] = new Celda(this.posX, this.posY);
      }
    }

    for (let i = 0; i < this.Cantidad; i++) {
      for (let j = 0; j < this.Cantidad; j++) {
        this.celda[i][j].DibujarCeldasInvisibles();  // Dibujar todas las celdas

        // Verificar si las coordenadas coinciden con celdasADibujar y, en ese caso, dibujar el libro
        for (let k = 0; k < this.celdasADibujar.length; k++) {
          let celdaADibujarX = this.celdasADibujar[k][0];
          let celdaADibujarY = this.celdasADibujar[k][1];

          if (i === celdaADibujarX && j === celdaADibujarY) {
            // Dibujar libro en la celda
            //this.celda[i][j].dibujarLibro();
            this.objLibro[k].Dibujar(this.celda[i][j].posX, this.celda[i][j].posY);
          }
        }
        //verifica si las cordenadas del personaje coinciden con la celda en la que ira
        if (this.personajeEnCelda(i, j)) {
          // Llamar a la función para crear y dibujar al personaje
          this.objPersonaje.Desplazamiento(this.celda[i][j].posX, this.celda[i][j].posY);
        }
      }
    }
    this.personajeEnLibro();
    this.objPersonaje.Dibujar();
    this.personajeFuera();
  }

  crearLibro() {
    for (let i = 0; i < this.celdasADibujar.length; i++) {
      this.objLibro[i]= new Libro();
    }
  }

  crearPersonaje() {
    this.objPersonaje = new Personaje(this.tamaño, this.Cantidad);
  }

  controlesEnGrilla() {
    this.objPersonaje.Movimiento();
  }

  personajeFuera() {
    let personajeEnCelda = false;

    for (let k = 0; k < this.celdasADibujar.length; k++) {
      let celdaADibujarX = this.celdasADibujar[k][0];
      let celdaADibujarY = this.celdasADibujar[k][1];

      if (this.objPersonaje.PosenGrillaX === celdaADibujarX && this.objPersonaje.PosenGrillaY === celdaADibujarY) {
        personajeEnCelda = true;
        break; // Si el personaje está en alguna celda, no es necesario continuar verificando
      }
    }

    if (!personajeEnCelda) {
      this.objPersonaje.perderVida(); // Llama a la función perderVida si el personaje no está en ninguna celda
    }
  }

  personajeEnCelda(i, j) {
    if (this.objPersonaje.PosenGrillaX === i && this.objPersonaje.PosenGrillaY === j) {
      return true;
    } else {
      return false;
    }
  }

  personajeEnLibro() {
    for (let i = 0; i < this.objLibro.length; i++) {
      this.objLibro[i].marcarComoObtenido(this.objPersonaje.posxInicial, this.objPersonaje.posyInicial);
    }
  }

  Reiniciar() {
    this.objPersonaje.ReiniciarPersonaje();
    for (let i = 0; i < this.objLibro.length; i++) {
      this.objLibro[i].Reiniciar();
    }
  }

  noHayLibros() {
    for (let i = 0; i < this.objLibro.length; i++) {
      if (!this.objLibro[i].obtenido) {
        return false; // Si al menos un libro no está obtenido, retorna false
      }
    }
    return true; // Si todos los libros están obtenidos, retorna true
  }

  obtenerVidaPersonaje() {
    return this.objPersonaje.vida;
  }
}
