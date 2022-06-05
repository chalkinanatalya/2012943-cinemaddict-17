import {makeControlClass} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

const CONTAINER = 'cardContainer';
dayjs.extend(duration);

const createCardTemplate = (movie) => {
  const {filmInfo, userDetails} = movie;

  const watchlist = userDetails.watchlist;
  const watchedFilm = userDetails.alreadyWatched;
  const favorite = userDetails.favorite;

  return ( `<article class="film-card ${movie.id}">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRaiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(filmInfo.release.date).format('DD MMM YYYY')}</span>
      <span class="film-card__duration">${dayjs.duration(filmInfo.runTime, 'minutes').format('HH[h] mm[m]')}</span>
      <span class="film-card__genre">${filmInfo.genre}</span>
    </p>
    <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description}</p>
    <span class="film-card__comments">89 comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${makeControlClass(watchlist, CONTAINER)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${makeControlClass(watchedFilm, CONTAINER)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${makeControlClass(favorite, CONTAINER)}" type="button">Mark as favorite</button>
  </div>
</article>`
  );
};

export default class FilmCard extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createCardTemplate(this.#movie);
  }

  get movie() {
    return this.#movie;
  }

  setUserDetails = (param, state) => {
    this.#movie.userDetails[param] = state;
  };

  showPopupClickHandler = (callback) => {
    this._callback.showClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#showClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #showClickHandler = () => {
    this._callback.showClick();
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
