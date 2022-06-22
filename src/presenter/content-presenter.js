import FilmCardPresenter from '../presenter/film-card-presenter.js';

import FilmContainer from '../view/film-container-view.js';
import FilmContainerList from '../view/film-container-list-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js';

import {dateComarison} from '../utils.js';
import {UpdateType, FilterType, SortType, TimeLimit} from '../const.js';
import {render, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';


const CARD_OUTPUT_AT_ONCE = 5;

export default class ContentPresenter {
  #mainContainer = null;
  #movieModel = null;
  #filterModel = null;
  #sortModel = null;

  #filmContainer = new FilmContainer();
  #filmContainerList = new FilmContainerList();
  #showMoreButton = new ShowMoreButton();
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #noFilm = null;

  #filmCards = [];
  #renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;
  #sortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #isReloaded = false;

  constructor(mainContainer, movieModel, filterModel, sortModel) {
    this.#mainContainer = mainContainer;

    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#movieModel.addObserver(this.#handleCardChange);
    this.#sortModel.addObserver(this.#handleCardChange);
  }

  #movies(container) {
    let movies = [...this.#movieModel.movies];
    if (container === 'main') {
      if (this.#filterModel.filterType !== FilterType.ALL) {
        this.#filterType = this.#filterModel.filterType;
        movies = movies.filter((movie) => movie.userDetails[this.#filterType]);
      }

      if (this.#sortModel.sortType !== SortType.DEFAULT) {
        this.#sortType = this.#sortModel.sortType;
        movies = this.#sortCards(movies);
      }
    } else {
      movies = this.#topFilter(movies, container);
    }

    if (this.#isReloaded) {
      this.#renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;
      this.#isReloaded = false;
    }
    return movies;
  }

  init = () => {
    render(this.#filmContainer, this.#mainContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderMovieContainer();
    this.#renderTop('rating');
    this.#renderTop('comments');
  };

  #handleShowMoreButtonClick = () => {
    let movies = this.#movies('main');
    const moviesLength = movies.length;
    movies = movies.slice(this.#renderOutputFilmCount, this.#renderOutputFilmCount + CARD_OUTPUT_AT_ONCE);
    this.#renderCards(movies, this.#filmContainerList, 'main');

    this.#renderOutputFilmCount += CARD_OUTPUT_AT_ONCE;

    if(this.#renderOutputFilmCount >= moviesLength) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderCards = (movies, place, container, creationType = 0) => {
    const renderPlace = place.element.querySelector('.films-list__container');
    for(let i = 0; i < movies.length; i++) {
      const filmCard = new FilmCardPresenter(movies[i], this.#movieModel, this.#popupDelete, container, this.#uiBlocker.block, this.#uiBlocker.unblock);
      this.#filmCards.push(filmCard);
      if(creationType === 'popup') {
        filmCard.init('popup');
      } else {
        filmCard.init(renderPlace);
      }
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmContainer.element, 'afterbegin');
  };

  #renderNoFilm = () => {
    this.#noFilm = new NoFilmView(this.#filterType);
    remove(this.#noFilm);
    render(this.#noFilm, this.#filmContainer.element);
  };

  #sortCards = (movies) => {
    switch (this.#sortType) {
      case SortType.DEFAULT:
        return movies;
      case SortType.DATE:
        return movies.sort((firstDate, secondDate) => (dateComarison(firstDate.filmInfo.release.date, secondDate.filmInfo.release.date)) ? 1 : -1);
      case SortType.RATING:
        return movies.sort((firstDate, secondDate) => (firstDate.filmInfo.totalRating < secondDate.filmInfo.totalRating) ? 1 : -1);
    }
  };

  #topFilter = (movies, filter) => {
    let filteredMovies = null;
    switch (filter) {
      case 'rating':
        filteredMovies = movies.sort((firstMovie, secondMovie) => (firstMovie.filmInfo.totalRating < secondMovie.filmInfo.totalRating) ? 1 : -1);
        break;
      case 'comments':
        filteredMovies = movies.sort((firstMovie, secondMovie) => (firstMovie.comments.length < secondMovie.comments.length) ? 1 : -1);
        break;
    }

    return filteredMovies.slice(0, 2);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderMovieContainer = () => {
    const movies = this.#movies('main');

    if(!movies.length) {
      this.#renderNoFilm();
      return;
    }

    render(this.#filmContainerList, this.#filmContainer.element, 'afterbegin');

    this.#renderCards(movies.slice(0, this.#renderOutputFilmCount), this.#filmContainerList, 'main');
    if(movies.length > this.#renderOutputFilmCount) {
      render(this.#showMoreButton, this.#filmContainerList.element);
      this.#renderShowMoreButton();
    }
  };

  #renderTop = (topType) => {
    const movies = this.#movies(topType);

    if(!movies.length) {
      return;
    }

    let topComponent = null;

    if (topType === 'rating') {
      if(movies[0].filmInfo.totalRating === 0) {
        return;
      }
      topComponent = new TopRated();
    } else {
      if(!movies[0].comments.length){
        return;
      }
      topComponent = new MostCommented();
    }
    render(topComponent, this.#filmContainer.element);
    this.#renderCards(movies, topComponent, topType);
  };

  #removeFilmContainer = () => {
    remove(this.#filmContainer);
    remove(this.#filmContainerList);
    remove(this.#loadingComponent);

    this.#filmCards.forEach((filmCard) => filmCard.destroy());
    this.#filmCards = [];
  };

  #handleCardChange = (updateType, movieId) => {
    if(updateType === UpdateType.INIT) {
      this.#isLoading = false;
      this.#isReloaded = true;
      remove(this.#loadingComponent);
      this.init();
    } else {
      this.#removeFilmContainer();
      if (updateType === UpdateType.PATCH) {
        this.#isReloaded = true;
      } else {
        this.#isReloaded = false;
      }
      this.init();
      if(this.#filmCards.findIndex((filmCard) => (filmCard.movie.id === movieId && filmCard.container === 'main')) === -1) {
        let invicibleFilmCard = [...this.#movieModel.movies];
        invicibleFilmCard = invicibleFilmCard.filter((movie) => movie.id === movieId);
        this.#renderCards(invicibleFilmCard, this.#filmContainerList, 'main', 'popup');
      }
      if(updateType === UpdateType.MAJOR) {
        const popup = this.#filmCards.find((filmCard) => (filmCard.movie.id === movieId && filmCard.container === 'main'));
        if(popup) {
          popup.openPopup();
        }
      }
    }
  };

  #popupDelete =() => {
    const filmCardPopup = this.#filmCards.find((filmCard) => filmCard.isPopupOpened);
    if (filmCardPopup) {
      remove(filmCardPopup.filmInfoPopup);
      filmCardPopup.changeIsPopupOpened(false);
    }
  };
}
