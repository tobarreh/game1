//Creando el elemento canvas con jQuery//
var canvas_width = 800,
    canvas_height = 600,
    canvasElement = $("<canvas width='" + canvas_width +
                      "' height='" + canvas_height + "'></canvas>"),
    ctx = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

//Inicializando el Game y sus propiedades//
/*var Game = {};
Game.fps = 60;
Game.draw = function() { ... draw entities here ... };
Game.update = function() { ... run game logic here ... };
Game.run = function() {
  Game.update();
  Game.draw();
};
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);

while (!Game.stopped) {
  Game.update();
  Game.draw();
}
clearInterval(Game._intervalId);*/

//Dibujando el escenario//
var gap = 100,
    numbPaths = 5,
    Linecolor = 'white',
    Thickness = 2,
    numblines = numbPaths + 1,
    centered = numblines % 2 != 0,
    coef = null;

//Para centrar las lineas en la pantalla//
if(centered) {
  coef = Math.floor(numblines/2);
} else {
  coef = numbPaths/2;
};

var LPositions = [],
    BPositions = [];

//Dibujamos las lineas del escenario//
function Background() {
  ctx.save();
  ctx.strokeStyle = Linecolor;
  ctx.lineWidth = Thickness;
  for (i = 0; i < numblines; i++) {
    LPositions.push(canvas_width/2 + (i-coef)*gap);
    ctx.moveTo(LPositions[i],0);
    ctx.lineTo(LPositions[i],canvas_height);
    ctx.stroke();
  };
  ctx.restore();
};

//Posicion de las pelotas segun las lineas//
for (i = 0; i < numbPaths; i++) {
  BPositions.push(LPositions[i]+gap/2);
};

//Colocamos las pelotas en su lugar fuera de la pantalla//
for (i = 0; i < 40; i++) {
  LuminousBalls.push(new Ball(BPositions[Math.floor(Math.random()*(numbPaths - 1))],
                              -i*30,
                              10,
                              Colors[Math.floor(Math.random()*(5))],
                              10)
                    );
}

//Seteamos el ritmo del juego//
var fps = 60;
function Timing() {
  setInterval(function() {
    GameLoop();
    requestAnimationFrame(Timing);
  }, 1000 /*/ fps*/);
};
requestAnimationFrame(Timing);

//Ciclo principal del Juego//
function GameLoop() {
  update();
  draw();
};

//Actualiza el estado de juego//
function update() {
  //Actualiza la posicion de las pelotas//
  LuminousBalls.forEach(function() {
    Ball.update();
  });

  //Deja las pelotas que se muestran en el arreglo//
  LuminousBalls = LuminousBalls.filter(function() {
    return Ball.active;
  });
};

//Dibuja el escenario y sus elementos//
function draw() {
  //Limpia pantalla para no dejar rastro//
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  //Dibuja el escenario//
  Background();
  //Dibuja las pelotas del arreglo//
  LuminousBalls.forEach(function() {
    Ball.draw();
  });
};

var LuminousBalls = [],
    Colors = ['red', 'blue', 'yellow', 'green', 'pink'];

var Ball = function(x, y, radius, color, speed) {
  this.active = true;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.speed = speed;
  //Devuelve true si sigue en la pantalla//
  this.show = function() {
    return (this.x + this.radius) >= 0 && (this.x - this.radius) <= canvas_width &&
      (this.y + this.radius) >=0 && (this.y - this.radius) <= canvas_height;
  };
  //Dibuja el circulo//
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
  };
  //Actualiza el estado del circulo//
  this.update = function() {
    this.y += this.speed;

    this.active = this.active && this.show();
  };
};

//Polyfill necessary to use the command requestAnimationFrame()//
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
