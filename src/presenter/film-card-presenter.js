import FilmInfoPopup from '../view/film-info-popup-view.js';
import FilmCard from '../view/film-card-view.js';
import Comment from '../view/comment-view.js';
import NewCommentView from '../view/new-comment-view.js';

import {render, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

const commentTemplate = {
  comment: '',
  emotion: 'smile'
};

export default class FilmCardPresenter {
  #movie = null;
  #comments = [];
  #movieModel = null;
  #isPopupOpened = null;
  #container = null;

  #filmCard = null;
  #filmInfoPopup = null;
  #commentsList = [];
  #newComment = null;

  #popupDelete = null;
  #block = null;
  #unblock = null;

  constructor(movie, movieModel, popupDelete, container, block, unblock) {
    this.#movie = movie;
    this.#container = container;
    this.#movieModel = movieModel;

    this.#popupDelete = popupDelete;
    this.#block = block;
    this.#unblock = unblock;
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

  #handleDetailsClick = async (details) => {
    this.#block();

    let updateType = null;
    if(this.#isPopupOpened) {
      updateType = UpdateType.MAJOR;
    } else {
      updateType = UpdateType.MINOR;
    }

    try {
      await this.#movieModel.updateMovie(updateType, { ...this.#movie, userDetails: { ...this.#movie.userDetails, [details]: !this.#movie.userDetails[`${details}`] } } );
    } catch (err) {
      if(updateType === UpdateType.MINOR) {
        this.#filmCard.shake();
      } else {
        this.#filmInfoPopup.shake();
      }
    }

    this.#unblock();
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
    try{
      this.#comments = await this.#movieModel.getComments(this.#movie.id);
    } catch(err) {
      this.#comments = [];
    }
    this.#comments.forEach((comment) => {
      const commentsList = new Comment(this.#movie, comment);
      this.#commentsList.push(commentsList);
      render(commentsList, document.querySelector('.film-details__comments-list'), 'beforeend');
      commentsList.setDeleteCommentHandler(this.#handleDeleteComment);
    });
    this.#filmInfoPopup.setCommentsCount(this.#comments.length);

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

  #handleAddComment = async (evt, updateType, movie, comment) => {
    evt.target.readOnly = true;
    try {
      localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
      await this.#movieModel.addComment(updateType, movie, comment);
    } catch (err) {
      this.#newComment.shake();
    }

    evt.target.readOnly = false;
  };

  #handleDeleteComment = async (evt, updateType, movie, comment) => {
    evt.target.disabled = true;
    evt.target.textContent = 'Deleting...';

    try {
      localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
      await this.#movieModel.deleteComment(updateType, movie, comment);
    } catch (err) {
      this.#commentsList.find((commentView) => commentView.comment.id === evt.target.getAttribute('data-commentId')).shake();
    }

    evt.target.textContent = 'Delete';
    evt.target.disabled = false;
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
