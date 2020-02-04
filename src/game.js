/*jshint esversion: 6 */


const cvs = document.getElementById('game-board');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score');

const ROW = 20;
const COL = 10; //column
const SQ = 30; //square size
const VACANT = 'white';
let score = 0;

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*SQ, y*SQ, SQ, SQ);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}
// drawSquare(1,1,'red');

// create board

let board = [];
for (let r = 0; r < ROW; r++) {
  board[r] = [];
  for (let c = 0; c < COL; c++) {
    board[r][c] = VACANT;
  }
}

function drawBoard() {

  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}


const PIECES = [
  [Z,'red'],
  [S,'green'],
  [T,'purple'],
  [O,'yellow'],
  [L,'orange'],
  [I,'cyan'],
  [J,'blue'],
];

function randomPiece() {
  let r = Math.floor(Math.random() * PIECES.length);
  return new Piece( PIECES[r][0],PIECES[r][1]);
}


function Piece(tetromino, color) {

  this.tetromino = tetromino;
  this.color = color;
  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];
  this.x = 3;
  this.y = -2;
}

Piece.prototype.fill = function(color) {
  for ( r = 0; r < this.activeTetromino.length; r++){
    for (c = 0; c < this.activeTetromino.length; c++){
      if ( this.activeTetromino[r][c]){
          drawSquare(this.x + c,this.y + r, color);
      }
    }
  }
};

Piece.prototype.draw = function() {
  this.fill(this.color);
};

Piece.prototype.undraw = function() {
  this.fill(VACANT);
};

Piece.prototype.moveDown = function() {
  if (!this.collision(0,1,this.activeTetromino)) {
    this.undraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    p = randomPiece();
  }
};

Piece.prototype.moveLeft = function() {
  if (!this.collision(-1,0,this.activeTetromino)) {
    this.undraw();
    this.x--;
    this.draw();
  }
};

Piece.prototype.moveRight = function() {
  if (!this.collision(1,0,this.activeTetromino)) {
    this.undraw();
    this.x++;
    this.draw();
  }
};

Piece.prototype.rotate = function() {
  let newPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
  let kick = 0;

  if (this.collision(0,0,newPattern)) {
    if (this.x > COL/2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }


  if (!this.collision(kick,0,newPattern)) {
    this.undraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

Piece.prototype.lock = function() {
  for( let r = 0; r < this.activeTetromino.length; r++){
    for(let c = 0; c < this.activeTetromino.length; c++){
      if( !this.activeTetromino[r][c]){
        continue;
      }
      if(this.y + r < 0){
        alert("Game Over");
        gameOver = true;
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }

  for (let r = 0; r < ROW; r++) {
    let isRowFull = true;
    for (var c = 0; c < COL; c++) {
      isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if (isRowFull) {
      for (let y = r; y > 1; y--) {
        for (let c = 0; c < COL; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      for ( let c = 0; c < COL; c++) {
        board[0][c] = VACANT;
      }
      score += COL;
    }
  }
  drawBoard();
  scoreElement.innerHTML = score;
};

Piece.prototype.collision = function(x, y, piece) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece.length; c++) {
      if (!piece[r][c]) {
          continue;
      }

      let newX = this.x + c + x;
      let newY = this.y + r + y;

      if (newX < 0 || newX >= COL || newY >= ROW) {
          return true;
      }

      if (newY < 0) {
          continue;
      }

      if (board[newY][newX] !== VACANT) {
        return true;
      }
    }
  }
  return false;
};





document.addEventListener('keydown', CONTROL);

function CONTROL(event) {

  if (event.keyCode === 37) {
    p.moveLeft();
    dropStart = Date.now();
  } else if (event.keyCode === 38) {
    p.rotate();
    dropStart = Date.now();
  } else if (event.keyCode === 39) {
    p.moveRight();
    dropStart = Date.now();
  } else if (event.keyCode === 40) {
    p.moveDown();
  }
}

let gameOver = false;
let dropStart = Date.now();
function drop() {

  let now = Date.now();
  let deltaTime = now - dropStart;

  if (deltaTime > 1000) {
    p.moveDown();
    dropStart = Date.now();
  }

  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}

let p = randomPiece();

drawBoard();
// console.table(p);
p.draw();
drop();
