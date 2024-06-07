const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.0000025;

export default class Ball {
  constructor(ballEle) {
    this.ballEle = ballEle;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballEle).getPropertyValue("--x"));
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballEle).getPropertyValue("--y"));
  }

  set x(value) {
    this.ballEle.style.setProperty("--x", value);
  }

  set y(value) {
    this.ballEle.style.setProperty("--y", value);
  }

  rect() {
    return this.ballEle.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { y: 0 };

    while (
      Math.abs(this.direction.y) <= 0.2 ||
      Math.abs(this.direction.y) >= 0.9
    ) {
      const heading = randomNumberBetween(0, Math.PI * 2);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, area, arr) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();

    if (rect.left <= 0 || rect.right >= area.offsetWidth) {
      this.direction.x *= -1;
    }

    if (arr.some((r) => isCollision(rect, r))) {
      this.direction.y *= -1;
    }
  }

  updateDemoBall(delta, area) {
    this.x += this.direction.x * delta * this.velocity;
    this.y += this.direction.y * delta * this.velocity;
    const rect = this.rect();

    if (rect.left <= 0 || rect.right >= area.offsetWidth) {
      this.direction.x *= -1;
    }

    if (rect.top <= 0 || rect.bottom >= area.offsetHeight) {
      this.direction.y *= -1;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(ball, paddle) {
  return (
    paddle.left <= ball.right &&
    paddle.right >= ball.left &&
    paddle.top <= ball.bottom &&
    paddle.bottom >= ball.top
  );
}
