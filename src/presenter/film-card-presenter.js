import {render, remove, replace} from '../framework/render.js';
import FilmCard from '../view/film-card-view.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';
import {MOCKTEXTLONG, MOCKTEXTSHORT} from '../const.js';
import {getRandomDate, getRandomInteger} from '../utils.js';

const commentTemplate = {
  id: getRandomInteger(1, 99),
  author: MOCKTEXTSHORT,
  comment: MOCKTEXTLONG,
  date: getRandomDate(),
  emotion: 'smile'
};

export default class FilmCardPresenter {
  #movie = null;
  #changeData = null;
  #filmCard = null;
  #comments = null;
  #popupDelete = null;
  #filmInfoPopup = null;
  #isPopupOpened = null;
  #newComment = null;

  constructor(movie, changeData, popupDelete) {
    this.#movie = movie;
    this.#changeData = changeData;
    this.#popupDelete = popupDelete;
  }

  get movie() {
    return this.#movie;
  }

  get isPopupOpened() {
    return this.#isPopupOpened;
  }

  get filmInfoPopup() {
    return this.#filmInfoPopup;
  }

  get filmCard() {
    return this.#filmCard;
  }

  changeIsPopupOpened = (state) => {
    this.#isPopupOpened = state;
  };

  #handleWatchlistClick = () => {
    this.#changeData(this.#movie, 'watchlist');
  };

  #handleWatchedClick = () => {
    this.#changeData(this.#movie, 'alreadyWatched');
  };

  #handleFavoritelistClick = () => {
    this.#changeData(this.#movie, 'favorite');
  };

  #handleEmotionClick = (evt) => {
    this.#emotionClick(evt.target.value);
  };

  #setListeners = () => {
    const closePopup = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      remove(this.#filmInfoPopup);
      this.#isPopupOpened = false;
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
      }
    };

    document.removeEventListener('keydown', onEscKeyDown);
    this.#filmInfoPopup.hidePopupClickHandler(closePopup);
    document.addEventListener('keydown', onEscKeyDown);
  };

  #setFilmDetailsHandler = (film) => {
    film.setWatchlistClickHandler(this.#handleWatchlistClick);
    film.setWatchedClickHandler(this.#handleWatchedClick);
    film.setFavoriteClickHandler(this.#handleFavoritelistClick);
  };

  openPopup = () => {
    document.querySelector('body').classList.add('hide-overflow');
    this.#popupDelete();
    this.#isPopupOpened = true;
    render(this.#filmInfoPopup, document.querySelector('.footer'));
    this.#setListeners();
    this.#setFilmDetailsHandler(this.#filmInfoPopup);
    this.#filmInfoPopup._state = this.#newComment;
    this.#filmInfoPopup.setEmotionClickHandler(this.#handleEmotionClick);
  };

  #renderPopup = () => {
    if(!this.#newComment) {
      this.#newComment = JSON.parse(JSON.stringify(commentTemplate));
    }
    this.#filmInfoPopup = new FilmInfoPopup(this.#movie, this.#comments, this.#newComment);
    this.#filmCard.showPopupClickHandler(this.openPopup);
  };

  #emotionClick = (emotionType) => {
    this.#newComment.emotion = emotionType;
    this.#filmInfoPopup._setState({emotion: emotionType});
    localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
    this.openPopup();
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  init = (renderPlace, comments, movie = 0) => {
    if(movie) {
      this.#movie = movie;
      const oldFilmCard = this.#filmCard;
      const newFilmCard = new FilmCard(this.#movie);
      replace(newFilmCard, oldFilmCard);
      this.#filmCard = newFilmCard;
      this.#popupDelete();
    } else {
      this.#comments = comments;
      this.#filmCard = new FilmCard(this.#movie);
      render(this.#filmCard, renderPlace);
    }

    this.#renderPopup();

    this.#setFilmDetailsHandler(this.#filmCard);
  };

}
