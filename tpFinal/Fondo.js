class Fondo {
  constructor(Imagen, tamañoX, tamañoY) {
    this.tamañoX=tamañoX;
    this.tamañoY=tamañoY;
    this.Imagen=Imagen;
  }
  Dibujar() {
    imageMode(CENTER);
    image(this.Imagen,this.tamañoX,this.tamañoY);
  }
}
