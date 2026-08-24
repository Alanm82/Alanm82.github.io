class Ansiedad {

    constructor() {

        this.centro = createVector(width / 2, height / 2);

        // Radio de la orbita donde viven los 4 puntos ansiosos, relativo al
        // tamano de pantalla -- misma logica que usa Expectativa con
        // "radioPantalla", para que ambos sistemas se sientan de la misma
        // familia visual en vez de vivir a escalas distintas.
        this.radioOrbita = min(width, height) * 0.32;

        // Los 4 puntos, ubicados en las diagonales alrededor del centro
        // (en vez de anclados a las esquinas reales de la pantalla)
        this.puntos = [];

        let angulosBase = [PI * 0.25, PI * 0.75, PI * 1.25, PI * 1.75];

        for (let angulo of angulosBase) {

            let base = createVector(
                this.centro.x + cos(angulo) * this.radioOrbita,
                this.centro.y + sin(angulo) * this.radioOrbita
            );

            this.puntos.push({

                anguloBase: angulo,
                posBase: base,
                pos: base.copy(),

                r: 24,

                nivelAnsiedad: 0,

                semillaDeriva: random(1000),
                semillaTemblor: random(1000),

                faseHalo: random(1000)

            });

        }

        // La esfera que representa el futuro: se puede arrastrar, y
        // cuanto mas se la toca mas rapido late
        this.futuro = {

            pos: createVector(this.centro.x, this.centro.y),

            r: 48,

            arrastrando: false,
            offsetArrastre: createVector(0, 0),

            ritmoBase: 1100,
            ritmoMinimo: 220,
            ritmoActual: 1100,

            proximoLatido: millis(),
            latido: 0

        };

        // Margen simple de pantalla para el arrastre, igual criterio que
        // el resto del sistema (nada de bordes rectos dibujados)
        this.margenPantalla = 60;

        // Distancia minima (siempre igual) y distancia lejana, que depende
        // del radio de orbita y se recalcula si la pantalla cambia
        this.distanciaCerca = this.futuro.r + 24 + 30;

        this.actualizarDistanciaLejos();

        // Paleta compartida de estados: de calma a mucha ansiedad
        this.colorCalma = color(120, 210, 230);
        this.colorMedio = color(255, 160, 60);
        this.colorAlto = color(235, 60, 55);

        this.colorFuturo = color(225, 225, 235);

    }

    // Se recalcula cada vez que cambia el tamano de pantalla
    actualizarDistanciaLejos() {

        this.distanciaLejos = this.radioOrbita * 1.15;

    }

    actualizar() {

        // Recalculado cada frame por si el canvas cambio de tamano; asi la
        // orbita nunca queda desalineada con el tamano real del canvas
        this.centro.set(width / 2, height / 2);
        this.radioOrbita = min(width, height) * 0.5;

        this.actualizarDistanciaLejos();

        // El ritmo se relaja solo, muy de a poco, si no se lo vuelve a tocar
        this.futuro.ritmoActual = lerp(this.futuro.ritmoActual, this.futuro.ritmoBase, 0.0006);

        if (millis() > this.futuro.proximoLatido) {

            this.futuro.latido = 1;

            this.futuro.proximoLatido = millis() + this.futuro.ritmoActual;

        }

        this.futuro.latido *= 0.88;

        for (let e of this.puntos) {

            // La base se recalcula siguiendo al centro y al radio de orbita
            // actuales, para que reaccione bien si la pantalla cambia
            let base = createVector(
                this.centro.x + cos(e.anguloBase) * this.radioOrbita,
                this.centro.y + sin(e.anguloBase) * this.radioOrbita
            );

            e.posBase = base;

            // Una deriva lenta y propia, para que nunca esten del todo
            // quietas, incluso relajadas
            let derivaX = (noise(e.semillaDeriva, millis() * 0.00012) - 0.5) * 26;
            let derivaY = (noise(e.semillaDeriva + 80, millis() * 0.00012) - 0.5) * 26;

            let posDeseada = createVector(
                e.posBase.x + derivaX,
                e.posBase.y + derivaY
            );

            e.pos.lerp(posDeseada, 0.02);

            let distanciaAlFuturo = dist(e.pos.x, e.pos.y, this.futuro.pos.x, this.futuro.pos.y);

            let nivel = map(
                distanciaAlFuturo,
                this.distanciaCerca,
                this.distanciaLejos,
                1,
                0
            );

            e.nivelAnsiedad = constrain(nivel, 0, 1);

        }

    }

    dibujar() {

        background(15);

        // Tratamiento lineal: cada punto se conecta con el futuro segun
        // cuanta ansiedad le genera tenerlo cerca
        for (let e of this.puntos) {

            let colorLinea = this.colorEstado(e.nivelAnsiedad);

            stroke(
                red(colorLinea),
                green(colorLinea),
                blue(colorLinea),
                20 + e.nivelAnsiedad * 110
            );

            strokeWeight(1 + e.nivelAnsiedad * 1.5);

            line(this.futuro.pos.x, this.futuro.pos.y, e.pos.x, e.pos.y);

        }

        // Resplandor alrededor del futuro
        noStroke();

        let capasResplandor = 4;

        for (let i = capasResplandor; i > 0; i--) {

            let radioCapa = this.futuro.r + i * 16 + this.futuro.latido * 10;

            let alphaCapa = 22 / i;

            fill(
                red(this.colorFuturo),
                green(this.colorFuturo),
                blue(this.colorFuturo),
                alphaCapa
            );

            circle(this.futuro.pos.x, this.futuro.pos.y, radioCapa * 2);

        }

        // El futuro
        noStroke();

        fill(this.colorFuturo);

        let radioFuturo = this.futuro.r + this.futuro.latido * 14;

        circle(this.futuro.pos.x, this.futuro.pos.y, radioFuturo * 2);

        // Los 4 puntos
        for (let e of this.puntos) {

            let colorActual = this.colorEstado(e.nivelAnsiedad);

            // Temblor: nulo cuando esta relajada, fuerte cuando esta
            // muy ansiosa (aca si tiene sentido conceptual: es ansiedad)
            let intensidadTemblor = e.nivelAnsiedad * 7;

            let temblorX = (noise(e.semillaTemblor, millis() * 0.02) - 0.5) * 2 * intensidadTemblor;
            let temblorY = (noise(e.semillaTemblor + 40, millis() * 0.02) - 0.5) * 2 * intensidadTemblor;

            let visualX = e.pos.x + temblorX;
            let visualY = e.pos.y + temblorY;

            let radioVisual = e.r + e.nivelAnsiedad * 5;

            // Halo, mas presente cuanto mas ansiosa esta
            fill(
                red(colorActual),
                green(colorActual),
                blue(colorActual),
                40 * e.nivelAnsiedad
            );

            circle(visualX, visualY, radioVisual * 2 + 18 * e.nivelAnsiedad);

            noStroke();

            fill(colorActual);

            circle(visualX, visualY, radioVisual * 2);

        }

    }

    // Interpola color segun el nivel de ansiedad: celeste, naranja, rojo
    colorEstado(nivel) {

        if (nivel < 0.5) {

            return lerpColor(this.colorCalma, this.colorMedio, nivel * 2);

        }

        return lerpColor(this.colorMedio, this.colorAlto, (nivel - 0.5) * 2);

    }

    mousePressed() {

        let sobreFuturo = dist(mouseX, mouseY, this.futuro.pos.x, this.futuro.pos.y) < this.futuro.r + 12;

        if (sobreFuturo) {

            this.futuro.arrastrando = true;

            this.futuro.offsetArrastre.set(
                this.futuro.pos.x - mouseX,
                this.futuro.pos.y - mouseY
            );

            // Cada vez que se lo toca, late mas rapido
            this.futuro.ritmoActual = max(
                this.futuro.ritmoMinimo,
                this.futuro.ritmoActual * 0.78
            );

        }

    }

    mouseDragged() {

        if (!this.futuro.arrastrando) return;

        let x = mouseX + this.futuro.offsetArrastre.x;
        let y = mouseY + this.futuro.offsetArrastre.y;

        x = constrain(x, this.margenPantalla + this.futuro.r, width - this.margenPantalla - this.futuro.r);
        y = constrain(y, this.margenPantalla + this.futuro.r, height - this.margenPantalla - this.futuro.r);

        this.futuro.pos.set(x, y);

    }

    mouseReleased() {

        this.futuro.arrastrando = false;

    }

}
