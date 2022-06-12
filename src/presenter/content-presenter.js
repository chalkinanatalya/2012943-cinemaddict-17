import FilmCardPresenter from '../presenter/film-card-presenter.js';

import FilmContainer from '../view/film-container-view.js';
import FilmContainerList from '../view/film-container-list-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import NoFilmView from '../view/no-film-view.js';

import {dateComarison} from '../utils.js';
import {UpdateType, FilterType, SortType} from '../const.js';
import {render, remove} from '../framework/render.js';


const CARD_OUTPUT_AT_ONCE = 5;

export default class ContentPresenter {
  #mainContainer = null;
  #movieModel = null;
  #filterModel = null;
  #sortModel = null;

  #filmContainer = new FilmContainer();
  #filmContainerList = new FilmContainerList();
  #noFilm = new NoFilmView();
  #showMoreButton = new ShowMoreButton();

  #filmCardPresenter = [];
  #renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;
  #sortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(mainContainer, movieModel, filterModel, sortModel) {
    this.#mainContainer = mainContainer;

    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#movieModel.addObserver(this.#handleCardChange);
    this.#sortModel.addObserver(this.#handleCardChange);
    this.#filterModel.addObserver(this.#handleCardChange);
  }

  get movies() {
    let movies = [...this.#movieModel.movies];

    if (this.#filterModel.filterType !== FilterType.ALL) {
      this.#renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;
      this.#filterType = this.#filterModel.filterType;
      if(this.#filterType !== FilterType.ALL) {
        movies = movies.filter((movie) => movie.userDetails[this.#filterType]);
      }
    }

    if (this.#sortModel.sortType !== SortType.DEFAULT) {
      this.#renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;
      this.#sortType = this.#sortModel.sortType;
      movies = this.#sortCards(movies);
    }
    return movies;
  }

  init = () => {
    this.#handleRender();
  };

  #handleRender = () => {
    this.#renderMovieContainer();
    this.#renderTopRated();
    this.#renderMostCommented();
  };

  #handleShowMoreButtonClick = () => {
    let movies = this.movies;
    const moviesLength = movies.length;
    movies = movies.slice(this.#renderOutputFilmCount, this.#renderOutputFilmCount + CARD_OUTPUT_AT_ONCE);
    this.#renderCards(movies, this.#filmContainerList);

    this.#renderOutputFilmCount += CARD_OUTPUT_AT_ONCE;

    if(this.#renderOutputFilmCount >= moviesLength) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderCards = (movies, place) => {
    const renderPlace = place.element.querySelector('.films-list__container');
    for(let i = 0; i < movies.length; i++) {
      const filmCardPresenter = new FilmCardPresenter(movies[i], this.#movieModel.updateMovie, this.#movieModel.addComment, this.#movieModel.deleteComment, this.#popupDelete);
      this.#filmCardPresenter.push(filmCardPresenter);
      filmCardPresenter.init(renderPlace, this.#movieModel.comments);
    }
  };

  #sortCards = (movies) => {
    switch (this.#sortType) {
      case SortType.DEFAULT:
        return movies;
      case SortType.DATE:
        return movies.sort((firstDate, secondDate) => (dateComarison(firstDate.filmInfo.release.date, secondDate.filmInfo.release.date)) ? 1 : -1);
      case SortType.RAITING:
        return movies.sort((firstDate, secondDate) => (firstDate.filmInfo.totalRaiting < secondDate.filmInfo.totalRaiting) ? 1 : -1);
    }
  };

  #topFilter = (movies, filter) => {
    let filteredMovies = null;
    switch (filter) {
      case 'raiting':
        filteredMovies = movies.sort((firstMovie, secondMovie) => (firstMovie.filmInfo.totalRaiting < secondMovie.filmInfo.totalRaiting) ? 1 : -1);
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
    const movies = this.movies;
    render(this.#filmContainer, this.#mainContainer);

    if(!movies.length) {
      render(this.#noFilm, this.#filmContainer.element);
      return;
    }

    render(this.#filmContainerList, this.#filmContainer.element, 'afterbegin');

    this.#renderCards(movies.slice(0, this.#renderOutputFilmCount), this.#filmContainerList);
    if(movies.length > CARD_OUTPUT_AT_ONCE) {
      render(this.#showMoreButton, this.#filmContainerList.element);
      this.#renderShowMoreButton();
    }
  };

  #renderTopRated = () => {
    const movies = this.movies;

    const topRated = new TopRated();
    render(topRated, this.#filmContainer.element);
    this.#renderCards(this.#topFilter(movies, 'raiting'), topRated);
  };

  #renderMostCommented = () => {
    const movies = this.movies;

    const mostCommented = new MostCommented();
    render(mostCommented, this.#filmContainer.element);
    this.#renderCards(this.#topFilter(movies, 'comments'), mostCommented);
  };

  #removeFilmContainer = () => {
    remove(this.#filmContainer);
    remove(this.#filmContainerList);
    this.#filmCardPresenter.forEach((filmCard) => filmCard.destroy());
  };

  #handleCardChange = (updateType, movieId) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#removeFilmContainer();
        this.#handleRender();
        break;
      case UpdateType.MINOR:
        this.#removeFilmContainer();
        this.#handleRender();
        this.#filmCardPresenter.find((filmCard) => filmCard.movie.id === movieId).openPopup();
        break;
      case UpdateType.MAJOR:
        break;
    }
  };

  #popupDelete =() => {
    const filmCardPresenter = this.#filmCardPresenter.find((filmCard) => filmCard.isPopupOpened);
    if (filmCardPresenter) {
      remove(filmCardPresenter.filmInfoPopup);
      filmCardPresenter.changeIsPopupOpened(false);
    }
  };
}
