class Celda {
  constructor(posX, posY) {
    this.posX=posX;
    this.posY=posY+100;
    this.tam=60;
    this.LibroAgarrao=false;
  }
  DibujarCeldasInvisibles()
  {
    fill(0, 0, 0, 0); // Color transparente
    noStroke();
    rect(this.posX, this.posY, this.tam, this.tam);
  }
}
