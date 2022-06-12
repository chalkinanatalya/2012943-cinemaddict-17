import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { nanoid } from 'nanoid';
import he from 'he';

import AbstractStateView from '../framework/view/abstract-stateful-view.js';

import {makeControlClass, makeCheckedMark} from '../utils.js';
import {UpdateType, MOCKTEXTSHORT} from '../const.js';

const CONTAINER = 'popupContainer';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const commentTemplate = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
        <button class="film-details__comment-delete" data-commentId="${comment.id}">Delete</button>
      </p>
    </div>
  </li>`
);

const createCommentTemplate = (comments) => {
  const commentsList = [];
  comments.forEach((comment) => commentsList.push(commentTemplate(comment)));

  return commentsList;
};

const createFilmInfoPopupTemplate = (movie, commentsList, newComment) => {
  const {filmInfo, userDetails} = movie;
  const commentsId = movie.comments;
  const watchlist = userDetails.watchlist;
  const watchedFilm = userDetails.alreadyWatched;
  const favorite = userDetails.favorite;
  const comments = [];

  commentsList.some((commentList) =>
    commentsId.some((commentId) => {
      if (commentId === commentList.id) {
        comments.push(commentList);
      }
    })
  );

  return (`<section class="film-details ${movie.id}">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRaiting}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.ageRaiting}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
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
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${filmInfo.genre}</span>
                <span class="film-details__genre">Film-Noir</span>
                <span class="film-details__genre">Mystery</span></td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${makeControlClass(watchlist, CONTAINER)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${makeControlClass(watchedFilm, CONTAINER)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${makeControlClass(favorite, CONTAINER)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsId.length}</span></h3>
        <ul class="film-details__comments-list">
          ${createCommentTemplate(comments)}
        </ul>

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
  #comments = null;
  #newComment = null;

  constructor(movie, comments, newComment) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#newComment = newComment;
  }

  get newComment() { return this.#newComment;}

  get template() {
    return createFilmInfoPopupTemplate(this.#movie, this.#comments, this.#newComment);
  }

  hidePopupClickHandler = (callback) => {
    this._callback.hideClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#hideClickHandler);
  };

  #hideClickHandler = () => {
    this._callback.hideClick();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };

  setEmotionClickHandler = (callback) => {
    this._callback.emotionClick = callback;
    this.element.querySelectorAll('.film-details__emoji-list input').forEach((emotionLabel) => emotionLabel.addEventListener('click', this.#emotionClickHandler));
  };

  #emotionClickHandler = (evt) => {
    this._callback.emotionClick(evt);
  };

  #addCommentHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      localStorage.setItem('scrollPositon', this.element.scrollTop);
      evt.preventDefault();
      this._callback.addComment(UpdateType.MINOR, this.#movie.id, {id: `com${nanoid()}`, author: MOCKTEXTSHORT, comment: evt.target.value3, date: dayjs().format('MM/DD/YYYY'), emotion: this.#newComment.emotion});
    }
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('textarea').addEventListener('keydown', this.#addCommentHandler);
  };

  #deleteCommentHandler = (evt) => {
    localStorage.setItem('scrollPositon', this.element.scrollTop);
    evt.preventDefault();
    this._callback.deleteComment(UpdateType.MINOR, this.#movie.id, evt.target.getAttribute('data-commentId'));
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#deleteCommentHandler));
  };
}
