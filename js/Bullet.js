export class Bullet {
  constructor({ position, velocity, radius, color }) {
    this.position = { ...position };
    this.velocity = { ...velocity };
    this.radius = radius;
    this.color = color;
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
    this.position.x += (this.velocity.x * deltaTime) / 1000;
    this.position.y += (this.velocity.y * deltaTime) / 1000;
    this.draw({ context });
  }
}
