class Boton {

  constructor(
    x,
    y,
    w,
    h,
    texto,
    grupo
  ) {

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.texto = texto;

    this.grupo = grupo;

    this.seleccionado = false;

    // =========================
    // ANIMACIÓN
    // =========================

    this.animando = false;
    this.tiempoAnimacion = 0;

  }


  // =========================================
  // HOVER
  // =========================================

  hover() {

    return (

      mouseX >
      this.x - this.w / 2 &&

      mouseX <
      this.x + this.w / 2 &&

      mouseY >
      this.y - this.h / 2 &&

      mouseY <
      this.y + this.h / 2

    );

  }


  // =========================================
  // DIBUJAR
  // =========================================

  dibujar() {

    let estaEncima =
      this.hover();


    rectMode(CENTER);


    // =========================================
    // COLOR DEL GRUPO
    // =========================================

    let colorGrupo;


    if (this.grupo === 0) {

      colorGrupo =
        color(100, 180, 255);

    }

    else if (this.grupo === 1) {

      colorGrupo =
        color(180, 120, 255);

    }

    else {

      colorGrupo =
        color(255, 130, 150);

    }


    // =========================================
    // FONDO
    // =========================================

    if (this.seleccionado) {

      fill(
        red(colorGrupo),
        green(colorGrupo),
        blue(colorGrupo),
        70
      );

    }

    else if (estaEncima) {

      fill(60);

    }

    else {

      fill(25);

    }


    // =========================================
    // BORDE
    // =========================================

    stroke(
      this.seleccionado
        ? colorGrupo
        : 100
    );


    strokeWeight(
      this.seleccionado
        ? this.w * 0.018
        : this.w * 0.008
    );


    rect(
      this.x,
      this.y,
      this.w,
      this.h,
      this.w * 0.04
    );


    // =========================================
    // ANIMACIÓN
    // =========================================

   if (
  this.seleccionado &&
  this.texto === "Memoria"
) {

  this.dibujarAnimacionMemoria();

}

if (
  this.seleccionado &&
  this.texto === "Herencia"
) {

  this.dibujarAnimacionHerencia();

}
if (
  this.seleccionado &&
  this.texto === "Ansiedad"
) {

  this.dibujarAnimacionAnsiedad();

}

    // =========================================
    // TITULO
    // =========================================

    noStroke();

    fill(255);

    textAlign(
      CENTER,
      CENTER
    );


    let tamañoTexto =
      this.w * 0.10;


    if (
      this.texto.length > 10
    ) {

      tamañoTexto =
        this.w * 0.075;

    }


    textSize(
      tamañoTexto
    );


    // =========================================
    // POSICIÓN DEL TITULO
    // =========================================

    let tituloY =
      this.y;


    // Si está seleccionado,
    // el título sube.

    if (this.seleccionado) {

      tituloY =
        this.y - this.h * 0.32;

    }


    text(
      this.texto,
      this.x,
      tituloY
    );

  }
dibujarAnimacionAnsiedad() {

  let tiempo =
    millis() - this.tiempoAnimacion;


  // =========================================
  // CONFIGURACIÓN
  // =========================================

  let radio =
    this.w * 0.075;

  let centroX =
    this.x;

  let centroY =
    this.y + this.h * 0.08;


  // Velocidad de los latidos
  let intervalo = 700;


  // Tiempo dentro del latido
  let tiempoCiclo =
    tiempo % intervalo;


  // =========================================
  // LATIDO
  // =========================================

  let progreso =
    tiempoCiclo / intervalo;


  // Pulso rápido al principio
  // y relajación después
  let pulso;

  if (progreso < 0.25) {

    pulso =
      easeOut(progreso / 0.25);

  }
  else {

    pulso =
      1 -
      easeOut(
        (progreso - 0.25) / 0.75
      );

  }


  // Tamaño del círculo
  let radioActual =
    radio +
    pulso * radio * 0.30;


  // =========================================
  // ARO
  // =========================================

  let radioAro =
    radio +
    progreso *
    this.w * 0.22;


  let alphaAro =
    map(
      progreso,
      0,
      1,
      180,
      0
    );


  noFill();

  stroke(
    255,
    100,
    120,
    alphaAro
  );

  strokeWeight(
    this.w * 0.010
  );

  circle(
    centroX,
    centroY,
    radioAro * 2
  );


  // =========================================
  // CÍRCULO CENTRAL
  // =========================================

  fill(
    255,
    60,
    80,
    230
  );

  stroke(
    255,
    180,
    190,
    240
  );

  strokeWeight(
    this.w * 0.014
  );

  circle(
    centroX,
    centroY,
    radioActual * 2
  );

}

  // =========================================
  // ANIMACIÓN MEMORIA
  // =========================================

  dibujarAnimacionMemoria() {

    let tiempo =
      millis() - this.tiempoAnimacion;


    // =========================================
    // CÍRCULOS
    // =========================================

    let radio =
      this.w * 0.16;


    let separacion =
      this.w * 0.16;


    let izquierda =
      this.x - separacion;


    let centro =
      this.x;


    let derecha =
      this.x + separacion;


    let y =
      this.y +
      this.h * 0.08;


    // =========================================
    // APARICIÓN
    // =========================================

    // Cada círculo aparece
    // después del anterior.

    let tiempoIzquierda = 200;
    let tiempoCentro = 600;
    let tiempoDerecha = 1000;


    // =========================================
    // CÍRCULO IZQUIERDO
    // =========================================

    if (tiempo > tiempoIzquierda) {

      let progreso =
        constrain(
          map(
            tiempo,
            tiempoIzquierda,
            tiempoIzquierda + 300,
            0,
            1
          ),
          0,
          1
        );


      let escala =
        easeOut(progreso);


      this.dibujarRecuerdo(
        izquierda,
        y,
        radio * escala,
        color(255, 80, 100),
        255
      );

    }


    // =========================================
    // CÍRCULO CENTRAL
    // =========================================

    if (tiempo > tiempoCentro) {

      let progreso =
        constrain(
          map(
            tiempo,
            tiempoCentro,
            tiempoCentro + 300,
            0,
            1
          ),
          0,
          1
        );


      let escala =
        easeOut(progreso);


      this.dibujarRecuerdo(
        centro,
        y,
        radio * escala,
        color(180, 120, 130),
        180
      );

    }


    // =========================================
    // CÍRCULO DERECHO
    // =========================================

    if (tiempo > tiempoDerecha) {

      let progreso =
        constrain(
          map(
            tiempo,
            tiempoDerecha,
            tiempoDerecha + 300,
            0,
            1
          ),
          0,
          1
        );


      let escala =
        easeOut(progreso);


      this.dibujarRecuerdo(
        derecha,
        y,
        radio * escala,
        color(125, 125, 125),
        110
      );

    }

  }
// =========================================
// ANIMACIÓN HERENCIA
// =========================================

dibujarAnimacionHerencia() {

  let tiempo =
    millis() - this.tiempoAnimacion;


  // =========================================
  // TAMAÑO
  // =========================================

  let radio =
    this.w * 0.075;


  // =========================================
  // ETAPA
  // =========================================

  let duracionEtapa = 1000;

  let etapa =
    floor(tiempo / duracionEtapa);


  // Repite la animación
  etapa = etapa % 3;


  let tiempoEtapa =
    tiempo % duracionEtapa;


  // =========================================
  // POSICIONES
  // =========================================

  let y =
    this.y +
    this.h * 0.08;


  // =========================================
  // ETAPA 1
  // UN CÍRCULO
  // =========================================

  if (etapa === 0) {

    let progreso =
      constrain(
        map(
          tiempoEtapa,
          0,
          350,
          0,
          1
        ),
        0,
        1
      );


    let escala =
      easeOut(progreso);


    this.dibujarCirculoHerencia(
      this.x - this.w * 0.20,
      y,
      radio * escala
    );

  }


  // =========================================
  // ETAPA 2
  // DOS CÍRCULOS
  // =========================================

  else if (etapa === 1) {

    let progreso =
      constrain(
        map(
          tiempoEtapa,
          0,
          350,
          0,
          1
        ),
        0,
        1
      );


    let escala =
      easeOut(progreso);


   let separacion =
  this.w * 0.09;

this.dibujarCirculoHerencia(
  this.x,
  y - separacion,
  radio * escala
);

this.dibujarCirculoHerencia(
  this.x,
  y + separacion,
  radio * escala
);
  }


  // =========================================
  // ETAPA 3
  // CUATRO CÍRCULOS
  // =========================================

  else if (etapa === 2) {

    let progreso =
      constrain(
        map(
          tiempoEtapa,
          0,
          350,
          0,
          1
        ),
        0,
        1
      );


    let escala =
      easeOut(progreso);


   let separacion =
  this.w * 0.16;

for (let i = 0; i < 4; i++) {

  let yCirculo =
    y +
    (i - 1.5) * separacion;

  this.dibujarCirculoHerencia(
    this.x + this.w * 0.20,
    yCirculo,
    radio * escala
  );

}

  }

}
// =========================================
// CÍRCULO DE HERENCIA
// =========================================

dibujarCirculoHerencia(
  x,
  y,
  radio
) {

  fill(180, 120, 255, 180);

  stroke(220, 190, 255);

  strokeWeight(
    this.w * 0.012
  );

  circle(
    x,
    y,
    radio * 2
  );

}
  // =========================================
  // DIBUJAR RECUERDO
  // =========================================

  dibujarRecuerdo(
    x,
    y,
    radio,
    colorCirculo,
    alpha
  ) {

    // Sin relleno fuerte:
    // queremos que parezca un registro
    // que se va desgastando.

    fill(
      red(colorCirculo),
      green(colorCirculo),
      blue(colorCirculo),
      alpha * 0.35
    );

    stroke(
      red(colorCirculo),
      green(colorCirculo),
      blue(colorCirculo),
      alpha
    );

    strokeWeight(
      this.w * 0.012
    );


    circle(
      x,
      y,
      radio * 2
    );

  }


  // =========================================
  // CLICK
  // =========================================

  click() {

    return this.hover();

  }


  // =========================================
  // SELECCIONAR
  // =========================================

  seleccionar() {

    this.seleccionado = true;

    this.tiempoAnimacion =
      millis();

  }

}


// =========================================
// EASING
// =========================================

function easeOut(t) {

  return 1 -
    pow(
      1 - t,
      3
    );

}