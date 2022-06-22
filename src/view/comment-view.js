import AbstractStateView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import {UpdateType} from '../const.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const createCommentTemplate = (comment) => (
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

export default class Comment extends AbstractStateView {
  #movie = null;
  #comment = null;

  constructor(movie, comment) {
    super();
    this.#movie = movie;
    this.#comment = comment;
  }

  get comment() {
    return this.#comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  #deleteCommentHandler = async (evt) => {
    evt.preventDefault();
    const id = evt.target.getAttribute('data-commentId');
    const commentIndex = this.#movie.comments.findIndex((comment) => comment === id);
    this._callback.deleteComment(evt, UpdateType.MAJOR, {...this.#movie, comments: [...this.#movie.comments.slice(0, commentIndex), ...this.#movie.comments.slice(commentIndex + 1)]}, id);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#deleteCommentHandler));
  };
}
