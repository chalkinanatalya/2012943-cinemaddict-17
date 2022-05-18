import {render, remove} from '../framework/render.js';
import FilmCard from '../view/film-card-view.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';

const BODY = document.querySelector('body');

export default class FilmCardPresenter {
  #movie = null;
  #changeData = null;
  #filmCard = null;
  #commentContainer = null;
  #popupDelete = null;

  constructor(movie, changeData, popupDelete) {
    this.#movie = movie;
    this.#changeData = changeData;
    this.#popupDelete = popupDelete;
  }

  #handleWatchlistClick = () => {
    this.#changeData(this.#movie, 'watchlist', this.#filmCard);
  };

  #handleWatchedClick = () => {
    this.#changeData(this.#movie, 'alreadyWatched', this.#filmCard);
  };

  #handleFavoritelistClick = () => {
    this.#changeData(this.#movie, 'favorite', this.#filmCard);
  };

  #renderPopup = () => {
    const filmInfoPopup = new FilmInfoPopup(this.#movie, this.#commentContainer);

    const setListeners = () => {
      const closePopup = () => {
        BODY.classList.remove('hide-overflow');
        remove(filmInfoPopup);
      };

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          closePopup();
        }
      };

      document.removeEventListener('keydown', onEscKeyDown);
      filmInfoPopup.hidePopupClickHandler(closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const openPopup = () => {
      BODY.classList.add('hide-overflow');
      const footerContainer = document.querySelector('.footer');
      this.#popupDelete();
      render(filmInfoPopup, footerContainer);
      setListeners();
      filmInfoPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
      filmInfoPopup.setWatchedClickHandler(this.#handleWatchedClick);
      filmInfoPopup.setFavoriteClickHandler(this.#handleFavoritelistClick);
    };

    this.#filmCard.showPopupClickHandler(openPopup);
  };

  init = (renderPlace, commentContainer) => {
    this.#filmCard = new FilmCard(this.#movie);
    this.#commentContainer = commentContainer;
    render(this.#filmCard, renderPlace);
    this.#renderPopup();

    this.#filmCard.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCard.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCard.setFavoriteClickHandler(this.#handleFavoritelistClick);
  };

}
