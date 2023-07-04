import { getRandomInteger, getRandomTrueFalse } from "./utils.js";

export class Enemy {
  constructor({ canvasSize, player }) {
    this.targetPosition = {
      x: player.position.x + Math.floor(player.radius * Math.random()),
      y: player.position.y + Math.floor(player.radius * Math.random()),
    };
    this.canvasSize = canvasSize;
    this.minRadius = Math.floor(this.canvasSize / 60);
    this.radius = Math.floor(this.minRadius * (1 + Math.random() * 2));
    this.visibleRadius = this.radius;
    this.position = this.getRandomEnemyPosition();
    this.speed = player.bulletSpeed / 3;
    this.directionAngle = Math.atan2(
      this.targetPosition.y - this.position.y,
      this.targetPosition.x - this.position.x
    );
    this.velocity = {
      x: this.speed * Math.cos(this.directionAngle),
      y: this.speed * Math.sin(this.directionAngle),
    };
    this.color = `hsl(${getRandomInteger(0, 360)}, 100%, 50%)`;
  }

  getRandomEnemyPosition() {
    let slidingAxisPosition = getRandomInteger(0, this.canvasSize);
    let fixedAxisPosition = getRandomTrueFalse()
      ? this.radius * -1
      : this.canvasSize + this.radius;
    let position = {};
    if (getRandomTrueFalse()) {
      position.x = slidingAxisPosition;
      position.y = fixedAxisPosition;
    } else {
      position.y = slidingAxisPosition;
      position.x = fixedAxisPosition;
    }
    return { ...position };
  }

  draw({ context }) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(
      this.position.x,
      this.position.y,
      this.visibleRadius,
      0,
      Math.PI * 2,
      false
    );
    context.fill();
  }

  update({ context, deltaTime }) {
    this.position.x += (this.velocity.x * deltaTime) / 1000;
    this.position.y += (this.velocity.y * deltaTime) / 1000;
    if (this.visibleRadius > this.radius) {
      this.visibleRadius -= (this.minRadius * 3 * deltaTime) / 1000;
    }
    this.draw({ context });
  }
}
