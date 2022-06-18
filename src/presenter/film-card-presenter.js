import FilmInfoPopup from '../view/film-info-popup-view.js';
import FilmCard from '../view/film-card-view.js';
import CommentsList from '../view/comments-list-view.js';
import NewCommentView from '../view/new-comment-view.js';

import {render, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

const commentTemplate = {
  comment: '',
  emotion: 'smile'
};

export default class FilmCardPresenter {
  #movie = null;
  #movieModel = null;
  #filmCard = null;
  #filmInfoPopup = null;
  #commentsList = null;
  #newComment = null;
  #isPopupOpened = null;
  #container = null;

  #popupDelete = null;

  constructor(movie, movieModel, popupDelete, container) {
    this.#movie = movie;
    this.#container = container;
    this.#movieModel = movieModel;

    this.#popupDelete = popupDelete;
  }

  get movie() {
    return this.#movie;
  }

  get isPopupOpened() {
    return this.#isPopupOpened;
  }

  get filmInfoPopup() {
    return this.#filmInfoPopup;
  }

  get container() {
    return this.#container;
  }

  changeIsPopupOpened = (state) => {
    this.#isPopupOpened = state;
  };

  #handleDetailsClick = (details) => {
    let updateType = null;

    if(this.#isPopupOpened) {
      if(details === 'alreadyWatched') {
        updateType = UpdateType.MAJOR;
      } else {
        updateType = UpdateType.MINOR;
      }
    } else {
      if(details === 'alreadyWatched') {
        updateType = UpdateType.PATCH;
      }
    }

    this.#movieModel.updateMovie(updateType, { ...this.#movie, userDetails: { ...this.#movie.userDetails, [details]: !this.#movie.userDetails[`${details}`] } } );
  };

  #closePopup = () => {
    document.querySelector('body').classList.remove('hide-overflow');
    remove(this.#filmInfoPopup);
    this.#isPopupOpened = false;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #setListeners = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#filmInfoPopup.hidePopupClickHandler(this.#closePopup);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #loadComments = async () => {
    this.#commentsList = new CommentsList(this.#movie, this.#movieModel.getComments);
    await this.#commentsList.loadComments();
    render(this.#commentsList, document.querySelector('.film-details__comments-title'), 'afterend');
    this.#commentsList.setDeleteCommentHandler(this.#handleDeleteComment);
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  #loadNewComment = () => {
    this.#newComment = new NewCommentView(this.#movie, JSON.parse(JSON.stringify(commentTemplate)));
    render(this.#newComment, document.querySelector('.film-details__comments-wrap'), 'beforeend');
    this.#newComment.setEmotionClickHandler(this.#handleEmotionClick);
    this.#newComment.setAddCommentHandler(this.#handleAddComment);
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  openPopup = () => {
    document.querySelector('body').classList.add('hide-overflow');
    this.#popupDelete();
    this.#isPopupOpened = true;

    this.#filmInfoPopup = new FilmInfoPopup(this.#movie);
    render(this.#filmInfoPopup, document.querySelector('.footer'));
    this.#setListeners();
    this.#filmInfoPopup.setDetailsClickHandler(this.#handleDetailsClick);

    this.#loadNewComment();
    this.#loadComments();
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  #renderPopup = () => {
    this.#filmCard.showPopupClickHandler(this.openPopup);
  };

  #handleAddComment = (updateType, movie, comment) => {
    localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
    this.#movieModel.addComment(updateType, movie, comment);
  };

  #handleDeleteComment = (updateType, movie, comment) => {
    localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
    this.#movieModel.deleteComment(updateType, movie, comment);
  };

  #handleEmotionClick = (emotionType, comment) => {
    localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
    this.#newComment.updateElement({comment: comment, emotion: emotionType});
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  destroy = () => {
    this.#closePopup();
    remove(this.#filmCard);
  };

  init = (renderPlace) => {
    this.#filmCard = new FilmCard(this.#movie);
    if (renderPlace !== 'popup') {
      render(this.#filmCard, renderPlace);
    }

    this.#renderPopup();

    this.#filmCard.setDetailsClickHandler(this.#handleDetailsClick);
  };

}
