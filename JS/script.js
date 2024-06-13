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
const volumeBox = document.querySelector(".volume");
const volumeBtn = document.querySelectorAll(".volume__btn");
const volume_mutedBtn = document.querySelectorAll(".volume-muted__btn");
const helpBtn = document.querySelector(".help__btn");
const closeBtn = document.querySelector(".close__btn");
const settingBtn = document.querySelector(".setting__btn");
const playBtn = document.querySelector(".play__btn");
const restartBtn = document.querySelector(".reset__btn");
const quiteBtn = document.querySelector(".quite__btn");

// COMPONENTs
const listFirst = document.querySelectorAll(".list__one");
const listSecond = document.querySelectorAll(".list__two");
const listThird = document.querySelectorAll(".list__three");
const playerScore = document.querySelector(".score__player");
const playerSecScore = document.querySelector(".score__playerSec");
const computerScore = document.querySelector(".score__computer");
const playerPoint = document.querySelector(".point__player");
const playerSecPoint = document.querySelector(".point__playerSec");
const computerPoint = document.querySelector(".point__computer");
const totalPoint = document.querySelectorAll(".point__total");
const p1controllerArea = document.querySelector(".controller__playerone");
const p1controllerLine = document.querySelector(".controller__line--playerone");
const p1controllerBar = document.querySelector(".controller__bar--playerone");
const p2controllerArea = document.querySelector(".controller__playersec");
const p2controllerLine = document.querySelector(".controller__line--playersec");
const p2controllerBar = document.querySelector(".controller__bar--playersec");
const customizePlayer = document.querySelector(".customize__vs");
const no_of_round = document.getElementById("roundNo");
const playagainst = document.getElementById("competetitor");
const result = document.querySelector(".game__result");
const resultTxt = document.querySelector(".game__result h2");

// Sounds
const gameStart = new Audio("../SoundEffects/gameStart.wav");
const ballShotFromCenter = new Audio(
  "../SoundEffects/ball-shot-from-center.wav"
);
const loss = new Audio("../SoundEffects/loss-over-cmp.wav");
const play = new Audio("../SoundEffects/play.wav");
const pause = new Audio("../SoundEffects/pause.wav");
const win = new Audio("../SoundEffects/win-over-cmp.wav");
const shortWin = new Audio("../SoundEffects/short-win.wav");
const paddleHit = new Audio("../SoundEffects/paddle-hit.wav");
const exit = new Audio("../SoundEffects/exit.wav");
const volume = new Audio("../SoundEffects/muted.wav");

// Global Variables
const tl = gsap.timeline({});
const ball = new Ball(document.querySelector(".ball"));
const secondBall = new Ball(document.querySelector(".showcase__ball"));
const playerPaddle = new Paddle(document.querySelector(".paddle__user"));
const secPlayerPaddle = new Paddle(
  document.querySelector(".paddle__playerSec")
);
const computerPaddle = new Paddle(document.querySelector(".paddle__computer"));
const isHover = window.matchMedia("(hover: hover)").matches;
const mediaQuery = window.matchMedia("(max-width: 700px)");

let id;
let idSec;
let lastTime;
let lastTimeTwo;
let SPEEDArray = [0.01, 0.0125, 0.015, 0.02];
let speed;
let roundNo;
let gameEnd = false;
let secondPlayer;
let animationStop = false;
let mute = true;

// --> Sound Effects
function soundEffect(soundType) {
  if (!mute) return;
  if (soundType == "startGame") {
    gameStart.play();
  } else if (soundType == "ballShot") {
    ballShotFromCenter.play();
  } else if (soundType == "pause") {
    pause.play();
  } else if (soundType == "play") {
    play.play();
  } else if (soundType == "win") {
    win.play();
  } else if (soundType == "loss") {
    loss.play();
  } else if (soundType == "paddlehit") {
    paddleHit.play();
  } else if (soundType == "goal") {
    shortWin.play();
  } else if (soundType == "exit") {
    exit.play();
  }
}
// -------------------------

// --> Mute & Unmute
function volumeEnable() {
  mute = false;
  volumeBtn.forEach((item) => {
    item.classList.add("volume--hide");
  });
  volume_mutedBtn.forEach((item) => {
    item.classList.remove("volume--hide");
  });
  volume.play();
}

function volumeDisable() {
  mute = true;
  volumeBtn.forEach((item) => {
    item.classList.remove("volume--hide");
  });
  volume_mutedBtn.forEach((item) => {
    item.classList.add("volume--hide");
  });
  volume.play();
}
// -------------------------

// --> Disable Zoom & Refresh effect in Touch Devices
main.addEventListener(
  "touchmove",
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);
// -------------------------

// --> Get random Ball Speed.
function randomSpeed() {
  const num = Math.floor(Math.random() * 4);
  speed = SPEEDArray[num];
}
// -------------------------

// --> Change Ball Velocity Array Accoring to viewport
function handleMediaQueryChange(event) {
  if (event.matches) {
    SPEEDArray = [0.0075, 0.008, 0.0081, 0.009];
  }
}
// -------------------------

// --> For Magnet Btn Effect & Select Play Against.
function isHoverFunction(h) {
  if (h) {
    magnetBtn.addEventListener("mousemove", moveBtn);
    magnetBtn.addEventListener("mouseleave", revertBtn);
  } else {
    customizePlayer.classList.remove("customize__vs--hide");
  }
}
// -------------------------

// --> Adjust Layout According to who is playing.
function whoIsPlaying() {
  if (secondPlayer == "true") {
    computerPaddle.paddleEle.style.display = "none";
    secPlayerPaddle.paddleEle.style.display = "block";
  } else if (secondPlayer == "false") {
    computerPaddle.paddleEle.style.display = "block";
    secPlayerPaddle.paddleEle.style.display = "none";
  }
}
// -------------------------

// --> Instruction, close & help Btn Section Open & Close
function instructions() {
  instructionSection.classList.toggle("help--hide");
  closeBtn.classList.toggle("close__btn--hide");
  helpBtn.classList.toggle("help__btn--hide");
}
// -------------------------

// --> Announce Result
function announceResult(txt) {
  result.classList.remove("game__result--hide");
  resultTxt.textContent = txt;
}
// -------------------------

// --> Open & Close Game Menu
function close_and_open_gameOption() {
  gameOptionSection.classList.toggle("setting--hide");
}
// -------------------------

// --> Game Over
function gameOver() {
  if (gameEnd) {
    window.cancelAnimationFrame(id);
    id = null;
    ball.ballEle.style.display = "none";
    computerPaddle.reset();
    playBtn.classList.add("play__btn--deactive");
  }
}
// -------------------------

// --> Counting Score
function scoreTable() {
  const rect = ball.rect();
  const gmBound = gameArea.getBoundingClientRect();

  if (secondPlayer == "true") {
    if (Math.floor(rect.top) <= Math.floor(gmBound.top)) {
      playerPoint.textContent =
        parseInt(playerPoint.textContent) < 9
          ? `0${parseInt(playerPoint.textContent) + 1}`
          : parseInt(playerPoint.textContent) + 1;
      soundEffect("goal");
    } else if (Math.floor(rect.bottom) >= Math.floor(gmBound.bottom)) {
      playerSecPoint.textContent =
        parseInt(playerSecPoint.textContent) < 9
          ? `0${parseInt(playerSecPoint.textContent) + 1}`
          : parseInt(playerSecPoint.textContent) + 1;
      soundEffect("goal");
    }
  } else if (secondPlayer == "false") {
    if (Math.floor(rect.top) <= Math.floor(gmBound.top)) {
      playerPoint.textContent =
        parseInt(playerPoint.textContent) < 9
          ? `0${parseInt(playerPoint.textContent) + 1}`
          : parseInt(playerPoint.textContent) + 1;
      soundEffect("goal");
    } else if (Math.floor(rect.bottom) >= Math.floor(gmBound.bottom)) {
      computerPoint.textContent =
        parseInt(computerPoint.textContent) < 9
          ? `0${parseInt(computerPoint.textContent) + 1}`
          : parseInt(computerPoint.textContent) + 1;
      soundEffect("goal");
    }
  }
  ball.reset();
  computerPaddle.reset();
  randomSpeed();
  checkScore();
}
// -------------------------

// --> Start Game
function startGame() {
  // Get Number of Rounds
  roundNo = no_of_round.options[no_of_round.selectedIndex];

  // Play Against
  secondPlayer = playagainst.options[playagainst.selectedIndex].value;
  whoIsPlaying();

  // Start Section Hide
  startSection.classList.add("start--opacity");
  setTimeout(() => {
    startSection.classList.add("start--hide");
  }, 320);

  // Volume, Help & Setting Btn
  volumeBox.classList.add("volume__box--hide");
  helpBtn.classList.add("help__btn--hide");
  settingBtn.classList.remove("setting__btn--opacity");

  // Score
  totalPoint.forEach((item) => {
    if (roundNo.value == -1) {
      item.textContent = "";
      document
        .querySelectorAll(".point__slash")
        .forEach((item) => (item.style.display = "none"));
    } else {
      document
        .querySelectorAll(".point__slash")
        .forEach((item) => (item.style.display = "block"));
      item.textContent = `${roundNo.value}`;
    }
  });
  if (secondPlayer == "true") {
    playerScore.classList.remove("score--opacity");
    playerSecScore.classList.remove("score--opacity");
  } else if (secondPlayer == "false") {
    computerScore.classList.remove("score--opacity");
    playerScore.classList.remove("score--opacity");
  }

  // Ball
  id = window.requestAnimationFrame(updateBall);
  secondBall.ballEle.style.display = "none";
  window.cancelAnimationFrame(idSec);

  // Computer Paddle Speed
  randomSpeed();

  // Touch Screen Layout
  if (isHover == false && secondPlayer == "false") {
    document.documentElement.style.setProperty("--game-layout", "85dvh 15dvh");
    document.documentElement.style.setProperty("--controller-view-p1", "block");
  } else if (isHover == false && secondPlayer == "true") {
    document.documentElement.style.setProperty(
      "--game-layout",
      "15dvh 70dvh 15dvh"
    );
    document.documentElement.style.setProperty("--controller-view-p1", "block");
    document.documentElement.style.setProperty("--controller-view-p2", "block");
  }

  // Sound
  soundEffect("startGame");
}
// -------------------------

// --> Update Ball
function updateBall(time) {
  if (lastTime) {
    const delta = time - lastTime;

    if (secondPlayer == "false") {
      computerPaddle.updateComputer(delta, ball.x, speed, gameArea);
      ball.update(
        delta,
        gameArea,
        [playerPaddle.rect(), computerPaddle.rect()],
        mute
      );
    } else if (secondPlayer == "true") {
      ball.update(delta, gameArea, [
        playerPaddle.rect(),
        secPlayerPaddle.rect(),
      ]);
    }

    if (isLose()) scoreTable();
  }
  lastTime = time;
  id = window.requestAnimationFrame(updateBall);
  checkScore();
}
// -------------------------

// --> Update Showcase Ball
function updateSecBall(time) {
  if (lastTimeTwo) {
    const delta = time - lastTimeTwo;
    secondBall.updateDemoBall(delta, gameArea);
  }
  lastTimeTwo = time;
  idSec = window.requestAnimationFrame(updateSecBall);
}
// -------------------------

// --> Restart Game
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
  p1controllerLine.style.setProperty("--left", 50);
  p1controllerBar.style.transform = "translate(-50%, -50%)";
  secPlayerPaddle.reset();
  secPlayerPaddle.paddleEle.style.transform = "translate(-50%, -50%)";
  p2controllerLine.style.setProperty("--left", 50);
  p2controllerBar.style.transform = "translate(-50%, -50%)";

  // Score
  playerPoint.textContent = "00";
  playerSecPoint.textContent = "00";
  computerPoint.textContent = "00";

  // Game Menu
  close_and_open_gameOption();

  // Return Ball
  if (!id) {
    lastTime = null;
    id = window.requestAnimationFrame(updateBall);
  }

  // Sound
  soundEffect("startGame");
}
// -------------------------

// --> Resume Game
function resumeBall() {
  close_and_open_gameOption();
  if (!id) {
    lastTime = null;
    id = window.requestAnimationFrame(updateBall);
  }
}
// -------------------------

// --> Pause Game
function pauseBall() {
  close_and_open_gameOption();
  soundEffect("pause");
  if (id) {
    window.cancelAnimationFrame(id);
    id = null;
  }
}
// -------------------------

// Quite Game
function quiteGame() {
  // Score
  playerPoint.textContent = "00";
  playerSecPoint.textContent = "00";
  computerPoint.textContent = "00";
  playerScore.classList.add("score--opacity");
  playerSecScore.classList.add("score--opacity");
  computerScore.classList.add("score--opacity");

  // BTNs
  volumeBox.classList.remove("volume__box--hide");
  helpBtn.classList.remove("help__btn--hide");
  playBtn.classList.remove("play__btn--deactive");
  settingBtn.classList.add("setting__btn--opacity");

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
  computerPaddle.reset();
  playerPaddle.reset();
  playerPaddle.paddleEle.style.transform = "translate(-50%, -50%)";
  p1controllerLine.style.setProperty("--left", 50);
  p1controllerBar.style.transform = "translate(-50%, -50%)";
  secPlayerPaddle.reset();
  secPlayerPaddle.paddleEle.style.transform = "translate(-50%, -50%)";
  p2controllerLine.style.setProperty("--left", 50);
  p2controllerBar.style.transform = "translate(-50%, -50%)";

  // SECTION
  close_and_open_gameOption();
  startSection.classList.remove("start--opacity");
  startSection.classList.remove("start--hide");

  // LAYOUT
  if (isHover == false) {
    document.documentElement.style.setProperty("--game-layout", "100dvh");
    document.documentElement.style.setProperty("--controller-view-p1", "none");
    document.documentElement.style.setProperty("--controller-view-p2", "none");
  }

  // Sound
  soundEffect("exit");
}
// -------------------------

// Check for goal
function isLose() {
  const rect = ball.rect();
  const gmBound = gameArea.getBoundingClientRect();
  return (
    Math.floor(rect.top) <= Math.floor(gmBound.top) ||
    Math.floor(rect.bottom) >= Math.floor(gmBound.bottom)
  );
}
// -------------------------

// --> Check if player reaches the predefined point
function checkScore() {
  const cmpScore = parseInt(computerPoint.textContent);
  const playerScore = parseInt(playerPoint.textContent);
  const secondPlayerScore = parseInt(playerSecPoint.textContent);

  if (roundNo.value == cmpScore && secondPlayer == "false") {
    gameEnd = true;
    announceResult("You Lose");
    gameOver();
    soundEffect("loss");
  } else if (roundNo.value == playerScore && secondPlayer == "false") {
    gameEnd = true;
    announceResult("You Win");
    gameOver();
    soundEffect("win");
  } else if (roundNo.value == playerScore && secondPlayer == "true") {
    gameEnd = true;
    announceResult("Player First Win");
    gameOver();
    soundEffect("win");
  } else if (roundNo.value == secondPlayerScore && secondPlayer == "true") {
    gameEnd = true;
    announceResult("Player Second Win");
    gameOver();
    soundEffect("win");
  }
}
// -------------------------

// --> Magnet Btn
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
// -------------------------

// --> Back to initial position Magnet Btn
function revertBtn(e) {
  gsap.to(magnetBtn, { duration: 1, x: 0, y: 0, ease: "Elastic.easeOut" });
  gsap.to(magnetBtnTxt, { duration: 1, x: 0, y: 0, ease: "Elastic.easeOut" });
}
// -------------------------

// --> Text Animation
function instructionsAnim() {
  if (animationStop) return;
  gsap.set([listFirst, listSecond, listThird], {
    x: 200,
    opacity: 0,
  });

  tl.to(listFirst, {
    x: 0,
    opacity: 1,
    stagger: 0.2,
    ease: "sine.out",
  });

  tl.to(listSecond, {
    x: 0,
    opacity: 1,
    stagger: 0.2,
    ease: "sine.out",
  });

  tl.to(listThird, {
    x: 0,
    opacity: 1,
    stagger: 0.2,
    ease: "sine.out",
  });
}
// -------------------------

// EventListeners
window.addEventListener("load", function () {
  isHoverFunction(isHover);
  idSec = window.requestAnimationFrame(updateSecBall);
});

magnetBtn.addEventListener("click", startGame);

volumeBtn.forEach((item) => {
  item.addEventListener("click", volumeEnable);
});

volume_mutedBtn.forEach((item) => {
  item.addEventListener("click", volumeDisable);
});

helpBtn.addEventListener("click", function () {
  instructions();
  instructionsAnim();
});

closeBtn.addEventListener("click", function () {
  instructions();
  animationStop = true;
});

settingBtn.addEventListener("click", pauseBall);

playBtn.addEventListener("click", resumeBall);

restartBtn.addEventListener("click", restartgame);

quiteBtn.addEventListener("click", quiteGame);

gameArea.addEventListener("mousemove", function (e) {
  let value = (e.clientX / gameArea.offsetWidth) * 100;
  playerPaddle.updatePlayerPaddle(value, gameArea);
});

p1controllerBar.addEventListener("touchstart", function (e) {
  e.preventDefault();
});

p1controllerBar.addEventListener("touchmove", function (e) {
  e.preventDefault();

  const t = e.targetTouches;
  if (t.length == 1) {
    const details = t[0];
    const distanceFromBorder = details.clientX;
    const gapBetweenBorder = p1controllerLine.getBoundingClientRect().left;
    const diff = distanceFromBorder - gapBetweenBorder;
    if (diff >= 0 && diff <= p1controllerLine.offsetWidth) {
      const adjustedX = Math.ceil((diff / p1controllerLine.offsetWidth) * 100);
      p1controllerLine.style.setProperty("--left", adjustedX);
      playerPaddle.updatePaddleForTouchDevice(
        adjustedX,
        p1controllerBar,
        gameArea
      );
    }
  }
});

p2controllerBar.addEventListener("touchstart", function (e) {
  e.preventDefault();
});

p2controllerArea.addEventListener("touchmove", function (e) {
  e.preventDefault();

  const t = e.targetTouches;
  if (t.length == 1) {
    const details = t[0];
    const distanceFromBorder = details.clientX;
    const gapBetweenBorder = p2controllerLine.getBoundingClientRect().left;
    const diff = distanceFromBorder - gapBetweenBorder;
    if (diff >= 0 && diff <= p2controllerLine.offsetWidth) {
      const adjustedX = Math.ceil((diff / p2controllerLine.offsetWidth) * 100);
      p2controllerLine.style.setProperty("--left", adjustedX);
      secPlayerPaddle.updatePaddleForTouchDevice(
        adjustedX,
        p2controllerBar,
        gameArea
      );
    }
  }
});

mediaQuery.addEventListener("change", handleMediaQueryChange);
handleMediaQueryChange(mediaQuery);
