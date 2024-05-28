import Ball from "./ball.js";
import Paddle from "./paddle.js";

const startSection = document.querySelector(".start");
const gameArea = document.querySelector(".area");
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

const updateBall = function (time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    computerPaddle.update(delta, ball.x);
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);

    if (isLose()) handleLose();
  }

  lastTime = time;
  window.requestAnimationFrame(updateBall);
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
  startSection.classList.toggle("start--opacity");
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
