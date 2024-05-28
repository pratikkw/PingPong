const SPEED = 0.02;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value);
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.position = 50;
  }

  update(delta, ballWidth) {
    const direction = ballWidth - this.position;

    if (this.rect().right >= window.innerWidth - 5 && direction > 0) {
      this.position += 0;
    } else if (this.rect().left <= 5 && direction < 0) {
      this.position += 0;
    } else {
      this.position += SPEED * delta * (ballWidth - this.position);
    }
  }
}
