class Incertidumbre {

    constructor() {

        // La bola es el jugador: sigue al mouse con inercia y es la unica
        // fuente de luz en la escena. Con su movimiento (calmo o no) se ve
        // mas o menos de lo que la rodea.
        this.posBola = createVector(width / 2, height / 2);
        this.posBolaPrev = this.posBola.copy();

        this.radioBola = 9;

        this.colorBola = color(235, 240, 255);

        // --- Vision: cuanto se alcanza a ver alrededor de la bola ---
        this.radioVisionMin = 60;
        this.radioVisionMax = 230;
        this.radioVision = this.radioVisionMax * 0.55;

        // --- Seguimiento de calma / erraticidad del movimiento ---
        this.velSuavizada = 0;
        this.direccionPrev = null;

        // 0 = movimiento calmo, 1 = apurado/erratico. Sube rapido (penaliza
        // al toque) y baja lento (cuesta recuperar la calma), para que la
        // incertidumbre se sienta sostenida en el tiempo y no instantanea.
        this.descontrol = 0;

        // --- Los que viven en la oscuridad ---
        // Cada uno prefiere quedarse justo al borde de lo que alcanzas a
        // ver. Si estan mas lejos (invisibles, en plena oscuridad) se
        // acercan de a poco por curiosidad hasta asomarse al limite de la
        // luz. Si la bola invade esa distancia, huyen hacia afuera.
        this.circulos = [];

        let cantidad = 22;

        for (let i = 0; i < cantidad; i++) {

            this.circulos.push({

                pos: createVector(random(width), random(height)),
                vel: createVector(0, 0),
                acc: createVector(0, 0),

                masa: random(0.7, 1.3),
                friccion: 0.9,

                r: random(4, 9),

                // Que tan lejos del borde de la luz prefiere quedarse cada
                // uno, para que no formen un anillo perfecto
                factorDistancia: random(0.7, 1.05),

                faseRespira: random(TWO_PI),
                semillaTemblor: random(1000),
                semillaVacilacion: random(1000)

            });

        }

    }

    aplicarFuerza(c, fuerza) {

        let f = fuerza.copy();
        f.div(c.masa);
        c.acc.add(f);

    }

    actualizar() {

        this.posBolaPrev.set(this.posBola);

        // Control por arrastre: la bola solo se mueve mientras haya un dedo
        // o click presionado, y sigue esa posicion. mouseIsPressed y
        // mouseX/mouseY quedan sincronizados con el touch en p5, asi que
        // esto funciona igual en mouse y en celular.
        if (mouseIsPressed) {

            this.posBola.x = lerp(this.posBola.x, mouseX, 0.15);
            this.posBola.y = lerp(this.posBola.y, mouseY, 0.15);

        }

        // --- Velocidad suavizada ---
        let velInstante = p5.Vector.dist(this.posBola, this.posBolaPrev);
        this.velSuavizada = lerp(this.velSuavizada, velInstante, 0.2);

        // --- Cuanto cambia de rumbo (erraticidad) ---
        let cambioDireccion = 0;

        if (velInstante > 0.15) {

            let direccionActual = p5.Vector.sub(this.posBola, this.posBolaPrev).normalize();

            if (this.direccionPrev) {
                cambioDireccion = constrain(1 - direccionActual.dot(this.direccionPrev), 0, 1);
            }

            this.direccionPrev = direccionActual;

        }

        // --- Nivel de descontrol: combina velocidad y cambios de rumbo ---
        let velNormalizada = map(this.velSuavizada, 0, 9, 0, 1, true);

        let objetivoDescontrol = constrain(velNormalizada * 0.65 + cambioDireccion * 0.6, 0, 1);

        if (objetivoDescontrol > this.descontrol) {
            this.descontrol = lerp(this.descontrol, objetivoDescontrol, 0.18);
        } else {
            this.descontrol = lerp(this.descontrol, objetivoDescontrol, 0.02);
        }

        // --- Radio de vision: se cierra si hay descontrol, se abre despacio si hay calma ---
        let visionObjetivo = lerp(this.radioVisionMax, this.radioVisionMin, this.descontrol);
        this.radioVision = lerp(this.radioVision, visionObjetivo, 0.06);

        // --- Comportamiento de los circulos ---
        for (let c of this.circulos) {

            let dirDesdeBola = p5.Vector.sub(c.pos, this.posBola);
            let distActual = dirDesdeBola.mag();

            let dirNormal = distActual > 0.001
                ? dirDesdeBola.copy().normalize()
                : p5.Vector.random2D();

            let distObjetivo = this.radioVision * c.factorDistancia;
            let diferencia = distActual - distObjetivo;

            if (diferencia < 0) {

                // Demasiado cerca: huyen, mas urgente cuanto mas invadidos
                let intensidad = map(diferencia, -120, 0, 1.1, 0.15, true);
                this.aplicarFuerza(c, p5.Vector.mult(dirNormal, intensidad));

            } else {

                // Curiosidad: se acercan despacio a asomarse al borde de la luz
                let intensidad = map(diferencia, 0, 260, 0.015, 0.09, true);
                this.aplicarFuerza(c, p5.Vector.mult(dirNormal, -intensidad));

            }

            // Vacilacion lateral, para que no vayan en linea recta
            let lateral = createVector(-dirNormal.y, dirNormal.x);
            let onda = (noise(c.semillaVacilacion, millis() * 0.0005) - 0.5) * 0.12;
            this.aplicarFuerza(c, p5.Vector.mult(lateral, onda));

            // Contencion suave en los bordes de pantalla
            let margen = 40;

            if (c.pos.x < margen) {
                this.aplicarFuerza(c, createVector((margen - c.pos.x) * 0.02, 0));
            } else if (c.pos.x > width - margen) {
                this.aplicarFuerza(c, createVector((width - margen - c.pos.x) * 0.02, 0));
            }

            if (c.pos.y < margen) {
                this.aplicarFuerza(c, createVector(0, (margen - c.pos.y) * 0.02));
            } else if (c.pos.y > height - margen) {
                this.aplicarFuerza(c, createVector(0, (height - margen - c.pos.y) * 0.02));
            }

            c.vel.add(c.acc);
            c.vel.limit(diferencia < 0 ? 3.4 : 1.1);
            c.vel.mult(c.friccion);
            c.pos.add(c.vel);
            c.acc.mult(0);

        }

    }

    dibujar() {

        background(6);

        // --- Resplandor propio de la bola: su luz es lo unico que ilumina ---
        noStroke();

        let capasLuz = 6;

        for (let i = capasLuz; i > 0; i--) {

            let radioCapa = this.radioVision * (i / capasLuz);
            let alphaCapa = (10 / i) * (1 - this.descontrol * 0.35);

            fill(red(this.colorBola), green(this.colorBola), blue(this.colorBola), alphaCapa);

            circle(this.posBola.x, this.posBola.y, radioCapa * 2);

        }

        // --- Los que viven en la oscuridad: solo visibles dentro de la luz ---
        for (let c of this.circulos) {

            let d = p5.Vector.dist(c.pos, this.posBola);

            if (d < this.radioVision) {

                let base = map(d, 0, this.radioVision, 190, 0, true);

                let respiro = sin(millis() * 0.002 + c.faseRespira) * 1.5;

                let temblor =
                    (noise(c.semillaTemblor, millis() * 0.01) - 0.5) * 2;

                noStroke();
                fill(200, 210, 225, base);

                circle(c.pos.x + temblor, c.pos.y + respiro, c.r * 2);

            }

        }

        // --- La bola ---
        noStroke();

        let parpadeoBola = this.descontrol > 0.05
            ? noise(millis() * 0.05) * this.descontrol * 60
            : 0;

        fill(
            red(this.colorBola) - parpadeoBola,
            green(this.colorBola) - parpadeoBola,
            blue(this.colorBola) - parpadeoBola
        );

        circle(this.posBola.x, this.posBola.y, this.radioBola * 2);

    }

}