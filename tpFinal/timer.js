class Timer {
  constructor() {
    this.seconds = 20;
    this.SinTiempo=false;
    this.stop=false;
  }

  Iniciar() {
    if (this.stop) {
      this.seconds= this.seconds;
    } else {
      if (frameCount % 60 === 0) {
        if (this.seconds > 0) {
          this.seconds--;
        } else {
          this.seconds=0;
        }
      }
    }
    textSize(30);
    text(this.seconds, 60, 125);
    if (this.seconds===0)
    {
      this.SinTiempo=true;
    } else {
      this.SinTiempo=false;
    }
  }

  ReiniciarTiempo() {
    this.seconds=20;
  }
}
