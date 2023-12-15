class Pantalla {
  constructor() {
    this.numPantalla=17;
    this.CrearBoton();
    this.CrearTexto();
    this.CrearFondo();
    this.decision="";
    this.decision2="";
  }
  Dibujar() {
    this.CrearFondo();
    fill(200);
    text(estado, 20, 20);
    if (estado == 0) {
      this.objBotonHome.dibujar();
      this.objBotonHome2.dibujar();
    } else if (estado == 9) {
      this.objOptionBoton0.dibujar();
      this.objOptionBoton1.dibujar();
    } else if (estado == 11) {
      this.objOptionBoton2.dibujar();
      this.objOptionBoton3.dibujar();
    } else if (estado>12) {
      this.objBackHomeBoton.dibujar();
    } else if (estado<13) {
      this.objContinueBoton.dibujar();
      }
      this.objTexto.dibujar();
      
  }
  CrearBoton() {
    this.objBotonHome= new Boton(width/2, height/2-100, 150, "Iniciar", 1);
    this.objBotonHome2= new Boton(width/2, height/2+100, 150, "Creditos", 16);
    this.objContinueBoton= new Boton(550, 550, 100, "Siguiente", 1);
    this.objBackHomeBoton= new Boton(550, 550, 100, "Inicio", 30);
    this.objOptionBoton0 = new Boton(550, 450, 100, "Entregarse", 6);
    this.objOptionBoton1 = new Boton(550, 550, 100, "Resistirse", 1);
    this.objOptionBoton2 = new Boton(550, 450, 100, "Rio", 1);
    this.objOptionBoton3 = new Boton(550, 550, 100, "Autopista", 3);
  }
  CrearTexto() {
    this.objTexto = new Texto();
  }

  mousePressed() {
    if (estado == 0) {
      this.objBotonHome.Click();
      this.objBotonHome2.Click();
    } else if (estado == 9) {
      this.objOptionBoton0.Click();
      this.objOptionBoton1.Click();
    } else if (estado == 11) {
      this.objOptionBoton2.Click();
      this.objOptionBoton3.Click();
    } else if (estado>12) {
      this.objBackHomeBoton.Click();
    } else if (estado<13) {
      this.objContinueBoton.Click();}
    }

  CrearFondo() {
    image(imgs[estado], 0, 0);
  }

}
