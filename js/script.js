import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { getDistanceBetween } from "./utils.js";

// Initializing Canvas
const MAX_FPS = 60;
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
const canvasBg = "hsla(222, 11%, 11%, 0.25)";
const canvasBgOpaque = "hsla(222, 11%, 11%, 1)";
const pointer = { position: { x: canvasSize / 2, y: canvasSize / 4 } };
let animationId;

const player = new Player({ canvasSize, canvasBgOpaque });

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
  player.bullets.fired.forEach((bullet) => {
    bullet.update({ context, deltaTime });
  });
  player.enemies.forEach((enemy) => {
    if (
      getDistanceBetween(player, enemy) <=
      player.radius + player.ringWidth + enemy.radius
    ) {
      cancelAnimationFrame(player.animationId);
    }
    enemy.update({ context, deltaTime });
  });

  // const frameRate = Math.floor(1000 / deltaTime);
  // context.font = "25px sans-serif";
  // context.fillText(frameRate, 25, 25);
}

context.fillStyle = canvasBgOpaque;
context.fillRect(0, 0, canvasSize, canvasSize);
animationId = window.requestAnimationFrame(animate);
player.animationId = animationId;

function setMousePosition(x, y) {
  pointer.position.x = (x - canvasRect.x) * window.devicePixelRatio;
  pointer.position.y = (y - canvasRect.y) * window.devicePixelRatio;
}

canvas.addEventListener("mousemove", (e) => {
  setMousePosition(e.x, e.y);
});

canvas.addEventListener("click", (e) => {
  player.bullets.loaded.push(1);
  setMousePosition(e.x, e.y);
});
