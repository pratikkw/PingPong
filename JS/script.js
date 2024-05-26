const magnetBtn = document.getElementById("magnet__btn");
const magnetTxt = document.getElementById("magnet__txt");

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
});

window.addEventListener("resize", activeHoveFeatures);
