import { Player } from "./Player.js";
import { Particle } from "./Particle.js";
import { getDistanceBetween } from "./utils.js";
import { ScoreIncrement } from "./ScoreIncrement.js";

// Initializing Canvas
const MAX_FPS = 60;
const LOCAL_SCORE_KEY = "shooterHighScore";

const canvas = document.querySelector("[data-game-canvas]");
const canvasRect = canvas.getBoundingClientRect();
let canvasSize;
if (window.innerWidth > window.innerHeight) {
  canvasSize = window.innerHeight * window.devicePixelRatio;
} else {
  canvasSize = window.innerWidth * window.devicePixelRatio;
}
canvas.width = canvasSize;
canvas.height = canvasSize;
const context = canvas.getContext("2d");
const canvasBg = "hsla(222, 11%, 11%, 1)";
const canvasBgOpaque = "hsla(222, 11%, 11%, 1)";
const pointer = { position: { x: canvasSize / 2, y: canvasSize / 4 } };
let animationId, player;

let highScore = localStorage.getItem(LOCAL_SCORE_KEY) || 0;

// animate
let lastPaintTime;
function animate(currentTime) {
  animationId = window.requestAnimationFrame(animate);
  player.animationId = animationId;
  if (lastPaintTime === undefined) lastPaintTime = currentTime;
  let deltaTime = currentTime - lastPaintTime;
  if (deltaTime < 1000 / MAX_FPS) return;
  lastPaintTime = currentTime;

  context.fillStyle = canvasBg;
  context.fillRect(0, 0, canvasSize, canvasSize);

  player.update({ context, pointer });

  player.bullets.fired.forEach((bullet, bulletIndex) => {
    bulletCollisionDetection({ bullet, bulletIndex });
    bullet.update({ context, deltaTime });
  });

  player.enemies.forEach((enemy) => {
    checkGameOver({ enemy });
    enemy.update({ context, deltaTime });
  });

  updateElementsAndRemoveTransparent({
    arrays: [player.debris, player.scoreIncrements],
    context,
    deltaTime,
  });
}

function bulletCollisionDetection({ bullet, bulletIndex }) {
  bulletBeyondCanvasDetection({ bullet, bulletIndex });

  player.enemies.forEach((enemy, enemyIndex) => {
    if (getDistanceBetween(enemy, bullet) <= enemy.radius + bullet.radius) {
      enemy.radius -= bullet.radius;
      let enemyDie = enemy.radius <= enemy.minRadius;
      addParticles({ enemy, bullet });
      updateScore({ enemyDie, bullet });
      if (enemyDie) {
        setTimeout(() => {
          player.enemies.splice(enemyIndex, 1);
        }, 0);
      }
      setTimeout(() => {
        player.bullets.fired.splice(bulletIndex, 1);
      }, 0);
    }
  });
}

function updateScore({ enemyDie, bullet }) {
  player.scoreIncrements.push(
    new ScoreIncrement({
      increment: enemyDie ? 20 : 10,
      bullet,
    })
  );
}

function addParticles({ enemy, bullet }) {
  for (let i = 0; i < Math.floor(enemy.radius); i++) {
    player.debris.push(
      new Particle({
        position: bullet.position,
        mainColor: enemy.color,
        speed: player.bulletSpeed,
        bulletRadius: bullet.radius,
      })
    );
  }
}

function bulletBeyondCanvasDetection({ bullet, bulletIndex }) {
  if (
    bullet.position.x + bullet.radius < 0 ||
    bullet.position.x + bullet.radius > player.canvasSize ||
    bullet.position.y + bullet.radius < 0 ||
    bullet.position.y + bullet.radius > player.canvasSize
  ) {
    setTimeout(() => {
      player.bullets.fired.splice(bulletIndex, 1);
    }, 0);
  }
}

function checkGameOver({ enemy }) {
  if (
    getDistanceBetween(player, enemy) <=
    player.radius + player.ringWidth + enemy.radius
  ) {
    cancelAnimationFrame(player.animationId);
  }
}

function updateElementsAndRemoveTransparent({ arrays, context, deltaTime }) {
  arrays.forEach((array) => {
    array.forEach((element, elementIndex) => {
      element.update({ context, deltaTime });
      if (element.opacity <= 0) {
        setTimeout(() => {
          array.splice(elementIndex, 1);
        }, 0);
      }
    });
  });
}

function startGame() {
  player = new Player({ canvasSize, canvasBgOpaque });
  context.fillStyle = canvasBgOpaque;
  context.fillRect(0, 0, canvasSize, canvasSize);
  animationId = window.requestAnimationFrame(animate);
  player.animationId = animationId;
  window.score = 0;
  document.querySelector("[data-score-span]").textContent = window.score;
}

startGame();

// mouse
function setPointerPosition(x, y) {
  pointer.position.x = (x - canvasRect.x) * window.devicePixelRatio;
  pointer.position.y = (y - canvasRect.y) * window.devicePixelRatio;
}

canvas.addEventListener("mousemove", (e) => {
  setPointerPosition(e.x, e.y);
});

canvas.addEventListener("click", (e) => {
  player.bullets.loaded.push(1);
  setPointerPosition(e.x, e.y);
});

// Todo: add Keyboard controls
// Todo: Play pause functionality
