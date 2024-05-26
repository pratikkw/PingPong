import Ball from "./ball.js";
import Paddle from "./paddle.js";

const startSection = document.querySelector(".start");
const gameArea = document.querySelector(".area");
const magnetBtn = document.getElementById("magnet__btn");
const magnetTxt = document.getElementById("magnet__txt");

const ball = new Ball(document.querySelector(".ball"));
const playerPaddle = new Paddle(document.querySelector(".paddle__user"));
const computerPaddle = new Paddle(document.querySelector(".paddle__computer"));

let lastTime;

const updateBall = function (time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    computerPaddle.update(delta, ball.x);
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
  }

  lastTime = time;
  window.requestAnimationFrame(updateBall);
};

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
  window.requestAnimationFrame(updateBall);
});

window.addEventListener("resize", activeHoveFeatures);

magnetBtn.addEventListener("click", function () {
  startSection.classList.toggle("start--opacity");
  setInterval(() => {
    startSection.style.display = "none";
  }, 1000);
});

document.addEventListener("keydown", function (e) {
  if (e.key == "ArrowLeft") {
    playerPaddle.movePaddle(-2);
  } else if (e.key == "ArrowRight") {
    playerPaddle.movePaddle(2);
  }
});
