import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";
import { getRandomInteger } from "./utils.js";

export class Player {
  constructor({ canvasSize, canvasBgOpaque }) {
    this.canvasBgOpaque = canvasBgOpaque;
    this.canvasSize = canvasSize;
    this.radius = this.canvasSize / 20;
    this.ringWidth = this.canvasSize / 200;
    this.bulletRadius = this.ringWidth;
    this.bulletSpeed = this.bulletRadius * 60; // TODO: 25
    this.gapAngle = Math.PI / 8;
    this.color = "hsl(222, 100%, 95%)";
    this.currentDirectionAngle = (Math.PI * 3) / 2;
    this.position = { x: this.canvasSize / 2, y: this.canvasSize / 2 };
    this.muzzlePosition = {
      x: this.position.x + this.radius * Math.cos(this.currentDirectionAngle),
      y: this.position.y + this.radius * Math.sin(this.currentDirectionAngle),
    };
    this.bullets = {
      loaded: [],
      fired: [],
    };
    this.enemies = [];
    this.generateEnemy();
  }

  generateEnemy() {
    setTimeout(() => {
      this.enemies.push(
        new Enemy({ canvasSize: this.canvasSize, player: this })
      );
      this.generateEnemy();
    }, 2000 + getRandomInteger(0, 2000));
  }

  draw({ context }) {
    context.fillStyle = this.canvasBgOpaque;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius + this.ringWidth * 2,
      this.currentDirectionAngle + this.gapAngle,
      this.currentDirectionAngle - this.gapAngle,
      false
    );
    context.fill();

    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.lineWidth = this.ringWidth;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.currentDirectionAngle + this.gapAngle,
      this.currentDirectionAngle - this.gapAngle,
      false
    );
    context.stroke();

    context.lineCap = "round";
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      (this.radius * 6) / 10,
      0,
      Math.PI * 2,
      false
    );
    context.fill();

    context.lineWidth = this.bulletRadius * 2;
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.muzzlePosition.x, this.muzzlePosition.y);
    context.stroke();
  }

  update({ context, pointer }) {
    this.currentDirectionAngle =
      Math.PI +
      Math.atan2(
        this.position.y - pointer.position.y,
        this.position.x - pointer.position.x
      );
    this.muzzlePosition = {
      x: this.position.x + this.radius * Math.cos(this.currentDirectionAngle),
      y: this.position.y + this.radius * Math.sin(this.currentDirectionAngle),
    };

    this.checkBullets();
    this.draw({ context });
  }

  checkBullets() {
    if (this.bullets.loaded.length > 0) {
      if (this.bullets.fired.length > 0) {
        let lastBullet = this.bullets.fired[this.bullets.fired.length - 1];
        if (
          Math.hypot(
            this.position.y - lastBullet.position.y,
            this.position.x - lastBullet.position.x
          ) >
          this.radius + this.bulletRadius * 4
        ) {
          this.fire();
        }
      } else {
        this.fire();
      }
    }

    this.bullets.fired.forEach((bullet, i) => {
      if (
        bullet.position.x + bullet.radius < 0 ||
        bullet.position.x + bullet.radius > this.canvasSize ||
        bullet.position.y + bullet.radius < 0 ||
        bullet.position.y + bullet.radius > this.canvasSize
      ) {
        setTimeout(() => {
          this.bullets.fired.splice(i, 1);
        }, 0);
      }
    });
  }

  fire() {
    this.bullets.fired.push(
      new Bullet({
        position: { ...this.muzzlePosition },
        velocity: {
          x: this.bulletSpeed * Math.cos(this.currentDirectionAngle),
          y: this.bulletSpeed * Math.sin(this.currentDirectionAngle),
        },
        radius: this.bulletRadius,
        color: this.color,
      })
    );
    this.bullets.loaded.pop();
  }
}
