const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

function playMusic() {
  var myMusic = document.getElementById('music');
  myMusic.muted = true;
  myMusic.play();
  myMusic.muted = false;
  myMusic.play();
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    player.score += rowCount * 10;
    rowCount *= 2;
  }

  if (player.score > 100) {
    speedLevel = Math.floor(player.score / 100);
  }
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
]

const arena = createMatrix(12, 20);

const player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0,
}

context.scale(20, 20);

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  if (type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === 'Z') {
    return [
      [6, 6, 0],
      [0, 6, 6],
      [0, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 7, 7],
      [7, 7, 0],
      [0, 0, 0],
    ];
  }
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {
    x: 0,
    y: 0
  });
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x,
          y + offset.y,
          1, 1);
        context.shadowColor = '#ffffff';
        context.shadowBlur = 1;
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

let isDropMax = false;
let isFirstTime = true;

let currentMatrix;
let nextMatrix;

let speedLevel = 1;

function playerDrop() {
  player.pos.y += speedLevel;

  if (collide(arena, player)) {
    player.pos.y -= speedLevel;
    for (let i = 1; i <= speedLevel; i++) {
      player.pos.y += i;
      if (collide(arena, player)) {
        break;
      }
      player.pos.y -= i;
    }

    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerDropMax(isDropMax) {
  if (isDropMax) {
    while (isDropMax) {
      player.pos.y++;
      if (collide(arena, player)) {

        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();

        isDropMax = false;
      }
    }
  }
}

function playerMove(offset) {
  player.pos.x += offset;
  if (collide(arena, player)) {
    player.pos.x -= offset;
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';

  if (isFirstTime) {
    currentMatrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    isFirstTime = false;
  } else {
    currentMatrix = nextMatrix;
  }

  var nextType = pieces[pieces.length * Math.random() | 0]
  showNextMatrix(nextType);
  nextMatrix = createPiece(nextType);

  player.matrix = currentMatrix;
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) -
    (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    speedLevel = 1;
    updateScore();
  }
}

function showNextMatrix(type) {
  var linkImg;

  switch (type) {
    case "Z":
      linkImg = "https://i.ibb.co/yR7Djrx/" + type + ".png";
      break;
    case "T":
      linkImg = "https://i.ibb.co/19TCYK1/" + type + ".png";
      break;
    case "S":
      linkImg = "https://i.ibb.co/2YpTd7g/" + type + ".png";
      break;
    case "O":
      linkImg = "https://i.ibb.co/s9hHrBW/" + type + ".png";
      break;
    case "L":
      linkImg = "https://i.ibb.co/P90RjYh/" + type + ".png";
      break;
    case "I":
      linkImg = "https://i.ibb.co/C6kJLMz/" + type + ".png";
      break;
    case "J":
      linkImg = "https://i.ibb.co/z5nWF9S/" + type + ".png";
      break;
  }
  document.getElementById("nextMatrix").src = linkImg;
}

function playerRotate(dir) {
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  lastTime = time;

  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  // move left
  if (event.keyCode === 37) {
    playerMove(-1);
  }
  // move right
  else if (event.keyCode === 39) {
    playerMove(1);
  }
  // move down
  else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 32) {
    isDropMax = true;
    playerDropMax(isDropMax);
  }
  // rotate left
  else if (event.keyCode === 81) {
    playerRotate(-1);
  }
  // rotate right
  else if (event.keyCode === 87 || event.keyCode === 38) {
    playerRotate(1);
  }
});

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

playerReset();
updateScore();
update();