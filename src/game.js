/*jshint esversion: 6 */


const cvs = document.getElementById('game-board');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score');
const start = document.getElementById('start');

let row = 20;
let col = 10; //column
const SQ = 30; //square size
const VACANT = 'white';
let score;
let gameOver;
let dropStart;
let p;
let board = [];

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*SQ, y*SQ, SQ, SQ);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}
// drawSquare(1,1,'red');

// create board

function drawBoard() {

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}


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
    if (this.x > col/2) {
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

  for (let r = 0; r < row; r++) {
    let isRowFull = true;
    for (var c = 0; c < col; c++) {
      isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if (isRowFull) {
      for (let y = r; y > 1; y--) {
        for (let c = 0; c < col; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      for ( let c = 0; c < col; c++) {
        board[0][c] = VACANT;
      }
      score += col;
    }
  }
  drawBoard();
  scoreElement.innerHTML = 'Score: ' + score;
};

Piece.prototype.collision = function(x, y, piece) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece.length; c++) {
      if (!piece[r][c]) {
          continue;
      }

      let newX = this.x + c + x;
      let newY = this.y + r + y;

      if (newX < 0 || newX >= col || newY >= row) {
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

document.addEventListener('keydown', CONTROL);

function CONTROL(event) {

  if (event.keyCode === 37) {
    event.preventDefault();
    p.moveLeft();
    dropStart = Date.now();
  } else if (event.keyCode === 38) {
    event.preventDefault();
    p.rotate();
    dropStart = Date.now();
  } else if (event.keyCode === 39) {
    event.preventDefault();
    p.moveRight();
    dropStart = Date.now();
  } else if (event.keyCode === 40) {
    event.preventDefault();
    p.moveDown();
  }
}

start.addEventListener('click', newGame);

function newGame() {
  row = 20;
  col = 10;
  score = 0;
  gameOver = false;
  dropStart = Date.now();
  p = randomPiece();

  board = [];
  for (let r = 0; r < row; r++) {
    board[r] = [];
    for (let c = 0; c < col; c++) {
      board[r][c] = VACANT;
    }
  }
    gameOver = false;
  drawBoard();
  p.draw();
  drop();
}
