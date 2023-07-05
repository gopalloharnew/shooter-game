export class GameDialog {
  constructor(dialogElement) {
    this.dialogElement = dialogElement;
    this.textElement = this.dialogElement.querySelector(
      "[data-game-dialog-text]"
    );
    this.scoreElement = this.dialogElement.querySelector(
      "[data-game-dialog-score]"
    );
    this.resumeButton = this.dialogElement.querySelector(
      "[data-game-resume-button]"
    );
    this.startButton = this.dialogElement.querySelector(
      "[data-game-start-button]"
    );
    this.restartButton = this.dialogElement.querySelector(
      "[data-game-restart-button]"
    );
    this.buttons = [this.startButton, this.resumeButton, this.restartButton];
  }

  show({ text, buttons }) {
    this.dialogElement.classList.add("show");
    this.textElement.textContent = text;
    this.scoreElement.textContent = `Score: ${window.score}`;
    this.buttons.forEach((button) => {
      button.classList.remove("visible-button");
    });
    buttons.forEach((button) => {
      this[button].classList.add("visible-button");
    });
  }

  hide() {
    this.dialogElement.classList.remove("show");
  }
}
