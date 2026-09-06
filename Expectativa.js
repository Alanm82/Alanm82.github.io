class Expectativa {

    constructor() {

        this.centro = createVector(width / 2, height / 2);

        // --- La esfera central ---
        this.radioBase = 40;

        // Proporcional a la pantalla: para que en la ultima bolita se vea
        // realmente grande, con pinta de que va a estallar
        this.radioMaximo = min(width, height) * 0.42;

        this.radioActual = this.radioBase;
        this.radioObjetivo = this.radioBase;

        this.amplitudMaximaPalpito = 5;
        this.palpito = 0;

        // El "fuego" ahora representa el brillo reciente: sube de golpe
        // cada vez que absorbe una bolita, y decae solo con el tiempo
        this.fuegoBase = 0.12;
        this.fuego = this.fuegoBase;

        this.colorNucleo = color(255, 225, 150);

        // Paleta de colores para la esfera. Se elige una nueva cada vez
        // que se reinicia el ciclo (al explotar), para que haya variedad
        this.paletaColores = [
            color(255, 120, 40),
            color(80, 180, 255),
            color(170, 100, 255),
            color(90, 220, 150),
            color(255, 90, 120),
            color(255, 210, 90)
        ];

        this.colorActualCirculo = this.paletaColores[0];

        // --- Ciclo de absorcion / explosion ---
        this.cantidadTotal = 15;
        this.absorbidas = 0;

        // El crecimiento ya no es parejo: arranca lento y se acelera hacia
        // el final, para que las ultimas bolitas la hinchen de golpe y se
        // note que esta por explotar
        this.exponenteCrecimiento = 1.8;

        // --- Ciclo final: pulsa varias veces al comer la ultima bolita,
        // y recien en el ultimo pulso explota de verdad y reinicia ---
        this.estado = 'normal'; // 'normal' | 'pulsando' | 'explotando'

        this.cantidadPulsos = 4;
        this.pulsoActual = 0;
        this.duracionPulso = 380;
        this.momentoPulso = 0;

        this.momentoExplosion = 0;
        this.duracionExplosion = 550;

        this.explosionRadioOnda = 0;
        this.explosionAlphaOnda = 0;

        // --- Bolitas chicas ---
        this.personas = [];
        this.generarPersonas();

        // --- Arrastre: una sola bolita a la vez, funciona con mouse y touch ---
        this.arrastrando = null;
        this.offsetArrastre = createVector(0, 0);
        this.velocidadArrastreActual = createVector(0, 0);

    }

    // Genera las bolitas. Si se le pasa un origen (al reiniciar despues de
    // una explosion), nacen todas ahi mismo y salen disparadas hacia
    // afuera, como si el centro las estuviera liberando.
    generarPersonas(origenLiberacion = null) {

        this.personas = [];

        let radioPantalla = min(width, height);

        for (let i = 0; i < this.cantidadTotal; i++) {

            let angulo = random(TWO_PI);

            let pos, vel;

            if (origenLiberacion) {

                pos = origenLiberacion.copy();
                vel = p5.Vector.fromAngle(angulo).mult(random(3.5, 7.5));

            } else {

                let distancia = radioPantalla * random(0.22, 0.42);

                pos = createVector(
                    this.centro.x + cos(angulo) * distancia,
                    this.centro.y + sin(angulo) * distancia
                );

                vel = createVector(0, 0);

            }

            this.personas.push({

                pos: pos,
                vel: vel,
                acc: createVector(0, 0),

                masa: random(0.8, 1.5),
                friccion: random(0.95, 0.98),

                r: random(9, 16),

                // Deriva ambiental: minima, solo para que nunca esten del
                // todo quietas mientras nadie las toca
                anguloDeriva: random(TWO_PI),
                proximoCambioDeriva: millis() + random(1200, 3000),

                faseRespira: random(TWO_PI),

                temblorIntensidad: random(0.3, 1.2),
                semillaTemblor: random(1000)

            });

        }

    }

    aplicarFuerzaPersona(p, fuerza) {

        let f = fuerza.copy();
        f.div(p.masa);
        p.acc.add(f);

    }

    // Elige un color de la paleta distinto al que esta puesto ahora
    elegirColorSiguiente() {

        let opciones = this.paletaColores.filter(
            c => c.toString() !== this.colorActualCirculo.toString()
        );

        return random(opciones);

    }

    actualizar() {

        // --- Pulsando: ya se comio la ultima bolita, late fuerte varias
        // veces antes de explotar de verdad ---
        if (this.estado === 'pulsando') {

            let t = millis() - this.momentoPulso;
            let progresoPulso = constrain(t / this.duracionPulso, 0, 1);

            // Cada pulso pega un poco mas fuerte que el anterior
            let intensidadPulso = map(this.pulsoActual, 0, this.cantidadPulsos - 1, 0.5, 1);

            let swell = sin(progresoPulso * PI);

            this.radioActual = this.radioObjetivo * (1 + swell * 0.28 * intensidadPulso);
            this.fuego = 1;

            if (t > this.duracionPulso) {

                this.pulsoActual++;

                if (this.pulsoActual >= this.cantidadPulsos) {

                    this.estado = 'explotando';
                    this.momentoExplosion = millis();

                    this.explosionRadioOnda = this.radioActual;
                    this.explosionAlphaOnda = 255;

                    // Cambia de color justo al estallar
                    this.colorActualCirculo = this.elegirColorSiguiente();

                } else {

                    this.momentoPulso = millis();

                }

            }

            return;

        }

        // --- Explotando: ahora si, la explosion real, y despues reinicia ---
        if (this.estado === 'explotando') {

            let t = millis() - this.momentoExplosion;
            let progreso = constrain(t / this.duracionExplosion, 0, 1);

            // Se hincha fuerte y colapsa de golpe
            this.radioActual = this.radioObjetivo * (1 + sin(progreso * PI) * 0.7);
            this.fuego = 1;

            // Onda expansiva que se aleja y se desvanece
            this.explosionRadioOnda += 16;
            this.explosionAlphaOnda = lerp(this.explosionAlphaOnda, 0, 0.1);

            if (t > this.duracionExplosion) {

                this.radioMaximo = min(width, height) * 0.42;

                this.generarPersonas();

                this.absorbidas = 0;
                this.pulsoActual = 0;
                this.radioObjetivo = this.radioBase;
                this.radioActual = this.radioBase;
                this.fuego = this.fuegoBase;

                this.estado = 'normal';

            }

            return;

        }

        // --- Esfera: crecimiento suave hacia el objetivo, brillo que decae ---
        this.radioActual = lerp(this.radioActual, this.radioObjetivo, 0.1);
        this.fuego = lerp(this.fuego, this.fuegoBase, 0.01);

        let umbralPalpito = 0.75;

        if (this.fuego > umbralPalpito) {

            let intensidad = map(this.fuego, umbralPalpito, 1, 0, 1);

            // El latido crece con cuantas bolitas ya absorbio: cerca del
            // final, late mas fuerte, reforzando que esta por explotar
            let progreso = this.absorbidas / this.cantidadTotal;
            let amplitud = lerp(this.amplitudMaximaPalpito, this.amplitudMaximaPalpito * 3, progreso);

            this.palpito = sin(millis() * 0.006) * amplitud * intensidad;

        } else {

            this.palpito = 0;

        }

        this.radioActual += this.palpito;

        // --- Bolitas ---
        for (let i = this.personas.length - 1; i >= 0; i--) {

            let p = this.personas[i];

            if (p === this.arrastrando) {

                // Mientras se arrastra, la posicion sigue directo al
                // puntero; la fisica normal se pausa
                p.acc.mult(0);

            } else {

                // Deriva ambiental minima
                if (millis() > p.proximoCambioDeriva) {

                    p.anguloDeriva += random(-0.6, 0.6);
                    p.proximoCambioDeriva = millis() + random(1200, 3000);

                }

                let derivaFuerza = p5.Vector.fromAngle(p.anguloDeriva).mult(0.006);
                this.aplicarFuerzaPersona(p, derivaFuerza);

                // Repulsion suave entre bolitas, para que no se apilen
                for (let j = 0; j < this.personas.length; j++) {

                    if (i === j) continue;

                    let otro = this.personas[j];

                    let dirRep = p5.Vector.sub(p.pos, otro.pos);
                    let distRep = dirRep.mag();
                    let distMin = p.r + otro.r + 6;

                    if (distRep < distMin && distRep > 0.0001) {

                        dirRep.normalize();

                        let intensidad = constrain((distMin - distRep) * 0.03, 0, 0.6);

                        dirRep.mult(intensidad);
                        this.aplicarFuerzaPersona(p, dirRep);

                    }

                }

                p.vel.add(p.acc);
                p.vel.mult(p.friccion);
                p.vel.limit(14);
                p.pos.add(p.vel);
                p.acc.mult(0);

                // Rebote en los bordes de pantalla
                if (p.pos.x < p.r) {
                    p.pos.x = p.r;
                    p.vel.x *= -0.6;
                } else if (p.pos.x > width - p.r) {
                    p.pos.x = width - p.r;
                    p.vel.x *= -0.6;
                }

                if (p.pos.y < p.r) {
                    p.pos.y = p.r;
                    p.vel.y *= -0.6;
                } else if (p.pos.y > height - p.r) {
                    p.pos.y = height - p.r;
                    p.vel.y *= -0.6;
                }

            }

            // --- Contacto con la esfera central: absorcion ---
            let distanciaCentro = p5.Vector.dist(p.pos, this.centro);

            if (distanciaCentro < this.radioActual + p.r) {

                if (p === this.arrastrando) this.arrastrando = null;

                this.personas.splice(i, 1);

                this.absorbidas++;

                let progreso = this.absorbidas / this.cantidadTotal;

                this.radioObjetivo =
                    this.radioBase +
                    (this.radioMaximo - this.radioBase) * pow(progreso, this.exponenteCrecimiento);

                this.fuego = min(1, this.fuego + 0.18);

            }

        }

        if (this.personas.length === 0 && this.absorbidas > 0 && this.estado === 'normal') {

            this.estado = 'pulsando';
            this.pulsoActual = 0;
            this.momentoPulso = millis();

        }

    }

    dibujar() {

        background(15);

        // Resplandor exterior
        noStroke();

        let capasResplandor = 5;

        for (let i = capasResplandor; i > 0; i--) {

            let radioCapa = this.radioActual + i * (28 * this.fuego);
            let alphaCapa = (this.fuego * 25) / (i * i);

            fill(
                red(this.colorActualCirculo),
                green(this.colorActualCirculo),
                blue(this.colorActualCirculo),
                alphaCapa
            );

            circle(this.centro.x, this.centro.y, radioCapa * 2);

        }

        // Bolitas: se iluminan mas cuanto mas cerca estan de la esfera,
        // como si sintieran la anticipacion de ser absorbidas
        for (let p of this.personas) {

            let distanciaCentro = p5.Vector.dist(p.pos, this.centro);

            let nivelVisual = map(
                distanciaCentro,
                this.radioMaximo * 1.4,
                this.radioActual + p.r,
                0,
                1,
                true
            );

            let colorPersona = lerpColor(
                color(40, 40, 50),
                color(255, 210, 140),
                nivelVisual
            );

            let temblorX =
                (noise(p.semillaTemblor, millis() * 0.0018) - 0.5) * 4 * p.temblorIntensidad;

            let temblorY =
                (noise(p.semillaTemblor + 50, millis() * 0.0018) - 0.5) * 4 * p.temblorIntensidad;

            let visualX = p.pos.x + temblorX;

            let visualY =
                p.pos.y +
                sin(millis() * 0.0012 + p.faseRespira) * 1.6 +
                temblorY;

            noStroke();
            fill(colorPersona);
            circle(visualX, visualY, p.r * 2);

            if (nivelVisual > 0.15) {

                fill(
                    red(colorPersona),
                    green(colorPersona),
                    blue(colorPersona),
                    55 * nivelVisual
                );

                circle(visualX, visualY, p.r * 2 + 14 * nivelVisual);

            }

            // Resalte sutil sobre la que se esta arrastrando
            if (p === this.arrastrando) {

                noFill();
                stroke(255, 255, 255, 120);
                strokeWeight(1.5);
                circle(visualX, visualY, p.r * 2 + 10);

            }

        }

        // Esfera central
        noStroke();
        fill(this.colorActualCirculo);
        circle(this.centro.x, this.centro.y, this.radioActual * 2);

        // Onda expansiva: solo durante la explosion real
        if (this.estado === 'explotando') {

            noFill();
            stroke(255, 255, 255, this.explosionAlphaOnda);
            strokeWeight(3);
            circle(this.centro.x, this.centro.y, this.explosionRadioOnda * 2);

        }

        // Nucleo brillante cuando esta bien cargada
        if (this.fuego > 0.3) {

            noStroke();

            fill(
                red(this.colorNucleo),
                green(this.colorNucleo),
                blue(this.colorNucleo),
                (this.fuego - 0.3) * 190
            );

            circle(this.centro.x, this.centro.y, this.radioActual * 0.88);

        }

    }

    // Busca una bolita cerca de un punto (para agarrarla)
    buscarBolitaCerca(x, y) {

        for (let p of this.personas) {

            if (dist(x, y, p.pos.x, p.pos.y) < p.r + 16) {
                return p;
            }

        }

        return null;

    }

    empezarArrastre(x, y) {

        if (this.estado !== 'normal') return;

        let objetivo = this.buscarBolitaCerca(x, y);

        if (objetivo) {

            this.arrastrando = objetivo;
            this.offsetArrastre.set(objetivo.pos.x - x, objetivo.pos.y - y);
            this.velocidadArrastreActual.set(0, 0);
            objetivo.vel.set(0, 0);

        }

    }

    moverArrastre(x, y) {

        if (!this.arrastrando) return;

        let nuevaPos = createVector(x + this.offsetArrastre.x, y + this.offsetArrastre.y);

        this.velocidadArrastreActual = p5.Vector.sub(nuevaPos, this.arrastrando.pos);

        this.arrastrando.pos.set(nuevaPos.x, nuevaPos.y);

    }

    soltarArrastre() {

        if (!this.arrastrando) return;

        // Al soltar, sale disparada con la velocidad que traia el arrastre
        let impulso = this.velocidadArrastreActual.copy().mult(1.6);
        impulso.limit(26);

        this.arrastrando.vel = impulso;
        this.arrastrando = null;

    }

    mousePressed() {
        this.empezarArrastre(mouseX, mouseY);
    }

    mouseDragged() {
        this.moverArrastre(mouseX, mouseY);
    }

    mouseReleased() {
        this.soltarArrastre();
    }

    touchStarted() {

        if (touches.length > 0) {
            this.empezarArrastre(touches[0].x, touches[0].y);
        }

        return false;

    }

    touchMoved() {

        if (touches.length > 0) {
            this.moverArrastre(touches[0].x, touches[0].y);
        }

        return false;

    }

    touchEnded() {

        this.soltarArrastre();
        return false;

    }

}