import dayjs from 'dayjs';

const CARDACTIVE = 'film-card__controls-item--active';
const POPUPACTIVE = 'film-details__control-button--active';
const CARDCONTAINER = 'cardContainer';
const POPUPCONTAINER = 'popupContainer';

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

const makeActiveSort = (sortType, value) => {
  if(sortType === value) {
    return 'sort__button--active';
  }
};

const makeActiveFilter = (filterType, value) => {
  if(filterType === value) {
    return 'main-navigation__item--active';
  }
};

export {makeControlClass, dateComarison, makeCheckedMark, makeActiveSort, makeActiveFilter};
