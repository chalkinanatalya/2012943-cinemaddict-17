import AbstractStateView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import {UpdateType} from '../const.js';

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

const createCommentTemplate = (comments) => (
  `<ul class="film-details__comments-list">
    ${comments.map((comment) => commentTemplate(comment)).join('')}
  </ul>`
);

export default class CommentsList extends AbstractStateView {
  #getComments = null;
  #movie = null;
  #comments = [];

  constructor(movie, getComments) {
    super();
    this.#movie = movie;
    this.#getComments = getComments;
  }

  get template() {
    document.querySelector('.film-details__comments-count').innerHTML = `${this.#comments.length}`;
    return createCommentTemplate(this.#comments);
  }

  loadComments = async () => {
    try{
      this.#comments = await this.#getComments(this.#movie.id);
    } catch(err) {
      this.#comments = [];
    }
  };

  #deleteCommentHandler = async (evt) => {
    evt.preventDefault();
    const id = evt.target.getAttribute('data-commentId');
    const commentIndex = this.#movie.comments.findIndex((comment) => comment === id);
    this._callback.deleteComment(UpdateType.MINOR, {...this.#movie, comments: [...this.#movie.comments.slice(0, commentIndex), ...this.#movie.comments.slice(commentIndex + 1)]}, id);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#deleteCommentHandler));
  };
}
