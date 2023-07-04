import { Player } from "./Player.js";
import { Particle } from "./Particle.js";
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
    // going beyond canvas
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

    // collision with enemy
    // Todo: separate this as a function
    player.enemies.forEach((enemy, enemyIndex) => {
      if (getDistanceBetween(enemy, bullet) <= enemy.radius + bullet.radius) {
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
        enemy.radius -= bullet.radius;
        if (enemy.radius <= enemy.minRadius) {
          setTimeout(() => {
            player.enemies.splice(enemyIndex, 1);
          }, 0);
        }
        setTimeout(() => {
          player.bullets.fired.splice(bulletIndex, 1);
        }, 0);
      }
    });

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

  player.debris.forEach((particle, particleIndex) => {
    if (particle.opacity <= 0) {
      setTimeout(() => {
        player.debris.splice(particleIndex, 1);
      }, 0);
    }
    particle.update({ context, deltaTime });
  });

  // const frameRate = Math.floor(1000 / deltaTime);
  // if (frameRate < 59) {
  //   context.fillStyle = "red";
  //   context.font = "25px sans-serif";
  //   context.fillText(frameRate, 25, 25);
  // }
}

context.fillStyle = canvasBgOpaque;
context.fillRect(0, 0, canvasSize, canvasSize);
animationId = window.requestAnimationFrame(animate);
player.animationId = animationId;

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
