class Personaje {
  constructor(tam, Cantidad) {
    this.posxFinal=0;
    this.posyFinal=0;
    this.posxInicial=0;
    this.posyInicial=0;
    this.tam=tam;
    this.PosenGrillaX=4;
    this.PosenGrillaY=0;
    this.Cantidad=Cantidad;
    this.vida=4;
    this.perderVida();
    this.Desplazamiento();
    this.Posicionado();
    this.vivo=true;
    this.vidaPerdida = false;
  }

  Dibujar() {
    fill(0);
    imageMode(CORNER);
    image(ImgPersonaje, this.posxInicial, this.posyInicial, this.tam, this.tam);
    //this.PerderVida(condicion);
    fill(255);
  }

  Movimiento() {
    if (this.Posicionado() &&  this.vivo) {
      if (this.PosenGrillaY<5) {
        if (keyCode === LEFT_ARROW) {
          if (this.PosenGrillaY % 2) {
            this.PosenGrillaX--;
          }
          this.PosenGrillaY++;
        }
      }

      // Movimiento Horizontal hacia la derecha
      if (this.PosenGrillaY>0) {
        if (this.PosenGrillaY===1 && this.PosenGrillaX ===5)
        {
        } else {
          if (keyCode === RIGHT_ARROW) {
         
            if (this.PosenGrillaY % 2 === 0) {
              this.PosenGrillaX++;
            }
            this.PosenGrillaY--;
          }
        }
      }

      // Movimiento Vertical hacia arriba
      if (this.PosenGrillaY >0) {
        if (keyCode === UP_ARROW) {
          if (this.PosenGrillaY===1 && this.PosenGrillaX ===4)
          {
          } else {
            if (this.PosenGrillaY % 2) {
              this.PosenGrillaX--;
            }
            this.PosenGrillaY--;
          }
        }
      }

      // Movimiento Vertical hacia abajo
      if (this.PosenGrillaY< 5) {
        if (keyCode === DOWN_ARROW) {
          if (this.PosenGrillaY% 2 === 0) {
            this.PosenGrillaX++;
          }
          this.PosenGrillaY++;
        }
      }
    }
  }

  perderVida() {
    if (!this.vidaPerdida) {
      this.vida -= 1;
      this.vidaPerdida=true;
      if (this.vida==0) {
        this.vivo = false;
      }
    }
    if (this.Posicionado() && this.vidaPerdida) {
      this.PosenGrillaX=4;
      this.PosenGrillaY=0;
      this.vidaPerdida=false;
    }
  }

  Desplazamiento(posX, posY) {
    this.posxFinal=posX;
    this.posyFinal=posY;
    let distancia = dist(this.posxInicial, this.posyInicial, this.posxFinal, this.posyFinal);
    let velocidad = 4;
    if (distancia > velocidad) {
      // Calculate the angle to the target
      let obtenerAngulo = atan2(this.posyFinal - this.posyInicial, this.posxFinal - this.posxInicial);

      this.posxInicial += velocidad * cos(obtenerAngulo);
      this.posyInicial += velocidad * sin(obtenerAngulo);
    } else {
      this.posxInicial = this.posxFinal;
      this.posyInicial = this.posyFinal;
    }
  }

  Posicionado() {
    if (this.posxInicial== this.posxFinal && this.posyInicial == this.posyFinal) {
      return  true;
    }
  }

  ReiniciarPersonaje()
  {
    this.PosenGrillaX=4;
    this.PosenGrillaY=0;
    this.posxFinal=300;
    this.posyFinal=0;
    this.PosxInicial=300;
    this.posyInicial=0;
    this.vida = 3;
    this.vivo=true;
  }
}
