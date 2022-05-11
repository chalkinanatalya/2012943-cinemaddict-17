import FilmContainer from '../view/film-container-view.js';
import {render, remove} from '../framework/render.js';
import FilmContainerList from '../view/film-container-list-view.js';
import FilmCard from '../view/film-card-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';
import Menu from '../view/menu-view.js';
import NoFilmView from '../view/no-film-view.js';

const CARD_OUTPUT_AT_ONCE = 5;
const BODY = document.querySelector('body');

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
  #renderOutputFilmCount = CARD_OUTPUT_AT_ONCE;

  constructor(headerContainer, mainContainer, movieModel, footerContainer) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#footerContainer = footerContainer;
  }

  init = () => {
    this.#filmCards = [...this.#movieModel.movies];
    this.#commentContainer = [...this.#movieModel.comments];

    this.#renderMenu();
    this.#renderMovieContainer();
    this.#renderTopRated();
    this.#renderMostCommented();
  };

  #handleShowMoreButtonClick = () => {
    const filmCards = this.#filmCards
      .slice(this.#renderOutputFilmCount, this.#renderOutputFilmCount + CARD_OUTPUT_AT_ONCE);
    this.#renderCard(filmCards,
      this.#filmContainerList);

    this.#renderOutputFilmCount += CARD_OUTPUT_AT_ONCE;

    if(this.#renderOutputFilmCount >= this.#filmCards.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };


  #renderPopup = (filmCard) => {
    const filmInfoPopup = new FilmInfoPopup(filmCard.movie, this.#commentContainer);

    const setListeners = () => {
      const closePopup = () => {
        BODY.classList.remove('hide-overflow');
        remove(filmInfoPopup);
      };

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          closePopup();
        }
      };

      document.removeEventListener('keydown', onEscKeyDown);
      filmInfoPopup.hidePopupClickHandler(closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const openPopup = () => {
      BODY.classList.add('hide-overflow');
      render(filmInfoPopup, this.#footerContainer);
      setListeners();
    };

    filmCard.showPopupClickHandler(openPopup);

  };

  #renderCard = (cardList, place) => {
    for(let i = 0; i < cardList.length; i++) {
      const filmCard = new FilmCard(cardList[i]);
      render(filmCard, place.element.querySelector('.films-list__container'));
      this.#renderPopup(filmCard);
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

    this.#renderCard(filmCards, this.#filmContainerList);
    this.#renderShowMoreButton();
  };

  #renderTopRated = () => {
    const topRated = new TopRated();
    render(topRated, this.#filmContainer.element);
    this.#renderCard(this.#filmCards.slice(0, 2), topRated);
  };

  #renderMostCommented = () => {
    const mostCommented = new MostCommented();
    render(mostCommented, this.#filmContainer.element);
    this.#renderCard(this.#filmCards.slice(0, 2), mostCommented);
  };

}
