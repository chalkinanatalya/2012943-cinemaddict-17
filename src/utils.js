import dayjs from 'dayjs';

const CARDACTIVE = 'film-card__controls-item--active';
const POPUPACTIVE = 'film-details__control-button--active';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomSubjects = (subjects) => subjects[getRandomInteger(0, subjects.length - 1)];

const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

const getRandomDate = () => {
  const year = getRandomInteger(2000, 2022);
  const month = getRandomInteger(1, 12);
  let day = getRandomInteger(1, 31);

  if(month === 2) {
    day = getRandomInteger(1, 28);
  }

  const randomDay = new Date(year, month, day);
  return dayjs(randomDay).format('DD/MM/YYYY');

};

const makeControlClass = (controlItem, cardType) => {
  if(controlItem) {
    if(cardType === 'separate') {
      return CARDACTIVE;
    } else {
      return POPUPACTIVE;
    }
  }
};

const rerenderCard = (card, userDetail) => {
  if(userDetail === 'alreadyWatched') {userDetail = 'watched';}
  const cardElements = document.querySelectorAll(`.${card.movie.id}`);
  cardElements.forEach((cardElement) => {
    const button = cardElement.querySelector(`[class*="${userDetail}"]`);
    if(!button.hasAttribute('name')) {
      if(button.classList.contains(CARDACTIVE)) {
        button.classList.remove(CARDACTIVE);
      } else {
        button.classList.add(CARDACTIVE);
      }
    } else {
      if(button.classList.contains(POPUPACTIVE)) {
        button.classList.remove(POPUPACTIVE);
      } else {
        button.classList.add(POPUPACTIVE);
      }
    }
  });
  // const prevElement = card.element;
  // const parent = prevElement.parentElement;
  // card.removeElement(card);
  // parent.replaceChild(card.element, prevElement);
};

export {getRandomInteger, getRandomSubjects, humanizeTaskDueDate, getRandomDate, makeControlClass, rerenderCard};
