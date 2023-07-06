import { Player } from "./Player.js";
import { Particle } from "./Particle.js";
import { getDistanceBetween } from "./utils.js";
import { ScoreIncrement } from "./ScoreIncrement.js";
import { GameDialog } from "./GameDialog.js";

// Initializing Canvas
const MAX_FPS = 60;
const LOCAL_SCORE_KEY = "shooterHighScore";

const canvas = document.querySelector("[data-game-canvas]");
let canvasRect = canvas.getBoundingClientRect();
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

const playStateButton = document.querySelector("[data-play-button-state]");
window.score = 0;
window.highScore = localStorage.getItem(LOCAL_SCORE_KEY) || 0;
renderHighScore();
window.gameOver = true;

// animate
let lastPaintTime;
let isResuming = false;
function animate(currentTime) {
  animationId = window.requestAnimationFrame(animate);
  player.animationId = animationId;
  if (lastPaintTime === undefined || isResuming) {
    lastPaintTime = currentTime;
    isResuming = false;
  }
  let deltaTime = currentTime - lastPaintTime;
  if (deltaTime < 1000 / MAX_FPS) return;
  lastPaintTime = currentTime;

  context.fillStyle = canvasBg;
  context.fillRect(0, 0, canvasSize, canvasSize);
  updateAndRender({ deltaTime });
}

function updateAndRender({ deltaTime }) {
  player.update({ context, deltaTime, pointer });

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
    gameOver();
  }
}

function gameOver() {
  cancelAnimationFrame(player.animationId);
  window.gameOver = true;
  gameDialog.show({ text: "Game Over!", buttons: ["restartButton"] });
  playStateButton.dataset.playButtonState = "hidden";
  if (window.score > window.highScore) {
    window.highScore = window.score;
    localStorage.setItem(LOCAL_SCORE_KEY, window.highScore);
    renderHighScore(true);
  } else {
    renderHighScore(false);
  }
}

function renderHighScore(isNew) {
  document.querySelector("[data-high-score-span]").textContent = `${
    isNew ? "New " : ""
  }High Score: ${window.highScore}`;
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
  canvasRect = canvas.getBoundingClientRect();
  document.querySelector(
    "[data-score-span]"
  ).textContent = `Score: ${window.score}`;
  gameDialog.hide();
  lastPaintTime = undefined;
  playStateButton.dataset.playButtonState = "pause";
  renderHighScore(false);
}

function pauseGame() {
  playStateButton.dataset.playButtonState = "resume";
  window.cancelAnimationFrame(animationId);
  isResuming = true;
  gameDialog.show({ text: "Paused", buttons: ["resumeButton"] });
}

function resumeGame() {
  playStateButton.dataset.playButtonState = "pause";
  animationId = window.requestAnimationFrame(animate);
  player.animationId = animationId;
  gameDialog.hide();
}

// mouse
function setPointerPosition(x, y) {
  pointer.position.x = (x - canvasRect.x) * window.devicePixelRatio;
  pointer.position.y = (y - canvasRect.y) * window.devicePixelRatio;
}

canvas.addEventListener("mousemove", (e) => {
  setPointerPosition(e.x, e.y);
});

canvas.addEventListener("click", (e) => {
  player?.bullets.loaded.push(1);
  setPointerPosition(e.x, e.y);
});

// Todo: add Keyboard controls
playStateButton.addEventListener("click", () => {
  const playButtonState = playStateButton.dataset.playButtonState;
  if (playButtonState === "pause") {
    pauseGame();
  } else {
    resumeGame();
  }
});

const gameDialog = new GameDialog(document.querySelector("[data-game-dialog]"));
gameDialog.startButton.addEventListener("click", startGame);
gameDialog.restartButton.addEventListener("click", startGame);
gameDialog.resumeButton.addEventListener("click", resumeGame);
gameDialog.show({ text: "Start Game!", buttons: ["startButton"] });
window.addEventListener("blur", () => {
  if (!window.gameOver) {
    pauseGame();
  }
});
