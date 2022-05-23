import {render, remove, replace} from '../framework/render.js';
import FilmCard from '../view/film-card-view.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';

export default class FilmCardPresenter {
  #movie = null;
  #changeData = null;
  #filmCard = null;
  #commentContainer = null;
  #popupDelete = null;
  #filmInfoPopup = null;
  #isPopupOpened = null;

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
  };

  #renderPopup = () => {
    this.#filmInfoPopup = new FilmInfoPopup(this.#movie, this.#commentContainer);
    this.#filmCard.showPopupClickHandler(this.openPopup);
  };

  init = (renderPlace, commentContainer, movie = 0) => {
    if(movie) {
      this.#movie = movie;
      const oldFilmCard = this.#filmCard;
      const newFilmCard = new FilmCard(this.#movie);
      replace(newFilmCard, oldFilmCard);
      this.#filmCard = newFilmCard;
      this.#popupDelete();
    } else {
      this.#commentContainer = commentContainer;
      this.#filmCard = new FilmCard(this.#movie);
      render(this.#filmCard, renderPlace);
    }

    this.#renderPopup();

    this.#setFilmDetailsHandler(this.#filmCard);
  };

}
