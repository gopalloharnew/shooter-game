import { Player } from "./Player.js";

// Initializing Canvas
const MAX_FPS = 60;
const canvas = document.querySelector("[data-game-canvas]");
const canvasSize = window.innerWidth * window.devicePixelRatio;
canvas.width = canvasSize;
canvas.height = canvasSize;
const context = canvas.getContext("2d");
const canvasBg = "hsl(222, 11%, 11%)";

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
  player.update({ context });
}

window.requestAnimationFrame(animate);
