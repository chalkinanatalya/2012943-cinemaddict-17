import {makeControlClass} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

const CONTAINER = 'cardContainer';
dayjs.extend(duration);

const createCardTemplate = (movie) => {
  const {comments, filmInfo, userDetails} = movie;

  const watchlist = userDetails.watchlist;
  const watchedFilm = userDetails.alreadyWatched;
  const favorite = userDetails.favorite;
  const description = filmInfo.description.length <= 140 ? filmInfo.description : `${filmInfo.description.substring(0, 139)}...`;

  return ( `<article class="film-card ${movie.id}">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(filmInfo.release.date).format('YYYY')}</span>
      <span class="film-card__duration">${dayjs.duration(filmInfo.runTime, 'minutes').format('HH[h] mm[m]')}</span>
      <span class="film-card__genre">${filmInfo.genre[0]}</span>
    </p>
    <img src="./${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${makeControlClass(watchlist, CONTAINER)}" data-detail="watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${makeControlClass(watchedFilm, CONTAINER)}" data-detail="alreadyWatched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${makeControlClass(favorite, CONTAINER)}" data-detail="favorite" type="button">Mark as favorite</button>
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

  setDetailsClickHandler = (callback) => {
    this._callback.detailsClick = callback;
    this.element.querySelectorAll('.film-card__controls button').forEach((filmDetails) => filmDetails.addEventListener('click', this.#detailsClickHandler));
  };

  #detailsClickHandler = (evt) => {
    this._callback.detailsClick(evt.target.getAttribute('data-detail'));
  };

  #showClickHandler = () => {
    localStorage.setItem('scrollPositon', 0);
    this._callback.showClick();
  };
}
