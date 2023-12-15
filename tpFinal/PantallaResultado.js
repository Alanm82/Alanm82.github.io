class PantallaResultado {
  constructor(Resultado,Accion) {
    this.Resultado=Resultado;
    this.Accion=Accion;
  }

  Dibujar()
  {
    fill(0);
    textSize(35);
    textAlign(CENTER);
    imageMode(CENTER);
    image( this.Resultado, width/2+50, height/2);
    textSize(25);
    if(this.Accion ==="Continuar"){
    text("Presiona Space para " + this.Accion, width/2+50, height/2+50);
    }else{
    text("Presiona Space para " + this.Accion, width/2+50, height/2+50);
    text("Escape para ver las instrucciones",width/2+50,height/2+100);
    }
    textAlign(CORNER);
  }
}
