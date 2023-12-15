let objPantalla;
let texto=[];
let imgs=[];
let estado=0;
let imgsJuego=[];
let imgEscenario;
let imgLibro;
let LibroText;
let ImgPersonaje;
let ImgCorazon;
let textPerdiste;
let textWin;
let ImgInstrucciones;

function preload() {
  for (let i=0; i<17; i++) {
    imgs[i]= loadImage("Data/img"+i+".jpg")
  }
  texto = loadStrings("Data/texto.txt");
  imgEscenario= loadImage("Data/Juego/escenario.png");
  imgLibro= loadImage("Data/Juego/libro.png");
  LibroText= loadImage("Data/Juego/LibroText.png");
  ImgPersonaje = loadImage("Data/Juego/Personaje.png");
  ImgCorazon = loadImage("Data/Juego/Corazon.png");
  textPerdiste = loadImage("Data/Juego/textFire.png");
  textWin = loadImage("Data/Juego/textWin.png");
  ImgInstrucciones = loadImage("Data/Juego/Instrucciones.png");
}
function setup() {
  createCanvas(600, 600);
  objAventura = new Aventura();
}


function draw() {
  objAventura.dibujar();
}

function keyPressed(){
objAventura.Teclado();
}

function mousePressed() {
  objAventura.click();
}
