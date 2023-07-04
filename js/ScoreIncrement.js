export class ScoreIncrement {
  constructor({ increment, bullet }) {
    this.position = { ...bullet.position };
    this.fontSize = bullet.radius * 5;
    this.velocity = { x: 0, y: this.fontSize * -8 };
    this.mainColor = bullet.color;
    this.opacity = 1;
    this.increment = increment;
    window.score += this.increment;
    document.querySelector("[data-score-span]").textContent = window.score;
  }

  get opacity() {
    return this.opacityValue;
  }

  set opacity(opacityValue) {
    this.opacityValue = opacityValue;
    this.color = `${this.mainColor.slice(
      0,
      this.mainColor.length - 2
    )}${opacityValue})`;
  }

  draw({ context }) {
    context.fillStyle = this.color;
    context.font = `${this.fontSize}px Arial`;
    context.fillText(this.increment, this.position.x, this.position.y);
  }

  update({ context, deltaTime }) {
    this.opacity -= (1 * deltaTime) / 1000;
    this.position.x += (this.velocity.x * deltaTime) / 1000;
    this.position.y += (this.velocity.y * deltaTime) / 1000;
    this.draw({ context });
  }
}
