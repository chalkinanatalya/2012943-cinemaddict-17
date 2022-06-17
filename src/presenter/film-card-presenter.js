import FilmInfoPopup from '../view/film-info-popup-view.js';
import FilmCard from '../view/film-card-view.js';
import CommentsList from '../view/comments-list-view.js';

import {render, remove} from '../framework/render.js';
import {UpdateType, MOCKTEXTLONG} from '../const.js';

const commentTemplate = {
  comment: MOCKTEXTLONG,
  emotion: 'smile'
};

export default class FilmCardPresenter {
  #movie = null;
  #movieModel = null;
  #filmCard = null;
  #filmInfoPopup = null;
  #commentsList = null;
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

  #handleEmotionClick = (evt) => {
    this.#emotionClick(evt.target.value);
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
    this.#commentsList.setDeleteCommentHandler(this.#movieModel.deleteComment);
  };

  openPopup = () => {
    document.querySelector('body').classList.add('hide-overflow');
    this.#popupDelete();
    this.#isPopupOpened = true;

    this.#filmInfoPopup = new FilmInfoPopup(this.#movie, this.#movieModel.newComment);
    render(this.#filmInfoPopup, document.querySelector('.footer'));
    this.#setListeners();
    this.#filmInfoPopup.setDetailsClickHandler(this.#handleDetailsClick);
    this.#filmInfoPopup._state = this.#movieModel.newComment;

    this.#filmInfoPopup.setEmotionClickHandler(this.#handleEmotionClick);
    this.#filmInfoPopup.setAddCommentHandler(this.#movieModel.addComment);
    this.#loadComments();
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  #renderPopup = () => {
    if(!this.#movieModel.newComment) {
      this.#movieModel.newComment = JSON.parse(JSON.stringify(commentTemplate));
    }
    this.#filmCard.showPopupClickHandler(this.openPopup);
  };

  #emotionClick = (emotionType) => {
    this.#movieModel.newComment.emotion = emotionType;
    this.#filmInfoPopup._setState({emotion: emotionType});
    localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
    this.openPopup();
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
