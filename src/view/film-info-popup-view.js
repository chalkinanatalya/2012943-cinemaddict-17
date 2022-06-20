import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

import AbstractStateView from '../framework/view/abstract-stateful-view.js';

import {makeControlClass} from '../utils.js';
import './film-info-popup-view.css';

const CONTAINER = 'popupContainer';
const SHAKE_CLASS_NAME = 'shake-popup';
const SHAKE_ANIMATION_TIMEOUT = 600;

dayjs.extend(duration);
dayjs.extend(relativeTime);

const createGenreTemplate = (genres) => {
  let genreTemplate = '';
  genres.forEach((genre) => {genreTemplate += `<span class="film-details__genre">${genre}</span>`;});

  return genreTemplate;
};

const createFilmInfoPopupTemplate = (movie) => {
  const {filmInfo, userDetails} = movie;
  const genre = filmInfo.genre.length === 1 ? 'Genre' : 'Genres';

  return (`<section class="film-details ${movie.id}">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(filmInfo.release.date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${dayjs.duration(filmInfo.runTime, 'minutes').format('HH[h] mm[m]')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre}</td>
              <td class="film-details__cell">
                ${createGenreTemplate(filmInfo.genre)}
            </tr>
          </table>

          <p class="film-details__film-description">
          ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${makeControlClass(userDetails.watchlist, CONTAINER)}" data-detail="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${makeControlClass(userDetails.alreadyWatched, CONTAINER)}" data-detail="alreadyWatched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${makeControlClass(userDetails.favorite, CONTAINER)}" data-detail="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">are loading...</span></h3>
        <ul class="film-details__comments-list"></ul>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmInfoPopup extends AbstractStateView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createFilmInfoPopupTemplate(this.#movie);
  }

  setCommentsCount = (commentsCount) => {
    this.element.querySelector('.film-details__comments-count').innerHTML = `${commentsCount}`;
  };

  hidePopupClickHandler = (callback) => {
    this._callback.hideClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#hideClickHandler);
  };

  #hideClickHandler = () => {
    this._callback.hideClick();
  };

  setDetailsClickHandler = (callback) => {
    this._callback.detailsClick = callback;
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#detailsClickHandler);
  };

  #detailsClickHandler = (evt) => {
    localStorage.setItem('scrollPositon', this.element.scrollTop);
    this._callback.detailsClick(evt.target.getAttribute('data-detail'));
  };

  shake(callback) {
    this.element.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.element.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
