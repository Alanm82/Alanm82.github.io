class Incertidumbre {

    constructor() {
        this.centro = createVector(width / 2, height / 2);

        this.posOscura = createVector(width / 2, height / 2);
        this.posOscuraPrev = createVector(width / 2, height / 2);

        this.radioOscuro = 55;

        // Umbrales de reaccion
        this.radioEmpujePanico = 160;   // espacio personal minimo: si invaden esto, alerta alta si o si
        this.radioZonaInsegura = 260;   // zona donde la retirada empieza a suavizarse con la distancia

        this.colorOscuro = color(10, 10, 15);

        // Velocidad de la esfera oscura, suavizada para no reaccionar a jitter de 1 frame
        this.velSuavizada = 0;

        this.personas = [];

        let cantidad = 65;

        for (let i = 0; i < cantidad; i++) {
            let angulo = random(TWO_PI);
            let distInicial = random(220, 380);

            let posX = this.centro.x + cos(angulo) * distInicial;
            let posY = this.centro.y + sin(angulo) * distInicial;

            this.personas.push({
                pos: createVector(posX, posY),
                vel: createVector(0, 0),
                acc: createVector(0, 0),

                masa: random(0.8, 1.5),
                friccion: 0.9,

                r: random(4, 8),

                // Nivel de cautela/anticipacion (0 = curiosidad tranquila, 1 = alerta maxima)
                alerta: 0,

                // Confianza acumulada: crece mientras la esfera se mantiene quieta,
                // hace que el acercamiento sea cada vez mas activo (curiosidad creciente)
                confianza: 0,

                distanciaConfianza: random(200, 320),
                lentitudAcercamiento: random(0.02, 0.05),

                faseRespira: random(TWO_PI),
                semillaTemblor: random(1000),
                semillaVacilacion: random(1000)
            });
        }
    }

    aplicarFuerza(p, fuerza) {
        let f = fuerza.copy();
        f.div(p.masa);
        p.acc.add(f);
    }

    actualizar() {
        this.posOscuraPrev.set(this.posOscura);

        // La bola oscura sigue al mouse con inercia
        this.posOscura.x = lerp(this.posOscura.x, mouseX, 0.12);
        this.posOscura.y = lerp(this.posOscura.y, mouseY, 0.12);

        let velInstante = p5.Vector.dist(this.posOscura, this.posOscuraPrev);
        // Suavizado: evita que un solo frame ruidoso dispare la reaccion de todos
        this.velSuavizada = lerp(this.velSuavizada, velInstante, 0.15);

        let margenPantalla = 70;
        let umbralMovimiento = 0.35; // a partir de aca la esfera se considera "en movimiento"

        for (let i = 0; i < this.personas.length; i++) {
            let p = this.personas[i];

            let dirHaciaOscura = p5.Vector.sub(this.posOscura, p.pos);
            let distAOscura = dirHaciaOscura.mag();

            // --- Nivel de alerta objetivo ---
            // Sube por: movimiento de la esfera (aunque este lejos) o invasion del espacio personal
            let objetivoAlerta = 0;

            if (this.velSuavizada > umbralMovimiento) {
                objetivoAlerta = map(this.velSuavizada, umbralMovimiento, 4, 0.25, 1, true);
            }

            if (distAOscura < this.radioEmpujePanico) {
                objetivoAlerta = max(objetivoAlerta, map(distAOscura, 0, this.radioEmpujePanico, 1, 0.4, true));
            }

            // Sube rapido (reaccionan a tiempo), baja lento (la calma vuelve de a poco -> anticipacion)
            if (objetivoAlerta > p.alerta) {
                p.alerta = lerp(p.alerta, objetivoAlerta, 0.15);
            } else {
                p.alerta = lerp(p.alerta, objetivoAlerta, 0.012);
            }

            // Confianza: sube despacio mientras la esfera esta quieta (alerta baja),
            // cae rapido apenas hay alerta -> la curiosidad se gana de a poco pero se pierde al toque
            if (p.alerta < 0.08) {
                p.confianza = min(1, p.confianza + 0.006);
            } else {
                p.confianza = max(0, p.confianza - 0.03);
            }

            if (p.alerta > 0.04) {
                // --- Retirada cautelosa: se alejan despacio, no huyen disparadas ---
                let fuerzaRetirada = dirHaciaOscura.copy().mult(-1);
                fuerzaRetirada.normalize();

                let intensidadRetirada = map(distAOscura, 0, this.radioZonaInsegura, 0.35, 0.04, true);
                fuerzaRetirada.mult(intensidadRetirada * p.alerta);

                this.aplicarFuerza(p, fuerzaRetirada);

                // Vacilacion lateral tambien en alerta, para que no sea una fuga en linea recta
                let lateral = createVector(-dirHaciaOscura.y, dirHaciaOscura.x);
                lateral.normalize();

                let ondaVacilacion =
                    (noise(p.semillaVacilacion, millis() * 0.0004) - 0.5) * 0.10 * p.alerta;

                lateral.mult(ondaVacilacion);
                this.aplicarFuerza(p, lateral);

            } else {
                // --- Sin alerta: curiosidad, se acercan a ver que pasa ---
                // Cuanto mas tiempo lleva quieta la esfera, mas activo y rapido es el acercamiento
                if (distAOscura > p.distanciaConfianza) {
                    let pasoCauto = dirHaciaOscura.copy().normalize();
                    let impulsoCuriosidad = map(p.confianza, 0, 1, 1, 3.5);
                    pasoCauto.mult(p.lentitudAcercamiento * impulsoCuriosidad);
                    this.aplicarFuerza(p, pasoCauto);
                }

                let lateral = createVector(-dirHaciaOscura.y, dirHaciaOscura.x);
                lateral.normalize();

                let ondaVacilacion =
                    (noise(p.semillaVacilacion, millis() * 0.0004) - 0.5) * 0.16;

                lateral.mult(ondaVacilacion);
                this.aplicarFuerza(p, lateral);
            }

            // --- Contencion en los bordes de la pantalla ---
            if (p.pos.x < margenPantalla) {
                let fBorde = createVector((margenPantalla - p.pos.x) * 0.05, 0);
                this.aplicarFuerza(p, fBorde);
            } else if (p.pos.x > width - margenPantalla) {
                let fBorde = createVector((width - margenPantalla - p.pos.x) * 0.05, 0);
                this.aplicarFuerza(p, fBorde);
            }

            if (p.pos.y < margenPantalla) {
                let fBorde = createVector(0, (margenPantalla - p.pos.y) * 0.05);
                this.aplicarFuerza(p, fBorde);
            } else if (p.pos.y > height - margenPantalla) {
                let fBorde = createVector(0, (height - margenPantalla - p.pos.y) * 0.05);
                this.aplicarFuerza(p, fBorde);
            }

            // --- Evitar apilamiento entre ellas ---
            for (let j = 0; j < this.personas.length; j++) {
                if (i === j) continue;
                let otro = this.personas[j];

                let dirRep = p5.Vector.sub(p.pos, otro.pos);
                let distRep = dirRep.mag();
                let distMin = p.r + otro.r + 12;

                if (distRep < distMin && distRep > 0) {
                    dirRep.normalize();
                    let fuerzaSeparacion = (distMin - distRep) * 0.05;
                    dirRep.mult(fuerzaSeparacion);
                    this.aplicarFuerza(p, dirRep);
                }
            }

            // Integracion fisica
            p.vel.add(p.acc);

            // Velocidad maxima moderada y continua (nada de "salir disparado"):
            // un poco mas vivo cuando hay alerta, y bastante mas activo cuando ya ganaron confianza
            let velBase = map(p.alerta, 0, 1, 1.6, 3.2);
            let impulsoConfianza = map(p.confianza, 0, 1, 0, 2.2);
            p.vel.limit(velBase + impulsoConfianza);

            p.vel.mult(p.friccion);
            p.pos.add(p.vel);
            p.acc.mult(0);
        }
    }

    dibujar() {
        background(15);

        // Resplandor negativo
        noStroke();
        let capas = 5;
        for (let i = capas; i > 0; i--) {
            let radioCapa = this.radioOscuro + i * 22;
            let alphaCapa = 90 / (i * i);
            fill(2, 2, 5, alphaCapa);
            circle(this.posOscura.x, this.posOscura.y, radioCapa * 2);
        }

        // Borde tenue y helado
        stroke(140, 150, 170, 30);
        strokeWeight(1.5);
        fill(this.colorOscuro);
        circle(this.posOscura.x, this.posOscura.y, this.radioOscuro * 2);

        // Bolitas
        for (let p of this.personas) {
            // Sin temblor: la incertidumbre se transmite por la velocidad de acercamiento/retirada,
            // no por un sacudon nervioso. Solo queda una respiracion sutil que da vida.
            let respiro = sin(millis() * 0.002 + p.faseRespira) * 1.2;

            let drawX = p.pos.x;
            let drawY = p.pos.y + respiro;

            let colorBolita = lerpColor(
                color(100, 110, 125),
                color(230, 240, 255),
                p.alerta
            );

            noStroke();
            fill(
                red(colorBolita),
                green(colorBolita),
                blue(colorBolita)
            );

            circle(drawX, drawY, p.r * 2);

            if (p.alerta > 0.25) {
                fill(
                    red(colorBolita),
                    green(colorBolita),
                    blue(colorBolita),
                    45 * p.alerta
                );

                circle(drawX, drawY, p.r * 2 + 12 * p.alerta);
            }
        }
    }

    mousePressed() {
        let mousePos = createVector(mouseX, mouseY);

        for (let p of this.personas) {
            let dir = p5.Vector.sub(p.pos, mousePos);
            let d = dir.mag();

            if (d < 350) {
                p.alerta = 1.0;
                dir.normalize();

                // Sobresalto puntual, mas contenido que antes
                let impacto = map(d, 0, 350, 4, 0.8);

                dir.mult(impacto);
                this.aplicarFuerza(p, dir);
            }
        }
    }
}
