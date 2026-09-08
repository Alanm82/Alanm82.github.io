class  Colaboracion {

 constructor() {

    this.personas = [];

    this.colorAyuda = color(255, 60, 60);

    for (let i = 0; i < 45; i++) {

      this.personas.push(
        new PersonaEmpatia(
          random(30, width - 30),
          random(30, height - 30)
        )
      );

    }

  }


  actualizar() {

    // =========================
    // MOVIMIENTO NORMAL
    // =========================

    for (let persona of this.personas) {

      persona.actualizar();

    }


    // =========================
    // AYUDA
    // =========================

    for (let afectado of this.personas) {

      if (!afectado.afectado) {
        continue;
      }


      let cantidadAyuda = 0;


      for (let ayudante of this.personas) {

        // No puede ayudarse a sí mismo
        if (ayudante === afectado) {
          continue;
        }


        // Solo los que no están afectados ayudan
        if (ayudante.afectado) {
          continue;
        }


        let distancia = dist(
          ayudante.x,
          ayudante.y,
          afectado.x,
          afectado.y
        );


        // =========================
        // CÍRCULO CERCANO
        // =========================

        if (distancia < 180) {

          cantidadAyuda++;

          let distanciaContacto =
            ayudante.radio +
            afectado.radio +
            5;

          if (distancia >= distanciaContacto) {

            // Todavía no llegó: se sigue acercando
            ayudante.acercarse(
              afectado.x,
              afectado.y
            );

          } else {

            // Ya la alcanzó: se queda
            // acompañándola en el lugar
            ayudante.ayudando = afectado;

          }

        }

      }


      // =========================
      // RECUPERACIÓN
      // =========================

      // Solamente empieza a recuperarse
      // cuando al menos un ayudante está
      // realmente tocándolo.

      let estaSiendoAyudado = false;


      for (let ayudante of this.personas) {

        if (ayudante === afectado) {
          continue;
        }

        if (ayudante.afectado) {
          continue;
        }


        let distancia = dist(
          ayudante.x,
          ayudante.y,
          afectado.x,
          afectado.y
        );


        if (
          distancia <
          ayudante.radio +
          afectado.radio +
          5
        ) {

          estaSiendoAyudado = true;

          break;

        }

      }


      if (estaSiendoAyudado) {

        let velocidadRecuperacion = map(
          cantidadAyuda,
          1,
          10,
          0.002,
          0.015
        );

        velocidadRecuperacion =
          constrain(
            velocidadRecuperacion,
            0.002,
            0.015
          );


        afectado.recuperar(
          velocidadRecuperacion
        );

      }

    }


    // =========================
    // LIBERAR AYUDANTES
    // =========================

    // Una vez que la figura que estaban
    // acompañando ya puede moverse de nuevo,
    // los ayudantes quedan libres para alejarse.

    for (let persona of this.personas) {

      if (
        persona.ayudando !== null &&
        !persona.ayudando.afectado
      ) {

        persona.ayudando = null;

        persona.velocidadObjetivo =
          persona.velocidadBase;

      }

    }

  }


  dibujar() {

    background(20);


    // =========================
    // LÍNEAS DE AYUDA
    // =========================

    for (let afectado of this.personas) {

      if (!afectado.afectado) {
        continue;
      }


      for (let ayudante of this.personas) {

        if (ayudante === afectado) {
          continue;
        }

        if (ayudante.afectado) {
          continue;
        }


        let distancia = dist(
          ayudante.x,
          ayudante.y,
          afectado.x,
          afectado.y
        );


        // Línea solamente mientras
        // el ayudante está cerca.

        if (distancia < 180) {

          let alpha = map(
            distancia,
            0,
            180,
            140,
            0
          );


          stroke(
            255,
            alpha
          );

          strokeWeight(1.5);


          line(
            ayudante.x,
            ayudante.y,
            afectado.x,
            afectado.y
          );

        }

      }

    }


    // =========================
    // FIGURAS
    // =========================

    for (let persona of this.personas) {

      persona.dibujar();

    }

  }


  // =========================
  // COMPUTADORA
  // =========================

  mousePressed() {

    this.intentarAfectar(
      mouseX,
      mouseY
    );

  }


  // =========================
  // CELULAR
  // =========================

  touchStarted() {

    for (let i = 0; i < touches.length; i++) {

      this.intentarAfectar(
        touches[i].x,
        touches[i].y
      );

    }

    return false;

  }


  // =========================
  // INTENTAR AFECTAR
  // =========================

  intentarAfectar(x, y) {

  let objetivo = null;

  for (let persona of this.personas) {

    let distancia = dist(
      x,
      y,
      persona.x,
      persona.y
    );

    if (
      distancia <
      persona.radio + 20
    ) {

      objetivo = persona;
      break;

    }

  }

  if (objetivo === null) {
    return;
  }

  if (objetivo.afectado) {
    return;
  }


  // Contar no afectados
  let cantidadDisponibles = 0;

  for (let persona of this.personas) {

    if (!persona.afectado) {
      cantidadDisponibles++;
    }

  }


  // Siempre dejamos uno disponible
  if (cantidadDisponibles <= 1) {
    return;
  }


  // Se vuelve rojo
  objetivo.afectar(
    this.colorAyuda
  );

}

}


class PersonaEmpatia {

  constructor(
    x,
    y
  ) {

    this.x = x;
    this.y = y;

    this.radio = random(12, 20);


    // =========================
    // TIPO DE FIGURA Y COLOR
    // =========================

    // Cada persona es un triángulo (verde),
    // un cuadrado (celeste) o un círculo (naranja),
    // elegido al azar.

    let tipos = ["triangulo", "cuadrado", "circulo"];

    this.tipo = random(tipos);

    if (this.tipo === "triangulo") {

      this.colorOriginal = color(60, 200, 90);

    } else if (this.tipo === "cuadrado") {

      this.colorOriginal = color(80, 180, 255);

    } else {

      this.colorOriginal = color(255, 150, 40);

    }

    this.colorActual =
      this.colorOriginal;


    // =========================
    // MOVIMIENTO
    // =========================

    this.direccion =
      p5.Vector.random2D();


    // =========================
    // ESTADO
    // =========================

    this.afectado = false;

    // A quién está acompañando/ayudando
    // (referencia a la figura congelada,
    // o null si no está ayudando a nadie)
    this.ayudando = null;

    this.retorno = 0;

    // Velocidad base reducida un 40%
    // respecto a la original (0.3 - 0.8)
    this.velocidadBase = random(0.3, 0.8) * 0.6;

    this.velocidad = this.velocidadBase;
    this.velocidadObjetivo = this.velocidadBase;

  }


  // =========================
  // ACTUALIZAR
  // =========================

  actualizar() {

  // Las figuras afectadas permanecen quietas
  if (this.afectado) {
    return;
  }

  // Si está acompañando a una figura congelada,
  // se mantiene alrededor suyo en vez de
  // moverse libremente
  if (this.ayudando !== null) {

    this.mantenerCerca(
      this.ayudando.x,
      this.ayudando.y
    );

    this.chequearPantalla();

    return;

  }

  // La velocidad actual se acerca
  // progresivamente a la velocidad objetivo
  this.velocidad = lerp(
    this.velocidad,
    this.velocidadObjetivo,
    0.03
  );

  // Movimiento
  this.x +=
    this.direccion.x *
    this.velocidad;

  this.y +=
    this.direccion.y *
    this.velocidad;

  // Pequeños cambios de dirección
  if (random() < 0.01) {

    this.direccion.rotate(
      random(-0.4, 0.4)
    );

  }

  this.chequearPantalla();

}


  // =========================
  // ACERCARSE A LA FIGURA AFECTADA
  // =========================

  acercarse(x, y) {

  let objetivo = createVector(x, y);

  let posicion = createVector(
    this.x,
    this.y
  );

  let direccion = p5.Vector.sub(
    objetivo,
    posicion
  );

  if (direccion.mag() > 1) {

    direccion.normalize();

    // Cambia de dirección suavemente
    this.direccion.lerp(
      direccion,
      0.025
    );

    this.direccion.normalize();

    // En vez de aumentar la velocidad
    // de golpe, establecemos un objetivo
    // (el doble de la velocidad original: 1.2 -> 2.4)
    this.velocidadObjetivo = 2.4;

  }

}


  // =========================
  // MANTENERSE CERCA
  // (mientras la figura congelada
  // sigue sin poder moverse)
  // =========================

  mantenerCerca(x, y) {

  let objetivo = createVector(x, y);

  let posicion = createVector(
    this.x,
    this.y
  );

  let vector = p5.Vector.sub(
    objetivo,
    posicion
  );

  let distancia = vector.mag();

  // Distancia a la que se queda "flotando"
  // alrededor de la figura ayudada
  let distanciaIdeal = this.radio + 20;

  if (distancia > distanciaIdeal) {

    // Si se alejó de más, vuelve suavemente
    vector.normalize();

    this.direccion.lerp(
      vector,
      0.05
    );

    this.direccion.normalize();

    this.velocidadObjetivo = 0.3;

  } else {

    // Ya está en su lugar: se queda
    // con un movimiento mínimo, como
    // flotando en el sitio

    this.velocidadObjetivo = 0.15;

    if (random() < 0.02) {

      this.direccion.rotate(
        random(-0.5, 0.5)
      );

    }

  }

  this.velocidad = lerp(
    this.velocidad,
    this.velocidadObjetivo,
    0.05
  );

  this.x +=
    this.direccion.x *
    this.velocidad;

  this.y +=
    this.direccion.y *
    this.velocidad;

}


  // =========================
  // VOLVERSE ROJO
  // =========================

  afectar(colorNuevo) {

    this.afectado = true;

    this.retorno = 0;

    this.colorActual =
      colorNuevo;

  }


  // =========================
  // RECUPERARSE
  // =========================

  recuperar(velocidad) {

    this.retorno +=
      velocidad;


    this.retorno =
      constrain(
        this.retorno,
        0,
        1
      );


    // Rojo → color original
    this.colorActual =
      lerpColor(
        color(255, 60, 60),
        this.colorOriginal,
        this.retorno
      );


    // Recuperación completa
    if (
      this.retorno >= 1
    ) {

      this.terminarAyuda();

    }

  }


  // =========================
  // VOLVER A LA NORMALIDAD
  // =========================

  terminarAyuda() {

  this.afectado = false;

  this.retorno = 1;

  this.colorActual =
    this.colorOriginal;

  // Nueva dirección
  this.direccion =
    p5.Vector.random2D();

  this.direccion.normalize();

  // Vuelve progresivamente
  // a su velocidad normal
  this.velocidadObjetivo =
    this.velocidadBase;

}


  // =========================
  // BORDES
  // =========================

  chequearPantalla() {

    if (
      this.x < this.radio ||
      this.x > width - this.radio
    ) {

      this.direccion.x *= -1;

    }


    if (
      this.y < this.radio ||
      this.y > height - this.radio
    ) {

      this.direccion.y *= -1;

    }


    this.x = constrain(
      this.x,
      this.radio,
      width - this.radio
    );

    this.y = constrain(
      this.y,
      this.radio,
      height - this.radio
    );

  }


  // =========================
  // DIBUJAR
  // =========================

  dibujar() {

    // Sin relleno, solo outline
    noFill();

    stroke(
      this.colorActual
    );

    strokeWeight(2);


    if (this.tipo === "circulo") {

      circle(
        this.x,
        this.y,
        this.radio * 2
      );

    } else if (this.tipo === "cuadrado") {

      rectMode(CENTER);

      rect(
        this.x,
        this.y,
        this.radio * 1.8,
        this.radio * 1.8
      );

    } else if (this.tipo === "triangulo") {

      // Triángulo equilátero centrado en (x, y)

      let r = this.radio * 1.15;

      let x1 = this.x + r * cos(-HALF_PI);
      let y1 = this.y + r * sin(-HALF_PI);

      let x2 = this.x + r * cos(-HALF_PI + TWO_PI / 3);
      let y2 = this.y + r * sin(-HALF_PI + TWO_PI / 3);

      let x3 = this.x + r * cos(-HALF_PI + 2 * TWO_PI / 3);
      let y3 = this.y + r * sin(-HALF_PI + 2 * TWO_PI / 3);

      triangle(
        x1, y1,
        x2, y2,
        x3, y3
      );

    }

  }

}
