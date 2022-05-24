import FilmContainer from '../view/film-container-view.js';
import {render, remove} from '../framework/render.js';
import FilmContainerList from '../view/film-container-list-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import Menu from '../view/menu-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmCardPresenter from '../presenter/film-card-presenter.js';
import {reverse, findCards} from '../utils.js';

const CARD_OUTPUT_AT_ONCE = 5;

export default class ContentPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #movieModel = null;
  #commentContainer = null;
  #footerContainer = null;

  #filmContainer = new FilmContainer();
  #filmContainerList = new FilmContainerList();
  #noFilm = new NoFilmView();
  #showMoreButton = new ShowMoreButton();

  #filmCards = [];
  #filmCardsTopRated = [];
  #filmCardsMostCommented = [];
  #renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;

  constructor(headerContainer, mainContainer, movieModel, footerContainer) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#footerContainer = footerContainer;
  }

  init = () => {
    const movieCards = [...this.#movieModel.movies];
    for(let i = 0; i < movieCards.length; i++) {
      this.#filmCards[i] = new FilmCardPresenter(movieCards[i], this.#handleCardChange, this.#popupDelete);
      if(i < 2) {
        this.#filmCardsTopRated[i] = new FilmCardPresenter(movieCards[i], this.#handleCardChange, this.#popupDelete);
        this.#filmCardsMostCommented[i] = new FilmCardPresenter(movieCards[i], this.#handleCardChange, this.#popupDelete);
      }
    }

    this.#commentContainer = [...this.#movieModel.comments];

    this.#renderMenu();
    this.#renderMovieContainer();
    this.#renderTopRated();
    this.#renderMostCommented();
  };

  #handleShowMoreButtonClick = () => {
    const filmCards = this.#filmCards
      .slice(this.#renderOutputFilmCount, this.#renderOutputFilmCount + CARD_OUTPUT_AT_ONCE);
    this.#renderCards(filmCards,
      this.#filmContainerList);

    this.#renderOutputFilmCount += CARD_OUTPUT_AT_ONCE;

    if(this.#renderOutputFilmCount >= this.#filmCards.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderCards = (cardList, place) => {
    const renderPlace = place.element.querySelector('.films-list__container');
    for(let i = 0; i < cardList.length; i++) {
      cardList[i].init(renderPlace, this.#commentContainer);
    }
  };

  #renderMenu = () => {
    const menu = new Menu();
    menu.watchlist = this.#movieModel.calculateValues('watchlist');
    menu.alreadyWatched = this.#movieModel.calculateValues('alreadyWatched');
    menu.favorite = this.#movieModel.calculateValues('favorite');

    render(menu, this.#mainContainer, 'beforebegin');
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderMovieContainer = () => {
    render(this.#filmContainer, this.#mainContainer);
    const filmCards = this.#filmCards.slice(0, CARD_OUTPUT_AT_ONCE);
    const filmElement = this.#filmContainer.element;

    if(!this.#filmCards.length) {
      render(this.#noFilm, filmElement);
    } else {
      render(this.#filmContainerList, filmElement);
    }

    render(this.#showMoreButton, this.#filmContainerList.element);

    this.#renderCards(filmCards, this.#filmContainerList);
    this.#renderShowMoreButton();
  };

  #renderTopRated = () => {
    const topRated = new TopRated();
    render(topRated, this.#filmContainer.element);
    this.#renderCards(this.#filmCardsTopRated, topRated);
  };

  #renderMostCommented = () => {
    const mostCommented = new MostCommented();
    render(mostCommented, this.#filmContainer.element);
    this.#renderCards(this.#filmCardsMostCommented, mostCommented);
  };

  #handleCardChange = (movie, userDetail) => {
    const changedMovie = reverse(movie, userDetail);

    let isPopupOpened = false;
    if (findCards([this.#filmCards, this.#filmCardsTopRated, this.#filmCardsMostCommented], {searchType: 'popup', data: true}).length) {
      isPopupOpened = true;
    }

    findCards([this.#filmCards, this.#filmCardsTopRated, this.#filmCardsMostCommented], {searchType: 'id', data: movie.id}).forEach((card) => card.init(0, 0, changedMovie));
    if(isPopupOpened) {
      this.#filmCards.find((filmCard) => filmCard.movie.id === movie.id).openPopup();
    }
  };

  #popupDelete =() => {
    const oldPopup = findCards([this.#filmCards, this.#filmCardsTopRated, this.#filmCardsMostCommented], {searchType: 'popup', data: true});
    if(oldPopup[0]) {
      remove(oldPopup[0].filmInfoPopup);
      oldPopup[0].changeIsPopupOpened(false);
    }
  };

}
