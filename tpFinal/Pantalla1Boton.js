class Pantalla1Boton {

  constructor(Imagen, botonText, toPantalla) {
    this.Imagen=Imagen;
    this.botonText=botonText;
    this.toPantalla=toPantalla;
    this.crearBoton();
    this.crearTexto();
  }

  dibujar(pantallaActual)
  {
    image(this.Imagen, 0, 0);
    this.objContinueBoton.dibujar();
    this.objText.dibujar(pantallaActual);
  }
  crearBoton() {
    this.objContinueBoton= new Boton(550, 550, 100, this.botonText, this.toPantalla);
  }

  crearTexto()
  {
    this.objText= new Texto();
  }

  manejarClick()
  {
    let nuevaPantalla;
    nuevaPantalla = this.objContinueBoton.Click();
    console.log("NuevaPantalla"+nuevaPantalla);
    if (nuevaPantalla || nuevaPantalla === 0)
    {
      return nuevaPantalla;
    }
  }
}
