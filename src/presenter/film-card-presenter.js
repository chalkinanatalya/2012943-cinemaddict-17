import FilmInfoPopup from '../view/film-info-popup-view.js';
import FilmCard from '../view/film-card-view.js';

import {render, remove, replace} from '../framework/render.js';
import {UpdateType, MOCKTEXTLONG} from '../const.js';

const commentTemplate = {
  comment: MOCKTEXTLONG,
  emotion: 'smile'
};

export default class FilmCardPresenter {
  #movie = null;
  #updateMovie = null;
  #filmCard = null;
  #comments = null;
  #popupDelete = null;
  #filmInfoPopup = null;
  #isPopupOpened = null;
  #newComment = null;
  #addComment = null;
  #deleteComment = null;

  constructor(movie, updateMovie, addComment, deleteComment, popupDelete) {
    this.#movie = movie;

    this.#updateMovie = updateMovie;
    this.#popupDelete = popupDelete;
    this.#addComment = addComment;
    this.#deleteComment = deleteComment;
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

  changeIsPopupOpened = (state) => {
    this.#isPopupOpened = state;
  };

  #handleWatchlistClick = () => {
    if(this.#isPopupOpened) {
      this.#updateMovie(UpdateType.MINOR, this.#movie.id, 'watchlist');
    } else {
      this.#updateMovie(UpdateType.PATCH, this.#movie.id, 'watchlist');
    }
  };

  #handleWatchedClick = () => {
    if(this.#isPopupOpened) {
      this.#updateMovie(UpdateType.MINOR, this.#movie.id, 'alreadyWatched');
    } else {
      this.#updateMovie(UpdateType.PATCH, this.#movie.id, 'alreadyWatched');
    }
  };

  #handleFavoritelistClick = () => {
    if(this.#isPopupOpened) {
      this.#updateMovie(UpdateType.MINOR, this.#movie.id, 'favorite');
    } else {
      this.#updateMovie(UpdateType.PATCH, this.#movie.id, 'favorite');
    }
  };

  #handleEmotionClick = (evt) => {
    this.#emotionClick(evt.target.value);
  };

  #setListeners = () => {
    const closePopup = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      remove(this.#filmInfoPopup);
      this.#isPopupOpened = false;
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
      }
    };

    document.removeEventListener('keydown', onEscKeyDown);
    this.#filmInfoPopup.hidePopupClickHandler(closePopup);
    document.addEventListener('keydown', onEscKeyDown);
  };

  #setFilmDetailsHandler = (film) => {
    film.setWatchlistClickHandler(this.#handleWatchlistClick);
    film.setWatchedClickHandler(this.#handleWatchedClick);
    film.setFavoriteClickHandler(this.#handleFavoritelistClick);
  };

  openPopup = () => {
    document.querySelector('body').classList.add('hide-overflow');
    this.#popupDelete();
    this.#isPopupOpened = true;
    render(this.#filmInfoPopup, document.querySelector('.footer'));
    this.#setListeners();
    this.#setFilmDetailsHandler(this.#filmInfoPopup);
    this.#filmInfoPopup._state = this.#newComment;

    this.#filmInfoPopup.setEmotionClickHandler(this.#handleEmotionClick);
    this.#filmInfoPopup.setAddCommentHandler(this.#addComment);
    this.#filmInfoPopup.setDeleteCommentHandler(this.#deleteComment);

    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  #renderPopup = () => {
    if(!this.#newComment) {
      this.#newComment = JSON.parse(JSON.stringify(commentTemplate));
    }
    this.#filmInfoPopup = new FilmInfoPopup(this.#movie, this.#comments, this.#newComment);
    this.#filmCard.showPopupClickHandler(this.openPopup);
  };

  #emotionClick = (emotionType) => {
    this.#newComment.emotion = emotionType;
    this.#filmInfoPopup._setState({emotion: emotionType});
    localStorage.setItem('scrollPositon', this.#filmInfoPopup.element.scrollTop);
    this.openPopup();
    this.#filmInfoPopup.element.scrollTop = localStorage.getItem('scrollPositon');
  };

  destroy = () => {
    remove(this.#filmInfoPopup);
    remove(this.#filmCard);
  };

  init = (renderPlace, comments, movie = 0) => {
    if(movie) {
      this.#movie = movie;
      const oldFilmCard = this.#filmCard;
      const newFilmCard = new FilmCard(this.#movie);
      replace(newFilmCard, oldFilmCard);
      this.#filmCard = newFilmCard;
      this.#popupDelete();
    } else {
      this.#comments = comments;
      this.#filmCard = new FilmCard(this.#movie);
      render(this.#filmCard, renderPlace);
    }

    this.#renderPopup();

    this.#setFilmDetailsHandler(this.#filmCard);
  };

}
