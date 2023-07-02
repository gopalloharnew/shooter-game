import { Player } from "./Player.js";

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
const canvasBg = "hsla(222, 11%, 11%, 0.2)";
const canvasBgOpaque = "hsla(222, 11%, 11%, 1)";
const pointer = { position: { x: canvasSize / 2, y: canvasSize / 4 } };

const player = new Player({ canvasSize, canvasBgOpaque });

let lastPaintTime;
function animate(currentTime) {
  window.requestAnimationFrame(animate);
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
}

context.fillStyle = canvasBgOpaque;
context.fillRect(0, 0, canvasSize, canvasSize);
window.requestAnimationFrame(animate);

function setMousePosition(x, y) {
  pointer.position.x = x - canvasRect.x;
  pointer.position.y = y - canvasRect.y;
}

canvas.addEventListener("mousemove", (e) => {
  setMousePosition(e.x, e.y);
});

canvas.addEventListener("click", (e) => {
  player.bullets.loaded.push(1);
  setMousePosition(e.x, e.y);
});
