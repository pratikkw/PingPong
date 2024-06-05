import Ball from "./ball.js";
// import Paddle from "./paddle.js";

// LAYOUT
const main = document.querySelector(".main");
const gameArea = document.querySelector(".area");
const startSection = document.querySelector(".start");
const instructionSection = document.querySelector(".help");

// BTNs
const magnetBtn = document.getElementById("magnet__btn");
const magnetBtnTxt = document.getElementById("magnet__txt");
const helpBtn = document.querySelector(".help__btn");
const closeBtn = document.querySelector(".close__btn");
const settingBox = document.querySelector(".area__setting");

// COMPONENTS
const listFirst = document.querySelectorAll(".list__one");
const listSecond = document.querySelectorAll(".list__two");
const computerScore = document.querySelector(".score__computer");
const playerScore = document.querySelector(".score__player");

// Global Variables
const ball = new Ball(document.querySelector(".ball"));
const secondBall = new Ball(document.querySelector(".showcase__ball"));
const isHover = window.matchMedia("(hover: hover)").matches;
let id;
let idSec;
let lastTime;
let lastTimeTwo;

console.log(ball);

window.addEventListener("load", function () {
  isHoverFunction(isHover);
  idSec = window.requestAnimationFrame(updateSecBall);
});

function isHoverFunction(h) {
  if (h) {
    magnetBtn.addEventListener("mousemove", moveBtn);
    magnetBtn.addEventListener("mouseleave", resetBtn);
  }
}

function updateBall(time) {
  if (lastTime) {
    const delta = time - lastTime;
    ball.update(delta, gameArea);
  }
  lastTime = time;
  id = window.requestAnimationFrame(updateBall);
}

function updateSecBall(time) {
  if (lastTimeTwo) {
    const delta = time - lastTimeTwo;
    secondBall.updateDemoBall(delta, gameArea);
  }
  lastTimeTwo = time;
  idSec = window.requestAnimationFrame(updateSecBall);
}

function moveBtn(e) {
  const btnValue = 45;
  const txtValue = 90;

  const bound = magnetBtn.getBoundingClientRect();
  const x = e.clientX - bound.left;
  const y = e.clientY - bound.top;
  const directionX = x / magnetBtn.offsetWidth - 0.5;
  const directionY = y / magnetBtn.offsetHeight - 0.5;

  gsap.to(magnetBtn, {
    x: directionX * btnValue,
    y: directionY * btnValue,
    duration: 1,
    ease: "power4.out",
  });

  gsap.to(magnetBtnTxt, {
    x: directionX * txtValue,
    y: directionY * txtValue,
    duration: 1,
    ease: "power4.out",
  });
}

function resetBtn(e) {
  gsap.to(magnetBtn, { duration: 1, x: 0, y: 0, ease: "Elastic.easeOut" });
  gsap.to(magnetBtnTxt, { duration: 1, x: 0, y: 0, ease: "Elastic.easeOut" });
}

function startGame() {
  startSection.classList.add("start--opacity");
  setTimeout(() => {
    startSection.style.display = "none";
  }, 320);

  helpBtn.classList.add("help__btn--hide");
  settingBox.classList.remove("area__setting--opacity");
  playerScore.classList.remove("score--opacity");
  computerScore.classList.remove("score--opacity");
  id = window.requestAnimationFrame(updateBall);
  secondBall.ballEle.style.display = "none";
  window.cancelAnimationFrame(idSec);

  if (isHover == false) {
    document.documentElement.style.setProperty("--game-layout", "88dvh 12dvh");
    document.documentElement.style.setProperty("--controller-view", "block");
  }
}

function instructions() {
  instructionSection.classList.toggle("help--hide");
  closeBtn.classList.toggle("close__btn--hide");
  helpBtn.classList.toggle("help__btn--hide");
}

function instructionsAnim() {
  const tl = gsap.timeline({});

  gsap.set([listFirst, listSecond], {
    x: 200,
    opacity: 0,
  });

  tl.to(listFirst, {
    x: 0,
    opacity: 1,
    stagger: 0.3,
    ease: "sine.out",
  });

  tl.to(listSecond, {
    x: 0,
    opacity: 1,
    stagger: 0.3,
    ease: "sine.out",
  });
}

function resetInstructionsAnim() {
  gsap.set([listFirst, listSecond], {
    x: 200,
    opacity: 0,
    duration: 0,
  });
}

// EventListeners
magnetBtn.addEventListener("click", startGame);
helpBtn.addEventListener("click", function () {
  instructions();
  instructionsAnim();
});

closeBtn.addEventListener("click", function () {
  instructions();
  resetInstructionsAnim();
});
