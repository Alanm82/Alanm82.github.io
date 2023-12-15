class Boton {
  constructor(posX, posY, tam, Nombre, toPantalla) {
    this.posX=posX;
    this.posY=posY;
    this.tamX= tam;
    this.tamY= tam/2;
    this.Color = color(25, 0, 0);
    this.Nombre = Nombre;
    this.toPantalla=toPantalla;
    this.textSize=tam/4.8;
  }
  dibujar() {
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    fill(this.Color);
    rect(this.posX, this.posY, this.tamX, this.tamY);
    textSize(this.textSize);
    fill(255);
    text(this.Nombre, this.posX, this.posY);
  }

  Click() {
    if (mouseX >= this.posX -  this.tamX/2 && mouseX <= this.posX +  this.tamX/2 && mouseY >= this.posY -  this.tamY/2 && mouseY <= this.posY + this.tamY/2 && mouseButton == LEFT) {
      return this.toPantalla; // Devuelve la pantalla asociada al botón
    } else {
      return null;
    }
  }
}
