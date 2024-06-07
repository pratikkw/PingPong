import Ball from "./ball.js";
import Paddle from "./paddle.js";

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
const playBtn = document.querySelector(".play__btn");
const pauseBtn = document.querySelector(".pause__btn");
const restartBtn = document.querySelector(".reset__icon");

// COMPONENTs
const listFirst = document.querySelectorAll(".list__one");
const listSecond = document.querySelectorAll(".list__two");
const playerScore = document.querySelector(".score__player");
const computerScore = document.querySelector(".score__computer");
const playerPoint = document.querySelector(".point__player");
const computerPoint = document.querySelector(".point__computer");
const controllerBox = document.querySelector(".controller__player");
const controllerLine = document.querySelector(".controller__line");
const controllerBar = document.querySelector(".controller__bar");

// Global Variables
const ball = new Ball(document.querySelector(".ball"));
const secondBall = new Ball(document.querySelector(".showcase__ball"));
const playerPaddle = new Paddle(document.querySelector(".paddle__user"));
const computerPaddle = new Paddle(document.querySelector(".paddle__computer"));
const isHover = window.matchMedia("(hover: hover)").matches;
let id;
let idSec;
let lastTime;
let lastTimeTwo;
let controllerAccess = false;

window.addEventListener("load", function () {
  isHoverFunction(isHover);
  idSec = window.requestAnimationFrame(updateSecBall);
});

function isHoverFunction(h) {
  if (h) {
    magnetBtn.addEventListener("mousemove", moveBtn);
    magnetBtn.addEventListener("mouseleave", revertBtn);
  }
}

function isLose() {
  const rect = ball.rect();
  return rect.top <= 0 || rect.bottom >= gameArea.offsetHeight;
}

function scoreTable() {
  const rect = ball.rect();
  if (rect.top <= 0) {
    playerPoint.textContent =
      parseInt(playerPoint.textContent) < 9
        ? `0${parseInt(playerPoint.textContent) + 1}`
        : parseInt(playerPoint.textContent) + 1;
  } else if (rect.bottom >= gameArea.offsetHeight) {
    computerPoint.textContent =
      parseInt(computerPoint.textContent) < 9
        ? `0${parseInt(computerPoint.textContent) + 1}`
        : parseInt(computerPoint.textContent) + 1;
  }
  ball.reset();
  computerPaddle.reset();
}

function updateBall(time) {
  if (lastTime) {
    const delta = time - lastTime;
    ball.update(delta, gameArea, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.updateComputer(delta, ball.x, gameArea);

    if (isLose()) scoreTable();
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

function play_And_pause() {
  pauseBtn.classList.toggle("pause__btn--hide");
  playBtn.classList.toggle("play__btn--hide");
}

function pauseBall() {
  if (id) {
    play_And_pause();
    window.cancelAnimationFrame(id);
    id = null;
  }
}

function resumeBall() {
  if (!id) {
    play_And_pause();
    lastTime = null;
    id = window.requestAnimationFrame(updateBall);
  }
}

function restartgame() {
  ball.reset();
  computerPaddle.reset();
  if (!id) {
    lastTime = null;
    id = window.requestAnimationFrame(updateBall);
    play_And_pause();
  }
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

function revertBtn(e) {
  gsap.to(magnetBtn, { duration: 1, x: 0, y: 0, ease: "Elastic.easeOut" });
  gsap.to(magnetBtnTxt, { duration: 1, x: 0, y: 0, ease: "Elastic.easeOut" });
}

function startGame() {
  startSection.classList.add("start--opacity");
  setTimeout(() => {
    startSection.style.display = "none";
  }, 320);

  controllerAccess = true;
  helpBtn.classList.add("help__btn--hide");
  settingBox.classList.remove("area__setting--opacity");
  playerScore.classList.remove("score--opacity");
  computerScore.classList.remove("score--opacity");
  id = window.requestAnimationFrame(updateBall);
  secondBall.ballEle.style.display = "none";
  window.cancelAnimationFrame(idSec);

  if (isHover == false) {
    document.documentElement.style.setProperty("--game-layout", "85dvh 15dvh");
    document.documentElement.style.setProperty("--controller-view", "block");
    ball.ballEle.style.transform = `translate(-50%, -200%)`;
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

pauseBtn.addEventListener("click", pauseBall);

playBtn.addEventListener("click", resumeBall);

restartBtn.addEventListener("click", restartgame);

document.addEventListener("keydown", function (e) {
  let value = 0;
  if (!controllerAccess) return;
  if (e.key == "ArrowLeft") {
    value -= 2;
  } else if (e.key == "ArrowRight") {
    value += 2;
  }
  playerPaddle.updatePlayerPaddle(value, gameArea);
});

controllerLine.addEventListener("touchstart", function (e) {
  e.preventDefault();
});

controllerLine.addEventListener("touchmove", function (e) {
  e.preventDefault();

  const t = e.targetTouches;
  if (t.length == 1) {
    const details = t[0];
    const distanceFromBorder = details.clientX;
    const gapBetweenBorder = details.target.getBoundingClientRect().left;
    const diff = distanceFromBorder - gapBetweenBorder;
    if (diff >= 0 && diff <= controllerLine.offsetWidth) {
      const adjustedX = Math.ceil((diff / controllerLine.offsetWidth) * 100);
      controllerLine.style.setProperty("--left", adjustedX);
      playerPaddle.updatePaddleForTouchDevice(
        adjustedX,
        controllerBar,
        gameArea
      );
    }
  }
});
