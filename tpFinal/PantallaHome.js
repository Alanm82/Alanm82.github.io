class PantallaHome {

  constructor(Imagen) {
    this.objBotonHome=[];
    this.Imagen=Imagen;
    this.toPantalla=1;
    this.toPantalla1=16;
    this.crearBoton();
    this.crearTexto();
  }

  dibujar(pantallaActual) {
    image(this.Imagen, 0, 0);
    this.objBotonHome[0].dibujar();
    this.objBotonHome[1].dibujar();
    this.objTexto.dibujar(pantallaActual);
  }

  crearBoton() {
    this.objBotonHome[0]= new Boton(width/2, height/2-100, 150, "Iniciar", this.toPantalla);
    this.objBotonHome[1]= new Boton(width/2, height/2+100, 150, "Creditos", this.toPantalla1);
  }
  
  crearTexto()
   {
   this.objTexto=new Texto();
   }

  manejarClick()
  {
    let nuevaPantalla;
    nuevaPantalla=this.objBotonHome[0].Click();
    if (!nuevaPantalla) {
      nuevaPantalla=this.objBotonHome[1].Click();
    }
    if (nuevaPantalla)
    {
      return nuevaPantalla;
    }
  }
}
