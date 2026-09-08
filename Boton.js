
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
    this.tiempoAnimacion = millis();

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
    // ANIMACIONES
    // SIEMPRE ACTIVAS
    // =========================================

    if (this.texto === "Memoria") {

      this.dibujarAnimacionMemoria();

    }

    if (this.texto === "Herencia") {

      this.dibujarAnimacionHerencia();

    }

    if (this.texto === "Caducidad") {

     this.dibujarAnimacionCaducidad();

    }

    if (this.texto === "Identidad") {

      this.dibujarAnimacionIdentidad();

    }

    if (this.texto === "Empatia") {

      this.dibujarAnimacionEmpatia();

    }

    if (this.texto === "Colaboracion") {

     this.dibujarAnimacionColaboracion();

    }

    if (this.texto === "Incertidumbre") {

     this.dibujarAnimacionIncertidumbre();

    }

    if (this.texto === "Ansiedad") {

     this.dibujarAnimacionAnsiedad();

    }

    if (this.texto === "Expectativa") {

     this.dibujarAnimacionExpectativa();

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
  this.y - this.h * 0.32;


    text(
      this.texto,
      this.x,
      tituloY
    );

  }

dibujarAnimacionCaducidad() {

  let tiempo =
    millis() - this.tiempoAnimacion;

  let duracionCrecimiento = 1200;
  let duracionDesaparicion = 800;

  let ciclo =
    duracionCrecimiento +
    duracionDesaparicion;

  let tiempoCiclo =
    tiempo % ciclo;


  // =========================================
  // CRECIMIENTO
  // =========================================

  if (tiempoCiclo < duracionCrecimiento) {

    let progreso =
      constrain(
        map(
          tiempoCiclo,
          0,
          duracionCrecimiento,
          0,
          1
        ),
        0,
        1
      );

    let escala =
      easeOut(progreso);

    let radioMinimo =
      this.w * 0.04;

    let radioMaximo =
      this.w * 0.25;

    let radio =
      lerp(
        radioMinimo,
        radioMaximo,
        escala
      );

    fill(
      180,
      120,
      255,
      180
    );

    stroke(
      220,
      190,
      255,
      220
    );

    strokeWeight(
      this.w * 0.012
    );

    circle(
      this.x,
      this.y + this.h * 0.08,
      radio * 2
    );

  }


  // =========================================
  // DESAPARICIÓN
  // =========================================

  else {

    let progreso =
      constrain(
        map(
          tiempoCiclo,
          duracionCrecimiento,
          ciclo,
          0,
          1
        ),
        0,
        1
      );

    let alpha =
      map(
        progreso,
        0,
        1,
        180,
        0
      );

    let radio =
      this.w * 0.25;


    fill(
      180,
      120,
      255,
      alpha
    );

    stroke(
      220,
      190,
      255,
      alpha
    );

    strokeWeight(
      this.w * 0.012
    );

    circle(
      this.x,
      this.y + this.h * 0.08,
      radio * 2
    );

  }

}
  // =========================================
  // ANIMACIÓN ANSIEDAD
  // =========================================

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


    // =========================================
    // TAMAÑO DEL CÍRCULO
    // =========================================

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
  let tiempoCiclo = 2400;
  let tiempo = (millis() - this.tiempoAnimacion) % tiempoCiclo;

  let radio = this.w * 0.16;
  let separacion = this.w * 0.16;

  let izquierda = this.x - separacion;
  let centro = this.x;
  let derecha = this.x + separacion;
  let y = this.y + this.h * 0.08;

  let dibujarCirculo = (x, inicio, colorBase, alpha) => {
    if (tiempo < inicio) return;

    let progreso = constrain((tiempo - inicio) / 300, 0, 1);
    let escala = easeOut(progreso);

    stroke(255);
    strokeWeight(2);
    fill(red(colorBase), green(colorBase), blue(colorBase), alpha);
    ellipse(x, y, radio * 2 * escala, radio * 2 * escala);
  };

  dibujarCirculo(izquierda, 200, color(255,80,100), 255);
  dibujarCirculo(centro, 600, color(180,120,130), 180);
  dibujarCirculo(derecha, 1000, color(125,125,125), 110);
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

    fill(
      180,
      120,
      255,
      180
    );

    stroke(
      220,
      190,
      255
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
  // DIBUJAR RECUERDO
  // =========================================

  dibujarRecuerdo(
    x,
    y,
    radio,
    colorCirculo,
    alpha
  ) {

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

    // Reinicia la animación al seleccionar,
    // pero las animaciones ya están activas
    // desde el comienzo.

    this.tiempoAnimacion =
      millis();

  }
dibujarAnimacionIdentidad() {

  let tiempo = millis() - this.tiempoAnimacion;

  let ciclo = 2400;
  let tiempoCiclo = tiempo % ciclo;

  let centroX = this.x;
  let centroY = this.y + this.h * 0.08;

  let tamaño = this.w * 0.13;

  // Movimiento del triángulo que se aleja
  let progreso;

  if (tiempoCiclo < 800) {

    progreso = map(
      tiempoCiclo,
      0,
      800,
      0,
      1
    );

  } else if (tiempoCiclo < 1600) {

    progreso = map(
      tiempoCiclo,
      800,
      1600,
      1,
      0
    );

  } else {

    progreso = 0;

  }

  progreso = easeInOut(progreso);

  let separacion = this.w * 0.13;
  let distancia = this.w * 0.20;

  // Triángulo rojo
  this.dibujarTrianguloIdentidad(
    centroX - separacion,
    centroY,
    tamaño,
    color(255, 70, 80)
  );

  // Triángulo azul
  this.dibujarTrianguloIdentidad(
    centroX + separacion,
    centroY,
    tamaño,
    color(70, 120, 255)
  );

  // Triángulo verde que se aleja
  let xVerde = lerp(
    centroX,
    centroX + distancia,
    progreso
  );

  this.dibujarTrianguloIdentidad(
    xVerde,
    centroY,
    tamaño,
    color(80, 220, 120)
  );

}


dibujarAnimacionIdentidad() {

  let tiempo = millis() - this.tiempoAnimacion;

  let ciclo = 3000;
  let tiempoCiclo = tiempo % ciclo;

  let centroX = this.x;
  let centroY = this.y + this.h * 0.08;

  let tamaño = this.w * 0.12;

  // =========================
  // MOVIMIENTO DEL GRUPO
  // =========================

  let movimientoX = sin(tiempo * 0.003) * this.w * 0.008;
  let movimientoY = cos(tiempo * 0.0025) * this.h * 0.008;

  let grupoX = centroX + movimientoX;
  let grupoY = centroY + movimientoY;


  // =========================
  // TRIÁNGULOS DEL GRUPO
  // =========================

  let separacion = this.w * 0.10;

  // Rojo
  let rojoX =
    grupoX - separacion +
    sin(tiempo * 0.0032) * this.w * 0.012;

  let rojoY =
    grupoY +
    cos(tiempo * 0.0028) * this.h * 0.012;


  // Azul
  let azulX =
    grupoX + separacion +
    cos(tiempo * 0.0027) * this.w * 0.010;

  let azulY =
    grupoY +
    sin(tiempo * 0.0031) * this.h * 0.010;


  // Amarillo
  let amarilloX =
    grupoX +
    sin(tiempo * 0.0025) * this.w * 0.012;

  let amarilloY =
    grupoY - separacion +
    cos(tiempo * 0.003) * this.h * 0.010;


  // Verde = individuo que se separa
  let verdeX = grupoX;
  let verdeY = grupoY + separacion;


  // =========================
  // SEPARACIÓN DEL VERDE
  // =========================

  let progreso;

  if (tiempoCiclo < 900) {

    progreso = map(
      tiempoCiclo,
      0,
      900,
      0,
      1
    );

  }

  else if (tiempoCiclo < 1800) {

    progreso = map(
      tiempoCiclo,
      900,
      1800,
      1,
      0
    );

  }

  else {

    progreso = 0;

  }

  progreso = easeInOut(progreso);

  verdeX +=
    lerp(
      0,
      this.w * 0.22,
      progreso
    );

  verdeY +=
    lerp(
      0,
      this.h * 0.03,
      progreso
    );


  // =========================
  // DIBUJAR
  // =========================

  this.dibujarTrianguloIdentidad(
    rojoX,
    rojoY,
    tamaño,
    -0.25,
    color(255, 70, 80)
  );

  this.dibujarTrianguloIdentidad(
    azulX,
    azulY,
    tamaño,
    1.8,
    color(70, 120, 255)
  );

  this.dibujarTrianguloIdentidad(
    amarilloX,
    amarilloY,
    tamaño,
    3.4,
    color(255, 210, 70)
  );

  this.dibujarTrianguloIdentidad(
    verdeX,
    verdeY,
    tamaño,
    0.9,
    color(80, 220, 120)
  );

}


dibujarTrianguloIdentidad(
  x,
  y,
  tamaño,
  rotacion,
  colorTriangulo
) {

  noFill();

  stroke(
    red(colorTriangulo),
    green(colorTriangulo),
    blue(colorTriangulo)
  );

  strokeWeight(
    this.w * 0.012
  );

  push();

  translate(x, y);

  rotate(rotacion);

  let altura = tamaño * 1.15;

  triangle(
    0,
    -altura / 2,
    -tamaño / 2,
    altura / 2,
    tamaño / 2,
    altura / 2
  );

  pop();

}
dibujarAnimacionEmpatia() {

  let tiempo = millis() - this.tiempoAnimacion;

  let ciclo = 3600;
  let tiempoCiclo = tiempo % ciclo;

  let centroX = this.x;
  let centroY = this.y + this.h * 0.08;

  let tamaño = this.w * 0.09;

  // =========================
  // POSICIONES DE LOS GRUPOS
  // =========================

  let grupoIzquierdoX =
    centroX - this.w * 0.22;

  let grupoDerechoX =
    centroX + this.w * 0.22;


  // =========================
  // MOVIMIENTO SUTIL
  // =========================

  let movimientoX =
    sin(tiempo * 0.0025) * this.w * 0.008;

  let movimientoY =
    cos(tiempo * 0.002) * this.h * 0.008;


  // =========================
  // GRUPO DE TRIÁNGULOS
  // =========================

  let triangulos = [

    [-0.07, -0.08, -0.3],
    [ 0.00,  0.08,  0.7],
    [ 0.08, -0.04, 2.8]

  ];

  for (let t of triangulos) {

    let x =
      grupoIzquierdoX +
      t[0] * this.w +
      sin(tiempo * 0.002 + t[1] * 10) * this.w * 0.008;

    let y =
      centroY +
      t[1] * this.h +
      cos(tiempo * 0.0025 + t[0] * 10) * this.h * 0.008;

    this.dibujarTrianguloEmpatia(
      x,
      y,
      tamaño,
      t[2],
      color(255, 140, 40)
    );

  }


  // =========================
  // GRUPO DE CUADRADOS
  // =========================

  let cuadrados = [

    [-0.07, -0.08, 0.2],
    [ 0.00,  0.08, 0.8],
    [ 0.08, -0.04, 1.5]

  ];

  for (let c of cuadrados) {

    let x =
      grupoDerechoX +
      c[0] * this.w +
      sin(tiempo * 0.0022 + c[1] * 10) * this.w * 0.008;

    let y =
      centroY +
      c[1] * this.h +
      cos(tiempo * 0.0027 + c[0] * 10) * this.h * 0.008;

    this.dibujarCuadradoEmpatia(
      x,
      y,
      tamaño,
      c[2],
      color(80, 220, 120)
    );

  }


  // =========================
  // TRIÁNGULO QUE VIAJA
  // =========================

  let progreso;

  if (tiempoCiclo < 1200) {

    progreso = map(
      tiempoCiclo,
      0,
      1200,
      0,
      1
    );

  }

  else if (tiempoCiclo < 2400) {

    progreso = map(
      tiempoCiclo,
      1200,
      2400,
      1,
      0
    );

  }

  else {

    progreso = 0;

  }

  progreso = easeInOut(progreso);


  // Movimiento entre los dos grupos

  let viajeroX =
    lerp(
      grupoIzquierdoX,
      grupoDerechoX,
      progreso
    );

  let viajeroY =
    centroY +
    sin(tiempo * 0.004) * this.h * 0.025;


  // =========================
  // CAMBIO DE COLOR
  // =========================

  let colorViajero;

  if (progreso < 0.5) {

    let p =
      progreso * 2;

    colorViajero = lerpColor(
      color(255, 140, 40),
      color(80, 220, 120),
      p
    );

  }

  else {

    let p =
      (progreso - 0.5) * 2;

    colorViajero = lerpColor(
      color(80, 220, 120),
      color(255, 140, 40),
      p
    );

  }


  this.dibujarTrianguloEmpatia(
    viajeroX,
    viajeroY,
    tamaño,
    -0.4,
    colorViajero
  );

}


dibujarTrianguloEmpatia(
  x,
  y,
  tamaño,
  rotacion,
  colorTriangulo
) {

  noFill();

  stroke(
    red(colorTriangulo),
    green(colorTriangulo),
    blue(colorTriangulo)
  );

  strokeWeight(
    this.w * 0.012
  );

  push();

  translate(x, y);

  rotate(rotacion);

  let altura = tamaño * 1.15;

  triangle(
    0,
    -altura / 2,
    -tamaño / 2,
    altura / 2,
    tamaño / 2,
    altura / 2
  );

  pop();

}


dibujarCuadradoEmpatia(
  x,
  y,
  tamaño,
  rotacion,
  colorCuadrado
) {

  noFill();

  stroke(
    red(colorCuadrado),
    green(colorCuadrado),
    blue(colorCuadrado)
  );

  strokeWeight(
    this.w * 0.012
  );

  push();

  translate(x, y);

  rotate(rotacion);

  rectMode(CENTER);

  rect(
    0,
    0,
    tamaño,
    tamaño
  );

  pop();

}
dibujarAnimacionColaboracion() {

  let tiempo = millis() - this.tiempoAnimacion;

  let centroX = this.x;
  let centroY = this.y + this.h * 0.08;

  let tamaño = this.w * 0.10;

  // =========================
  // POSICIONES
  // =========================

  let distancia = this.w * 0.20;

  let trianguloX =
    centroX +
    cos(tiempo * 0.0015) * this.w * 0.015;

  let trianguloY =
    centroY -
    distancia +
    sin(tiempo * 0.0018) * this.h * 0.015;


  let circuloX =
    centroX +
    distancia +
    sin(tiempo * 0.0016) * this.w * 0.015;

  let circuloY =
    centroY +
    cos(tiempo * 0.0017) * this.h * 0.015;


  let cuadradoX =
    centroX -
    distancia +
    cos(tiempo * 0.0018) * this.w * 0.015;

  let cuadradoY =
    centroY +
    distancia +
    sin(tiempo * 0.0015) * this.h * 0.015;


  // =========================
  // CONEXIONES
  // =========================

  stroke(255);
  strokeWeight(this.w * 0.006);

  line(
    centroX,
    centroY,
    trianguloX,
    trianguloY
  );

  line(
    centroX,
    centroY,
    circuloX,
    circuloY
  );

  line(
    centroX,
    centroY,
    cuadradoX,
    cuadradoY
  );


  // =========================
  // TRIÁNGULO AZUL
  // =========================

  this.dibujarTrianguloColaboracion(
    trianguloX,
    trianguloY,
    tamaño,
    -0.3,
    color(70, 140, 255)
  );


  // =========================
  // CÍRCULO VERDE
  // =========================

  noFill();

  stroke(80, 220, 120);

  strokeWeight(
    this.w * 0.012
  );

  circle(
    circuloX,
    circuloY,
    tamaño
  );


  // =========================
  // CUADRADO NARANJA
  // =========================

  noFill();

  stroke(255, 150, 50);

  strokeWeight(
    this.w * 0.012
  );

  push();

  translate(
    cuadradoX,
    cuadradoY
  );

  rotate(
    sin(tiempo * 0.0015) * 0.15
  );

  rectMode(CENTER);

  rect(
    0,
    0,
    tamaño,
    tamaño
  );

  pop();


  // =========================
  // CUADRADO CENTRAL ROJO
  // =========================

  noFill();

  stroke(255, 70, 80);

  strokeWeight(
    this.w * 0.014
  );

  rectMode(CENTER);

  rect(
    centroX,
    centroY,
    tamaño * 1.25,
    tamaño * 1.25
  );

}


dibujarTrianguloColaboracion(
  x,
  y,
  tamaño,
  rotacion,
  colorTriangulo
) {

  noFill();

  stroke(
    red(colorTriangulo),
    green(colorTriangulo),
    blue(colorTriangulo)
  );

  strokeWeight(
    this.w * 0.012
  );

  push();

  translate(x, y);

  rotate(rotacion);

  let altura =
    tamaño * 1.15;

  triangle(
    0,
    -altura / 2,
    -tamaño / 2,
    altura / 2,
    tamaño / 2,
    altura / 2
  );

  pop();

}

dibujarAnimacionIncertidumbre() {

  let tiempo = millis() - this.tiempoAnimacion;

  let ciclo = 3600;
  let tiempoCiclo = tiempo % ciclo;

  let centroX = this.x;
  let centroY = this.y + this.h * 0.08;

  let radio = this.w * 0.055;


  // =========================
  // MOVIMIENTO DEL CÍRCULO BLANCO
  // =========================

  let progreso;

  if (tiempoCiclo < 1800) {

    progreso = map(
      tiempoCiclo,
      0,
      1800,
      0,
      1
    );

  }

  else {

    progreso = map(
      tiempoCiclo,
      1800,
      3600,
      1,
      0
    );

  }

  progreso = easeInOut(progreso);


  // =========================
  // POSICIÓN DEL CÍRCULO BLANCO
  // =========================

  let circuloX = lerp(
    centroX - this.w * 0.32,
    centroX + this.w * 0.32,
    progreso
  );

  let circuloY =
    centroY +
    sin(tiempo * 0.003) *
    this.h * 0.025;


  // =========================
  // CERCANÍA AL GRUPO
  // =========================

  let distanciaAlCentro =
    abs(circuloX - centroX);

  let cercania = map(
    distanciaAlCentro,
    this.w * 0.32,
    0,
    0,
    1
  );

  cercania = constrain(
    cercania,
    0,
    1
  );

  cercania = easeInOut(cercania);


  // =========================
  // CÍRCULOS DEL GRUPO
  // =========================

  let posiciones = [

    [-0.07, -0.04],
    [ 0.00,  0.06],
    [ 0.08, -0.03],
    [-0.02,  0.14]

  ];


  for (let i = 0; i < posiciones.length; i++) {

    let baseX =
      centroX +
      posiciones[i][0] *
      this.w;

    let baseY =
      centroY +
      posiciones[i][1] *
      this.h;


    let direccionX =
      posiciones[i][0] >= 0
        ? 1
        : -1;

    let direccionY =
      posiciones[i][1] >= 0
        ? 1
        : -1;


    let alejamiento =
      this.w *
      0.14 *
      cercania;


    let x =
      baseX +
      direccionX *
      alejamiento;

    let y =
      baseY +
      direccionY *
      alejamiento *
      0.6;


    // =========================
    // MOVIMIENTO SUTIL
    // =========================

    x +=
      sin(
        tiempo * 0.002 +
        i * 2
      ) *
      this.w *
      0.008;

    y +=
      cos(
        tiempo * 0.0023 +
        i * 2
      ) *
      this.h *
      0.008;


    // =========================
    // CÍRCULO GRIS
    // =========================

    noStroke();

    fill(100);

    circle(
      x,
      y,
      radio * 2
    );

  }


  // =========================
  // CÍRCULO BLANCO PRINCIPAL
  // =========================

  noStroke();

  fill(255);

  circle(
    circuloX,
    circuloY,
    radio * 2
  );

}

dibujarAnimacionAnsiedad() {

  let tiempo =
    millis() - this.tiempoAnimacion;

  let ciclo =
    3600;

  let tiempoCiclo =
    tiempo % ciclo;

  let centroX =
    this.x;

  let centroY =
    this.y + this.h * 0.08;

  let radio =
    this.w * 0.055;


  // =========================
  // POSICIONES
  // =========================

  let posiciones = [

    {
      x: centroX - this.w * 0.18,
      y: centroY - this.h * 0.13
    },

    {
      x: centroX + this.w * 0.18,
      y: centroY - this.h * 0.13
    },

    {
      x: centroX,
      y: centroY + this.h * 0.17
    }

  ];


  // =========================
  // CÍRCULO QUE SE ACERCA
  // =========================

  let circuloActivo =
    floor(tiempoCiclo / 1200);

  circuloActivo =
    circuloActivo % 3;


  let tiempoActivo =
    tiempoCiclo % 1200;


  // Se acerca durante la primera mitad
  // y se aleja durante la segunda.

  let progreso;

  if (tiempoActivo < 600) {

    progreso = map(
      tiempoActivo,
      0,
      600,
      0,
      1
    );

  }

  else {

    progreso = map(
      tiempoActivo,
      600,
      1200,
      1,
      0
    );

  }

  progreso =
    easeInOut(progreso);


  // =========================
  // CÍRCULOS EXTERNOS
  // =========================

  for (
    let i = 0;
    i < posiciones.length;
    i++
  ) {

    let pos =
      posiciones[i];


    // =========================
    // ACTIVACIÓN
    // =========================

    let intensidad =
      0;

    if (i === circuloActivo) {

      intensidad =
        progreso;

    }


    // =========================
    // MOVIMIENTO NORMAL
    // =========================

    let movimientoX =
      sin(
        tiempo * 0.002 +
        i * 2
      ) *
      this.w *
      0.006;

    let movimientoY =
      cos(
        tiempo * 0.0023 +
        i * 2
      ) *
      this.h *
      0.006;


    // =========================
    // TEMBLOR
    // =========================

    let temblorX =
      sin(
        tiempo * 0.045 +
        i * 10
      ) *
      this.w *
      0.025 *
      intensidad;

    let temblorY =
      cos(
        tiempo * 0.052 +
        i * 8
      ) *
      this.h *
      0.025 *
      intensidad;


    let x =
      pos.x +
      movimientoX +
      temblorX;

    let y =
      pos.y +
      movimientoY +
      temblorY;


    // =========================
    // LATIDO
    // =========================

    let latido =
      sin(
        tiempo * 0.035 +
        i
      );

    let escala =
      1 +
      max(0, latido) *
      0.20 *
      intensidad;


    // =========================
    // COLOR
    // =========================

    let colorActual =
      lerpColor(
        color(255),
        color(255, 50, 60),
        intensidad
      );


    noStroke();

    fill(colorActual);

    circle(
      x,
      y,
      radio * 2 * escala
    );

  }


  // =========================
  // CÍRCULO CENTRAL
  // =========================

  let posicionObjetivo =
    posiciones[circuloActivo];


  let distancia =
    dist(
      centroX,
      centroY,
      posicionObjetivo.x,
      posicionObjetivo.y
    );


  // El círculo central se acerca
  // al círculo activo.

  let centralX =
    lerp(
      centroX,
      posicionObjetivo.x,
      progreso
    );

  let centralY =
    lerp(
      centroY,
      posicionObjetivo.y,
      progreso
    );


  // =========================
  // MOVIMIENTO DEL CENTRAL
  // =========================

  centralX +=
    sin(tiempo * 0.004) *
    this.w *
    0.004;

  centralY +=
    cos(tiempo * 0.003) *
    this.h *
    0.004;


  // =========================
  // CÍRCULO CENTRAL
  // =========================

  noStroke();

  fill(255);

  circle(
    centralX,
    centralY,
    radio * 2
  );

}


dibujarAnimacionExpectativa() {

  let tiempo =
    millis() - this.tiempoAnimacion;

  let ciclo =
    4200;

  let tiempoCiclo =
    tiempo % ciclo;

  let centroX =
    this.x;

  let centroY =
    this.y + this.h * 0.08;

  let radioMinimo =
    this.w * 0.06;

  let radioMaximo =
    this.w * 0.22;


  // =========================
  // FASE DE CRECIMIENTO
  // =========================

  let duracionCrecimiento =
    3000;

  let progreso =
    constrain(
      map(
        tiempoCiclo,
        0,
        duracionCrecimiento,
        0,
        1
      ),
      0,
      1
    );

  progreso =
    easeOut(progreso);


  // =========================
  // EXPULSIÓN
  // =========================

  let expulsando =
    tiempoCiclo >= duracionCrecimiento;


  let progresoExpulsion =
    0;

  if (expulsando) {

    progresoExpulsion =
      constrain(
        map(
          tiempoCiclo,
          duracionCrecimiento,
          ciclo,
          0,
          1
        ),
        0,
        1
      );

    progresoExpulsion =
      easeOut(progresoExpulsion);

  }


  // =========================
  // RADIO DEL CÍRCULO CENTRAL
  // =========================

  let radioActual;

  if (!expulsando) {

    radioActual =
      lerp(
        radioMinimo,
        radioMaximo,
        progreso
      );

  }

  else {

    radioActual =
      lerp(
        radioMaximo,
        radioMinimo,
        progresoExpulsion
      );

  }


  // =========================
  // COLOR
  // =========================

  let colores = [

    color(180, 100, 255),
    color(255, 140, 50),
    color(80, 220, 120),
    color(70, 140, 255),
    color(255, 210, 60)

  ];

  let indiceColor =
    floor(
      tiempo / ciclo
    ) % colores.length;

  let colorActual =
    colores[indiceColor];


  // =========================
  // CÍRCULOS QUE ENTRAN
  // =========================

  let cantidad =
    18;

  for (
    let i = 0;
    i < cantidad;
    i++
  ) {

    let angulo =
      i * 2.399;


    // Posición exterior

    let distanciaExterior =
      this.w * 0.38;


    // Los círculos van entrando
    // desde afuera hacia el centro.

    let distanciaInterior =
      radioActual * 0.65;


    let distancia;

    if (!expulsando) {

      // Cada círculo entra progresivamente
      // en distintos momentos.

      let retraso =
        i * 90;

      let entrada =
        constrain(
          map(
            tiempoCiclo,
            retraso,
            duracionCrecimiento,
            0,
            1
          ),
          0,
          1
        );

      entrada =
        easeInOut(entrada);

      distancia =
        lerp(
          distanciaExterior,
          distanciaInterior,
          entrada
        );

    }

    else {

      // =========================
      // EXPULSIÓN HACIA AFUERA
      // =========================

      distancia =
        lerp(
          radioActual * 0.65,
          distanciaExterior * 1.6,
          progresoExpulsion
        );

    }


    let x =
      centroX +
      cos(angulo) *
      distancia;

    let y =
      centroY +
      sin(angulo) *
      distancia;


    // =========================
    // MOVIMIENTO SUTIL
    // =========================

    x +=
      sin(
        tiempo * 0.004 +
        i * 2
      ) *
      this.w *
      0.006;

    y +=
      cos(
        tiempo * 0.0035 +
        i * 2
      ) *
      this.h *
      0.006;


    // =========================
    // ALPHA
    // =========================

    let alpha = 255;

    if (expulsando) {

      alpha =
        map(
          progresoExpulsion,
          0,
          1,
          255,
          0
        );

    }


    // =========================
    // CÍRCULOS BLANCOS
    // =========================

    noStroke();

    fill(
      255,
      255,
      255,
      alpha
    );

    circle(
      x,
      y,
      this.w * 0.035
    );

  }


  // =========================
  // CÍRCULO CENTRAL
  // =========================
  // Se dibuja DESPUÉS de los
  // círculos para quedar adelante.

  noStroke();

  fill(colorActual);

  circle(
    centroX,
    centroY,
    radioActual * 2
  );

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
function easeInOut(t) {

  return t < 0.5
    ? 4 * t * t * t
    : 1 - pow(-2 * t + 2, 3) / 2;

}
