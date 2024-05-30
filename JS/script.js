import Ball from "./ball.js";
import Paddle from "./paddle.js";

const helpSection = document.querySelector(".help");
const startSection = document.querySelector(".start");
const gameArea = document.querySelector(".area");
const settingBtns = document.querySelector(".area__setting");
const resetBtn = document.querySelector(".reset__btn");
const pauseBtn = document.querySelector(".pause__btn");
const playBtn = document.querySelector(".play__btn");

const helpBtn = document.querySelector(".help__btn");
const closeBtn = document.querySelector(".close__btn");
const instructions = document.querySelectorAll(".lists");
const magnetBtn = document.getElementById("magnet__btn");
const magnetTxt = document.getElementById("magnet__txt");

const ball = new Ball(document.querySelector(".ball"));
const ballSec = new Ball(document.querySelector(".showcase__ball"));
const playerPaddle = new Paddle(document.querySelector(".paddle__user"));
const computerPaddle = new Paddle(document.querySelector(".paddle__computer"));
const playerScore = document.querySelector(".score__player");
const computerScore = document.querySelector(".score__computer");

let lastTime;
let lastTimeSecond;
let animationId;
let ballXPosition, ballYPosition;

// INITIAL SETUP
const tl = gsap.timeline();

gsap.set(instructions, {
  opacity: 0,
  x: 400,
});
// ------------------------------

const updateBall = function (time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    computerPaddle.update(delta, ball.x);
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);

    if (isLose()) handleLose();
  }

  lastTime = time;
  animationId = window.requestAnimationFrame(updateBall);
};

const showcaseBallUpdate = function (time) {
  if (lastTimeSecond != null) {
    const delta = time - lastTimeSecond;
    ballSec.updateSec(delta);
  }

  lastTimeSecond = time;
  window.requestAnimationFrame(showcaseBallUpdate);
};

function isLose() {
  const rect = ball.rect();
  return rect.top <= 0 || rect.bottom >= window.innerHeight;
}

function handleLose() {
  const rect = ball.rect();
  if (rect.bottom >= window.innerHeight) {
    computerScore.textContent =
      parseInt(computerScore.textContent) < 10
        ? `0${parseInt(computerScore.textContent) + 1}`
        : parseInt(computerScore.textContent) + 1;
  } else {
    playerScore.textContent =
      parseInt(playerScore.textContent) < 10
        ? `0${parseInt(playerScore.textContent) + 1}`
        : parseInt(playerScore.textContent) + 1;
  }
  ball.reset();
  computerPaddle.reset();
}

function scoreReset() {
  computerScore.textContent = "00";
  playerScore.textContent = "00";
}

const moveBtn = function (e) {
  const magnetBtnStretch = 80;
  const magnetTxtStretch = 100;
  const bond = magnetBtn.getBoundingClientRect();

  const differenceX = ((e.clientX - bond.left) / bond.width - 0.5).toFixed(2);
  const differenceY = ((e.clientY - bond.top) / bond.height - 0.5).toFixed(2);

  gsap.to(magnetBtn, {
    duration: 1,
    x: differenceX * magnetBtnStretch,
    y: differenceY * magnetBtnStretch,
    ease: "power4.out",
  });

  gsap.to(magnetTxt, {
    duration: 1,
    x: differenceX * magnetTxtStretch,
    y: differenceY * magnetTxtStretch,
    ease: "power4.out",
  });
};

const moveBack = function () {
  gsap.to(magnetBtn, {
    duration: 1,
    x: 0,
    y: 0,
    ease: "Elastic.easeOut",
  });

  gsap.to(magnetTxt, {
    duration: 1,
    x: 0,
    y: 0,
    ease: "Elastic.easeOut",
  });
};

const activeHoveFeatures = function () {
  const isHover = window.matchMedia("(hover:hover)").matches;
  if (isHover) {
    magnetBtn.addEventListener("mousemove", moveBtn);
    magnetBtn.addEventListener("mouseleave", moveBack);
  }
};

window.addEventListener("load", function () {
  activeHoveFeatures();
  window.requestAnimationFrame(showcaseBallUpdate);
});

window.addEventListener("resize", activeHoveFeatures);

magnetBtn.addEventListener("click", function () {
  helpBtn.classList.add("help--hide");
  startSection.classList.toggle("start--opacity");
  settingBtns.classList.toggle("area__setting--opacity");

  setInterval(() => {
    startSection.style.display = "none";
  }, 1000);

  window.requestAnimationFrame(updateBall);
  ballSec.ballElem.style.display = "none";
  playerScore.classList.remove("score--opacity");
  computerScore.classList.remove("score--opacity");
});

gameArea.addEventListener("mousemove", function (e) {
  const eleWidth = Math.ceil(playerPaddle.paddleElem.offsetWidth / 2);
  if (e.x <= eleWidth + 5) {
    return;
  } else if (e.x >= window.innerWidth - eleWidth - 5) {
    return;
  } else {
    playerPaddle.position = (e.x / window.innerWidth) * 100;
  }
});

helpBtn.addEventListener("click", function () {
  helpSection.classList.remove("help--hide");
  this.classList.add("help__btn--hide");
  closeBtn.classList.remove("close__btn--hide");

  instructions.forEach((item) =>
    tl.to(item, { opacity: 1, x: 0, duration: 0.75, ease: "power1.out" })
  );
});

closeBtn.addEventListener("click", function () {
  helpSection.classList.add("help--hide");
  this.classList.add("close__btn--hide");
  helpBtn.classList.remove("help__btn--hide");

  instructions.forEach((item) => {
    tl.to(item, { opacity: 0, x: 400, duration: 0, ease: "power1.out" });
  });
});

resetBtn.addEventListener("click", function () {
  pauseBtn.classList.remove("pause__btn--hide");
  playBtn.classList.add("play__btn--hide");
  ball.reset();
  computerPaddle.reset();
  scoreReset();

  if (animationId) {
    return;
  } else if (!animationId) {
    lastTime = null;
    animationId = window.requestAnimationFrame(updateBall);
  }
});

playBtn.addEventListener("click", function () {
  if (!animationId) {
    pauseBtn.classList.remove("pause__btn--hide");
    playBtn.classList.add("play__btn--hide");
    // lastTime = performance.now();
    lastTime = null;
    animationId = window.requestAnimationFrame(updateBall);
  }
});

pauseBtn.addEventListener("click", function () {
  if (animationId) {
    playBtn.classList.remove("play__btn--hide");
    pauseBtn.classList.add("pause__btn--hide");
    window.cancelAnimationFrame(animationId);
    animationId = null;
  }
});
