import AncientsData from "./data/ancients.js";
import { BrownCards, BlueCards, GreenCards } from "./data/mythicCards/index.js";

const ancients = document.querySelectorAll(".ancient-img");
const levels = document.querySelector(".levels");
const diffs = document.querySelectorAll(".level-btn");
const shuffleBtn = document.querySelector(".shuffle-btn");
const stagesContainer = document.querySelector(".stages-container");
const firstCounter = document.querySelectorAll(".first");
const secondCounter = document.querySelectorAll(".second");
const thirdCounter = document.querySelectorAll(".third");
const cardBack = document.querySelector(".card-back");
const cardFront = document.querySelector(".card-front");

let currentAncient;
let currentDiff = "";
let greenNum;
let blueNum;
let brownNum;
let firstStageCards;
let secondStageCards;
let thirdStageCards;
let activeAncientData;

ancients.forEach((el) => el.addEventListener("click", onAncientClick));
diffs.forEach((el) => el.addEventListener("click", setDifficulty));
diffs.forEach((el) =>
  el.addEventListener("click", () => {
    diffs.forEach((level) => {
      level.classList.remove("active-btn");
      el.classList.add("active-btn");
      el.classList.contains("active-btn")
        ? (currentDiff = el.textContent.toLowerCase())
        : currentDiff;
    });
  })
);
shuffleBtn.addEventListener("click", onShuffleClick);
cardBack.addEventListener("click", onCardBackClick);

function onAncientClick(e) {
  const ancientName = e.target.alt;
  currentAncient = e.target;
  activeAncientData = AncientsData.find(
    (el) => el.name === currentAncient?.alt
  );
  toggleActiveAncient(ancientName, currentAncient);

  if (shuffleBtn.classList.contains("visually-hidden")) {
    levels.classList.remove("visually-hidden");
    stagesContainer.classList.add("visually-hidden");
  }
  shuffleBtn.classList.add("visually-hidden");
}

function toggleActiveAncient(ancientName, currentAncient) {
  AncientsData.forEach((el) => {
    if (el.name === ancientName) {
      for (let i = 0; i < ancients.length; i += 1) {
        if (
          ancients[i].classList.contains("active-ancient") ||
          !currentAncient.classList.add("active-ancient")
        ) {
          ancients[i].classList.remove("active-ancient");
          currentAncient.classList.add("active-ancient");
        }
      }
      diffs.forEach((el) => el.classList.remove("active-btn"));
      setCardsNum(el);
    }
  });
}

function setDifficulty() {
  shuffleBtn.classList.remove("visually-hidden");
  stagesContainer.classList.add("visually-hidden");
}

function onShuffleClick() {
  shuffleBtn.classList.add("visually-hidden");
  stagesContainer.classList.remove("visually-hidden");
  fillStages(activeAncientData);
  createCardsDeck(activeAncientData);
}

function fillStages(ancient) {
  firstCounter[0].textContent = ancient.firstStage.greenCards;
  firstCounter[1].textContent = ancient.firstStage.brownCards;
  firstCounter[2].textContent = ancient.firstStage.blueCards;
  secondCounter[0].textContent = ancient.secondStage.greenCards;
  secondCounter[1].textContent = ancient.secondStage.brownCards;
  secondCounter[2].textContent = ancient.secondStage.blueCards;
  thirdCounter[0].textContent = ancient.thirdStage.greenCards;
  thirdCounter[1].textContent = ancient.thirdStage.brownCards;
  thirdCounter[2].textContent = ancient.thirdStage.blueCards;
}

function setCardsNum({ firstStage, secondStage, thirdStage }) {
  greenNum =
    firstStage.greenCards + secondStage.greenCards + thirdStage.greenCards;
  blueNum = firstStage.blueCards + secondStage.blueCards + thirdStage.blueCards;
  brownNum =
    firstStage.brownCards + secondStage.brownCards + thirdStage.brownCards;
}

function getRandomCards(cards, num) {
  let result = [];
  for (let i = 0; i < num; i++) {
    let randomNum = Math.floor(Math.random() * cards.length);
    let value = cards[randomNum];
    result = [...result, value];
  }
  return result;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getCards(allCards, currentDiff, cardsNum) {
  let newDeck = [];
  let easyCards = allCards.filter((card) => card.difficulty === "easy");
  let lightCards = allCards.filter((card) => card.difficulty !== "hard");
  let normalCards = allCards.filter((card) => card.difficulty === "normal");
  let difficultCards = allCards.filter((card) => card.difficulty !== "easy");
  let hardCards = allCards.filter((card) => card.difficulty === "hard");

  // EASY
  if (currentDiff === "easy") {
    if (cardsNum < easyCards.length) {
      newDeck = getRandomCards(easyCards, cardsNum);
      return newDeck;
    }
    if (cardsNum > easyCards.length) {
      let length = cardsNum - easyCards.length;
      let missingCards = getRandomCards(normalCards, length);
      newDeck = [...easyCards, ...missingCards];
      return newDeck;
    }
  }

  //Light

  if (currentDiff === "light") {
    newDeck = getRandomCards(lightCards, cardsNum);
    return newDeck;
  }

  // Medium

  if (currentDiff === "medium") {
    newDeck = getRandomCards(allCards, cardsNum);
    return newDeck;
  }

  // Difficult
  if (currentDiff === "difficult") {
    newDeck = getRandomCards(difficultCards, cardsNum);
    return newDeck;
  }

  // Hard
  if (currentDiff === "hard") {
    if (cardsNum < hardCards.length) {
      newDeck = getRandomCards(hardCards, cardsNum);
      return newDeck;
    }

    if (cardsNum > hardCards.length) {
      let missingCards = getRandomCards(
        normalCards,
        cardsNum - hardCards.length
      );
      newDeck = [...hardCards, ...missingCards];
      return newDeck;
    }
  }
}

function createCardsDeck({ firstStage, secondStage, thirdStage }) {
  const green = getCards(GreenCards, currentDiff, greenNum);
  const brown = getCards(BrownCards, currentDiff, brownNum);
  const blue = getCards(BlueCards, currentDiff, blueNum);

  const shuffledGreen = shuffle(green);
  const shuffledBrown = shuffle(brown);
  const shuffledBlue = shuffle(blue);

  let firstStageGreen = shuffledGreen.slice(0, firstStage.greenCards);
  let firstStageBrown = shuffledBrown.slice(0, firstStage.brownCards);
  let firstStageBlue = shuffledBlue.slice(0, firstStage.blueCards);
  firstStageCards = [...firstStageGreen, ...firstStageBrown, ...firstStageBlue];

  let secondStageGreen = shuffledGreen.slice(0, secondStage.greenCards);
  let secondStageBrown = shuffledBrown.slice(0, secondStage.brownCards);
  let secondStageBlue = shuffledBlue.slice(0, secondStage.blueCards);
  secondStageCards = [
    ...secondStageGreen,
    ...secondStageBrown,
    ...secondStageBlue,
  ];

  let thirdStageGreen = shuffledGreen.slice(0, thirdStage.greenCards);
  let thirdStageBrown = shuffledBrown.slice(0, thirdStage.brownCards);
  let thirdStageBlue = shuffledBlue.slice(0, thirdStage.blueCards);
  thirdStageCards = [...thirdStageGreen, ...thirdStageBrown, ...thirdStageBlue];
}

function onCardBackClick() {
  cardFront.classList.remove("visually-hidden");
  let newArray = [...firstStageCards];
  console.log(newArray);
  newArray.map((card, i) => {
    cardFront.style.backgroundImage = `url("${card.cardFace}")`;
  });
}
