var LuminousBalls = [];
var gap = 40;
var BallPositions = [20, 90, 230, 510];

function startGame() {
  myGameArea.start();
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
      this.canvas.width = 600;
      this.canvas.height = 600;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas,document.body.childNodes[0]);
      this.frameNo = -1;
      this.interval = setInterval(updateGameArea, 20);
    },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

function circle(radius, color, x, y) {
  this.radius = radius;
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }
}

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


function updateGameArea() {
  var x, y;
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 0 || everyinterval(15)) {
      x = BallPositions[Math.floor(Math.random()*(4))];
      y = -10;
      LuminousBalls.push(new circle(10, 'yellow', x, y));
  }
  for (i = 0; i < LuminousBalls.length; i ++) {
    LuminousBalls[i].y += 2;
    LuminousBalls[i].update();
  }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
