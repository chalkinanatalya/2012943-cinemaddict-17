import dayjs from 'dayjs';

const CARDACTIVE = 'film-card__controls-item--active';
const POPUPACTIVE = 'film-details__control-button--active';
const CARDCONTAINER = 'cardContainer';
const POPUPCONTAINER = 'popupContainer';

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
  return dayjs(randomDay).format('MM/DD/YYYY');
};

// const reverseDate = (date) => {
//   const [day, month, year] = date.split('/');
//   return `${month}/${day}/${year}`;
// };

const dateComarison = (firstDateStr, secondDateStr) => {
  const firstDate = dayjs(firstDateStr, 'MM/DD/YYYY');
  const secondDate = dayjs(secondDateStr, 'MM/DD/YYYY');

  return firstDate.isBefore(secondDate);
};

const makeControlClass = (controlItem, cardType) => {
  if(controlItem) {
    if(cardType === CARDCONTAINER) {
      return CARDACTIVE;
    } else if(cardType === POPUPCONTAINER) {
      return POPUPACTIVE;
    }
  }
};

const makeCheckedMark = (emotionType, value) => {
  if(emotionType === value) {
    return 'checked';
  }
};

const copy = (oldObj) => {
  const newObj = JSON.parse(JSON.stringify(oldObj));
  return newObj;
};

const reverse = (movie, userDetail) => {
  const changedMovie = copy(movie);
  changedMovie.userDetails[userDetail] = !changedMovie.userDetails[userDetail];
  return changedMovie;
};

const findCards = (array, {searchType, data}) => {
  const newCardList = [];
  for(let i = 0; i < array.length; i++) {
    if(searchType === 'id') {
      const newCard = array[i].find((filmCard) => filmCard.movie.id === data);
      if(newCard) {
        newCardList.push(newCard);
      }
    } else {
      const newCard = array[i].find((filmCard) => filmCard.isPopupOpened === data);
      if(newCard) {
        newCardList.push(newCard);
      }
    }
  }
  return newCardList;
};

export {getRandomInteger, getRandomSubjects, humanizeTaskDueDate, getRandomDate, makeControlClass, reverse, copy, findCards, dateComarison, makeCheckedMark};
