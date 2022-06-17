import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import he from 'he';

import AbstractStateView from '../framework/view/abstract-stateful-view.js';

import {makeControlClass, makeCheckedMark} from '../utils.js';
import {UpdateType} from '../const.js';

const CONTAINER = 'popupContainer';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const createGenreTemplate = (genres) => {
  let genreTemplate = '';
  genres.forEach((genre) => {genreTemplate += `<span class="film-details__genre">${genre}</span>`;});

  return genreTemplate;
};

const createFilmInfoPopupTemplate = (movie, newComment) => {
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
          <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.ageRating}</p>
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

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            <img src="images/emoji/${newComment.emotion}.png" width="55" height="55" alt="emoji-smile">
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(newComment.comment)}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${makeCheckedMark(newComment.emotion, 'smile')}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${makeCheckedMark(newComment.emotion, 'sleeping')}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${makeCheckedMark(newComment.emotion, 'puke')}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${makeCheckedMark(newComment.emotion, 'angry')}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmInfoPopup extends AbstractStateView {
  #movie = null;
  #newComment = null;

  constructor(movie, newComment) {
    super();
    this.#movie = movie;
    this.#newComment = newComment;
  }

  get newComment() { return this.#newComment;}

  get template() {
    return createFilmInfoPopupTemplate(this.#movie, this.#newComment);
  }

  hidePopupClickHandler = (callback) => {
    this._callback.hideClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#hideClickHandler);
  };

  #hideClickHandler = () => {
    this._callback.hideClick();
  };

  setDetailsClickHandler = (callback) => {
    this._callback.detailsClick = callback;
    this.element.querySelectorAll('.film-details__controls button').forEach((filmDetails) => filmDetails.addEventListener('click', this.#detailsClickHandler));
  };

  #detailsClickHandler = (evt) => {
    localStorage.setItem('scrollPositon', this.element.scrollTop);
    this._callback.detailsClick(evt.target.getAttribute('data-detail'));
  };

  setEmotionClickHandler = (callback) => {
    this._callback.emotionClick = callback;
    this.element.querySelectorAll('.film-details__emoji-list input').forEach((emotionLabel) => emotionLabel.addEventListener('click', this.#emotionClickHandler));
  };

  #emotionClickHandler = (evt) => {
    this._callback.emotionClick(evt);
  };

  #addCommentHandler = (evt) => {
    if ((evt.metaKey && evt.key === 'Enter') || (evt.ctrlKey && evt.key === 'Enter')) {
      localStorage.setItem('scrollPositon', this.element.scrollTop);
      evt.preventDefault();
      this._callback.addComment(UpdateType.MINOR, {...this.#movie}, {comment: evt.target.value, emotion: this.#newComment.emotion});
    }
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('textarea').addEventListener('keydown', this.#addCommentHandler);
  };
}
