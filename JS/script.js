import Ball from "./ball.js";
import Paddle from "./paddle.js";

// LAYOUT
const main = document.querySelector(".main");
const gameArea = document.querySelector(".area");
const startSection = document.querySelector(".start");
const instructionSection = document.querySelector(".help");
const gameOptionSection = document.querySelector(".setting");

// BTNs
const magnetBtn = document.getElementById("magnet__btn");
const magnetBtnTxt = document.getElementById("magnet__txt");
const helpBtn = document.querySelector(".help__btn");
const closeBtn = document.querySelector(".close__btn");
const settingBtn = document.querySelector(".setting__btn");
const playBtn = document.querySelector(".play__btn");
const restartBtn = document.querySelector(".reset__btn");
const quiteBtn = document.querySelector(".quite__btn");

// COMPONENTs
const listFirst = document.querySelectorAll(".list__one");
const listSecond = document.querySelectorAll(".list__two");
const playerScore = document.querySelector(".score__player");
const computerScore = document.querySelector(".score__computer");
const playerPoint = document.querySelector(".point__player");
const computerPoint = document.querySelector(".point__computer");
const totalPoint = document.querySelectorAll(".point__total");
const controllerBox = document.querySelector(".controller__player");
const controllerLine = document.querySelector(".controller__line");
const controllerBar = document.querySelector(".controller__bar");
const customizePlayer = document.querySelector(".customize__vs");
const no_of_round = document.getElementById("roundNo");
const playagainst = document.getElementById("competetitor");
const result = document.querySelector(".game__result");
const resultTxt = document.querySelector(".game__result h2");

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
const SPEEDArray = [0.01, 0.0125, 0.015, 0.02];
let speed;
let roundNo;
let gameEnd = false;

window.addEventListener("load", function () {
  isHoverFunction(isHover);
  idSec = window.requestAnimationFrame(updateSecBall);
});

function randomSpeed() {
  const num = Math.floor(Math.random() * 4);
  speed = SPEEDArray[num];
}

main.addEventListener(
  "touchmove",
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

function isHoverFunction(h) {
  if (h) {
    magnetBtn.addEventListener("mousemove", moveBtn);
    magnetBtn.addEventListener("mouseleave", revertBtn);
  } else {
    customizePlayer.classList.remove("customize__vs--hide");
  }
}

function isLose() {
  const rect = ball.rect();
  return rect.top <= 0 || rect.bottom >= gameArea.offsetHeight;
}

function gameOver() {
  if (gameEnd) {
    computerPaddle.reset();
    ball.ballEle.style.display = "none";
    playBtn.classList.add("play__btn--deactive");
  }
}

function announceResult(txt) {
  result.classList.remove("game__result--hide");
  resultTxt.textContent = txt;
}

function checkScore() {
  const cmpScore = parseInt(computerPoint.textContent);
  const playerScore = parseInt(playerPoint.textContent);

  if (roundNo.value == cmpScore) {
    announceResult("You Lose");
    window.cancelAnimationFrame(id);
    id = null;
    gameEnd = true;
    gameOver();
  } else if (roundNo.value == playerScore) {
    announceResult("You Win");
    window.cancelAnimationFrame(id);
    id = null;
    gameEnd = true;
    gameOver();
  }
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
  randomSpeed();
  checkScore();
}

function updateBall(time) {
  if (lastTime) {
    const delta = time - lastTime;
    ball.update(delta, gameArea, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.updateComputer(delta, ball.x, speed, gameArea);

    if (isLose()) scoreTable();
  }
  lastTime = time;
  id = window.requestAnimationFrame(updateBall);
  checkScore();
}

function updateSecBall(time) {
  if (lastTimeTwo) {
    const delta = time - lastTimeTwo;
    secondBall.updateDemoBall(delta, gameArea);
  }
  lastTimeTwo = time;
  idSec = window.requestAnimationFrame(updateSecBall);
}

function close_and_open_gameOption() {
  gameOptionSection.classList.toggle("setting--hide");
}

function pauseBall() {
  close_and_open_gameOption();
  if (id) {
    window.cancelAnimationFrame(id);
    id = null;
  }
}

function resumeBall() {
  close_and_open_gameOption();
  if (!id) {
    lastTime = null;
    id = window.requestAnimationFrame(updateBall);
  }
}

function restartgame() {
  // BALL
  ball.reset();
  ball.ballEle.style.display = "block";

  // Result
  result.classList.add("game__result--hide");

  // Play Btn
  playBtn.classList.remove("play__btn--deactive");

  // Ball Velocity
  randomSpeed();

  // Paddle
  computerPaddle.reset();
  playerPaddle.reset();
  playerPaddle.paddleEle.style.transform = "translate(-50%, -50%)";
  controllerLine.style.setProperty("--left", 50);
  controllerBar.style.transform = "translate(-50%, -50%)";

  // Score
  playerPoint.textContent = "00";
  computerPoint.textContent = "00";

  // Game Menu
  close_and_open_gameOption();

  // Rerun Ball
  if (!id) {
    lastTime = null;
    id = window.requestAnimationFrame(updateBall);
  }
}

function quiteGame() {
  // Score
  playerPoint.textContent = "00";
  computerPoint.textContent = "00";
  playerScore.classList.add("score--opacity");
  computerScore.classList.add("score--opacity");

  // BTNs
  settingBtn.classList.add("setting__btn--opacity");
  helpBtn.classList.remove("help__btn--hide");
  playBtn.classList.remove("play__btn--deactive");

  // RESULT
  result.classList.add("game__result--hide");

  // BALLs
  ball.reset();
  ball.ballEle.style.display = "block";
  window.cancelAnimationFrame(id);
  id = null;
  lastTime = null;
  secondBall.rect();
  secondBall.ballEle.style.display = "block";
  lastTimeTwo = null;
  idSec = window.requestAnimationFrame(updateSecBall);

  // PADDLE
  controllerAccess = false;
  computerPaddle.reset();
  playerPaddle.reset();
  playerPaddle.paddleEle.style.transform = "translate(-50%, -50%)";
  controllerLine.style.setProperty("--left", 50);
  controllerBar.style.transform = "translate(-50%, -50%)";

  // SECTION
  close_and_open_gameOption();
  startSection.classList.remove("start--opacity");
  startSection.classList.remove("start--hide");

  // LAYOUT
  if (isHover == false) {
    document.documentElement.style.setProperty("--game-layout", "100dvh");
    document.documentElement.style.setProperty("--controller-view", "none");
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
  // No of Round
  roundNo = no_of_round.options[no_of_round.selectedIndex];

  // Start Section
  startSection.classList.add("start--opacity");
  setTimeout(() => {
    startSection.classList.add("start--hide");
  }, 320);

  // Help & Setting Btn
  helpBtn.classList.add("help__btn--hide");
  settingBtn.classList.remove("setting__btn--opacity");

  // Score
  totalPoint.forEach((item) => (item.textContent = `${roundNo.value}`));
  playerScore.classList.remove("score--opacity");
  computerScore.classList.remove("score--opacity");

  // Ball
  id = window.requestAnimationFrame(updateBall);
  secondBall.ballEle.style.display = "none";
  window.cancelAnimationFrame(idSec);

  // Player Controller Access
  controllerAccess = true;

  // Computer Paddle Speed
  randomSpeed();

  // Touch Screen Layout
  if (isHover == false) {
    document.documentElement.style.setProperty("--game-layout", "85dvh 15dvh");
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

settingBtn.addEventListener("click", pauseBall);

playBtn.addEventListener("click", resumeBall);

restartBtn.addEventListener("click", restartgame);

quiteBtn.addEventListener("click", quiteGame);

gameArea.addEventListener("mousemove", function (e) {
  let value = (e.clientX / gameArea.offsetWidth) * 100;
  playerPaddle.updatePlayerPaddle(value, gameArea);
});

controllerBar.addEventListener("touchstart", function (e) {
  e.preventDefault();
});

controllerBar.addEventListener("touchmove", function (e) {
  e.preventDefault();

  const t = e.targetTouches;
  if (t.length == 1) {
    const details = t[0];
    const distanceFromBorder = details.clientX;
    const gapBetweenBorder = controllerLine.getBoundingClientRect().left;
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
