import { Player } from "./Player.js";

// Initializing Canvas
const MAX_FPS = 60;
const canvas = document.querySelector("[data-game-canvas]");
const canvasSize = window.innerWidth * window.devicePixelRatio;
canvas.width = canvasSize;
canvas.height = canvasSize;
const context = canvas.getContext("2d");
const canvasBg = "hsl(222, 11%, 11%)";
const pointer = { position: { x: canvasSize / 4, y: canvasSize / 4 } };

const player = new Player({ canvasSize });

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
}

window.requestAnimationFrame(animate);

function setMousePosition(x, y) {
  pointer.position.x = x;
  pointer.position.y = y;
}

document.addEventListener("mousemove", (e) => {
  setMousePosition(e.x, e.y);
});
document.addEventListener("click", (e) => {
  setMousePosition(e.x, e.y);
});
