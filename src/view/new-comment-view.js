import he from 'he';

import AbstractStateView from '../framework/view/abstract-stateful-view.js';

import {makeCheckedMark} from '../utils.js';
import {UpdateType, EMOTIONS} from '../const.js';

const createNewCommentTemplate = (newComment) => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${newComment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment.comment}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${makeCheckedMark(newComment.emotion, EMOTIONS.SMILE)}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${makeCheckedMark(newComment.emotion, EMOTIONS.SLEEPING)}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${makeCheckedMark(newComment.emotion, EMOTIONS.PUKE)}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${makeCheckedMark(newComment.emotion, EMOTIONS.ANGRY)}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`
);

export default class NewCommentView extends AbstractStateView {
  #movie = null;
  #newComment = null;

  constructor(movie, newComment) {
    super();
    this.#movie = movie;
    this.#newComment = newComment;
  }

  get template() {
    return createNewCommentTemplate(this.#parseStateToComment());
  }

  _restoreHandlers = () => {
    this.setEmotionClickHandler(this._callback.emotionClick);
    this.setAddCommentHandler(this._callback.addComment);
  };

  setEmotionClickHandler = (callback) => {
    this._callback.emotionClick = callback;
    this.element.querySelectorAll('.film-details__emoji-list input').forEach((emotionLabel) => emotionLabel.addEventListener('click', this.#emotionClickHandler));
  };

  #emotionClickHandler = (evt) => {
    this._callback.emotionClick(evt.target.value, this.element.querySelector('.film-details__comment-input').value);
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('textarea').addEventListener('keydown', this.#addCommentHandler);
  };

  #addCommentHandler = (evt) => {
    if ((evt.metaKey && evt.key === 'Enter') || (evt.ctrlKey && evt.key === 'Enter')) {
      evt.preventDefault();
      this._callback.addComment(evt, UpdateType.MINOR, {...this.#movie}, {comment: he.encode(evt.target.value), emotion: this.#newComment.emotion});
    }
  };

  #parseStateToComment = () => {
    if(!Object.keys(this._state).length) {
      return this.#newComment;
    }
    const comment = {...this._state};

    return comment;
  };
}
