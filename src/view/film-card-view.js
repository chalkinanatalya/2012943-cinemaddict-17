import {makeControlClass} from '../utils.js';
import AbstractView from '../framework/view/abstract-stateful-view.js';

const createCardTemplate = (movie) => {
  const {filmInfo, userDetails} = movie;

  const watchlist = userDetails.watchlist;
  const watchedFilm = userDetails.alreadyWatched;
  const favorite = userDetails.favorite;

  return ( `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRaiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmInfo.release.date}</span>
      <span class="film-card__duration">${filmInfo.runTime}</span>
      <span class="film-card__genre">${filmInfo.genre}</span>
    </p>
    <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description}</p>
    <span class="film-card__comments">89 comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${makeControlClass(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${makeControlClass(watchedFilm)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${makeControlClass(favorite)}" type="button">Mark as favorite</button>
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

  showPopupClickHandler = (callback) => {
    this._callback.showClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#showClickHandler);
  };

  #showClickHandler = () => {
    this._callback.showClick();
  };
}
