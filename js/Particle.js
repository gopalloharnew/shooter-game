export class Particle {
  constructor({ position, mainColor, speed, bulletRadius }) {
    this.position = { ...position };
    this.mainColor = mainColor;
    this.opacity = 1;
    this.speed = speed * (0.5 + 0.5 * Math.random());
    this.directionAngle = 2 * Math.PI * Math.random();
    this.velocity = {
      x: this.speed * Math.cos(this.directionAngle),
      y: this.speed * Math.sin(this.directionAngle),
    };
    this.radius = (0.2 + 0.8 * Math.random()) * bulletRadius;
  }

  get opacity() {
    return this.opacityValue;
  }

  set opacity(opacityValue) {
    this.opacityValue = opacityValue;
    this.color = `${this.mainColor.slice(0, this.mainColor.length - 2)}${
      this.opacityValue
    })`;
  }

  draw({ context }) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    context.fill();
  }

  update({ context, deltaTime }) {
    this.opacity -= (1 * deltaTime) / 1000;
    this.position.x += (this.velocity.x * deltaTime) / 1000;
    this.position.y += (this.velocity.y * deltaTime) / 1000;
    this.draw({ context });
  }
}
