export class Player {
  constructor({ canvasSize }) {
    this.canvasSize = canvasSize;
    this.radius = this.canvasSize / 15;
    this.ringWidth = this.canvasSize / 200;
    this.gapAngle = Math.PI / 8;
    this.color = "hsl(222, 100%, 95%)";
    this.currentDirectionAngle = (Math.PI * 3) / 3;
    this.position = { x: this.canvasSize / 2, y: this.canvasSize / 2 };
    this.muzzlePosition = {
      x: this.position.x + this.radius * Math.cos(this.currentDirectionAngle),
      y: this.position.y + this.radius * Math.sin(this.currentDirectionAngle),
    };
  }

  draw({ context }) {
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

    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      (this.radius * 5) / 8,
      0,
      Math.PI * 2,
      false
    );
    context.fill();

    context.lineWidth = this.ringWidth * 2;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.muzzlePosition.x, this.muzzlePosition.y);
    context.stroke();
  }

  update({ context }) {
    this.draw({ context });
  }
}
