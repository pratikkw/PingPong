const SPEED = 0.02;

export default class Paddle {
  constructor(paddleEle) {
    this.paddleEle = paddleEle;
    this.reset();
  }

  get position() {
    return parseInt(
      getComputedStyle(this.paddleEle).getPropertyValue("--position")
    );
  }

  set position(value) {
    this.paddleEle.style.setProperty("--position", value);
  }

  rect() {
    return this.paddleEle.getBoundingClientRect();
  }

  reset() {
    this.position = 50;
  }

  updateComputer(delta, ballWidth, area) {
    const rect = this.rect();
    const direction = ballWidth - this.position;
    if (rect.left <= 10 && direction <= 0) {
      this.position += 0;
    } else if (rect.right >= area.offsetWidth - 10 && direction >= 0) {
      this.position += 0;
    } else {
      this.position += SPEED * delta * (ballWidth - this.position);
    }
  }

  updatePlayerPaddle(val, area) {
    const rect = this.rect();
    if (rect.left <= 10 && val <= 0) {
      this.position += 0;
    } else if (rect.right >= area.offsetWidth - 10 && val >= 0) {
      this.position += 0;
    } else {
      this.position += val;
    }
  }
}
