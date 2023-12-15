class Libro {
  constructor() {
    this.posX =0;
    this.posY =0;
    this.obtenido=false;
  }

  Dibujar(x, y) {
    this.posX = x + 30;
    this.posY = y + 30;
    if (!this.obtenido) {
      fill(150, 50, 100);
      imageMode(CENTER);
      image(imgLibro, this.posX, this.posY, 48, 48);
    }
  }

  marcarComoObtenido(x, y) {
    if (x===this.posX-30 && y===this.posY-30) {
      this.obtenido=true;
    }
  }
  Reiniciar()
  {
    this.obtenido=false;
  }
}
