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
    this.position += SPEED * delta * (ballWidth - this.position);
  }

  movePaddle(val) {
    if (this.rect().left <= 0 && val < 0) return;
    if (this.rect().right >= window.innerWidth && val > 0) return;
    this.position += val;
  }
}
