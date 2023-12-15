class Texto {
  constructor() {
    this.posX = 300;
    this.Posy = 30;
    this.espacio = 25;
    this.textSize = 15;
    this.text=texto
  }

  dibujar(pantallaActual) {
    textSize(16);
    if (pantallaActual==16) {
      fill(0);
      textSize(30);
      this.posX = 230;
      this.Posy = 200;
      this.espacio = 100;
      this.textSize = 45;
    } else
    {
      fill(255);
    }

    let lineaActual = this.text[pantallaActual];

    // Divide la línea actual por el guion "-"
    let fragmentos = split(lineaActual, '-');

    for (let i = 0; i < fragmentos.length; i++) {
      text(fragmentos[i], this.posX, this.Posy + this.espacio * i);
    }
  }
}
