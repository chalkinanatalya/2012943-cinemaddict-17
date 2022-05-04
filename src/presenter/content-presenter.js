import FilmContainer from '../view/film-container-view.js';
import {render} from '../render.js';
import FilmContainerList from '../view/film-container-list-view.js';
import FilmCard from '../view/film-card-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';
import Menu from '../view/menu-view.js';
import NoFilmView from '../view/no-film-view.js';

const CARD_OUTPUT_AT_ONCE = 5;

export default class ContentPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #movieModel = null;
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


  #insertCards = (place, name, amount) => {
    for(let i = 0; i < amount; i++) {
      const filmCard = new FilmCard(this.#filmCards[i]);
      render(filmCard, place.element.querySelector(name));
      this.#renderPopup(filmCard, i);
    }
  };

  init = () => {
    this.#filmCards = [...this.#movieModel.movies];
    this.commentContainer = [...this.#movieModel.comments];

    this.#renderMenu();
    this.#renderMovieContainer();
    this.#renderTopRated();
    this.#renderMostCommented();
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#renderCard(this.#filmCards
      .slice(this.#renderOutputFilmCount, this.#renderOutputFilmCount + CARD_OUTPUT_AT_ONCE),
    this.#filmContainerList,'.films-list__container'
    );

    this.#renderOutputFilmCount += CARD_OUTPUT_AT_ONCE;

    if(this.#renderOutputFilmCount >= this.#filmCards.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderPopup = (filmCard, i) => {
    const body = document.querySelector('body');
    const filmInfoPopup = new FilmInfoPopup(this.#filmCards[i], this.commentContainer);

    const closePopup = (closeButton) => {
      body.classList.remove('.hide-owerflow');
      body.removeChild(closeButton.parentElement.parentElement.parentElement.parentElement);
    };

    const closePopupEsc = () => {
      body.classList.remove('.hide-owerflow');
      body.removeChild(filmInfoPopup.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopupEsc();
        document.removeEventListener('keydown', onEscKeyDown);
      }

    };

    const openPopup = () => {
      body.classList.add('.hide-owerflow');
      body.appendChild(filmInfoPopup.element);

      filmInfoPopup.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
        closePopup(evt.target);
      });

      document.addEventListener('keydown', onEscKeyDown);
    };

    filmCard.element.querySelector('.film-card__link').addEventListener('click', () => {
      openPopup();
    });

  };

  #renderCard = (cardList, place, name) => {
    for(let i = 0; i < cardList.length; i++) {
      const filmCard = new FilmCard(cardList[i]);
      render(filmCard, place.element.querySelector(name));
      this.#renderPopup(filmCard, i);
    }
  };

  #renderMenu = () => {
    const menu = new Menu();
    menu.watchlist = this.#movieModel.calculateValues('watchlist');
    menu.alreadyWatched = this.#movieModel.calculateValues('alreadyWatched');
    menu.favorite = this.#movieModel.calculateValues('favorite');

    render(menu, this.#mainContainer, 'beforebegin');
  };

  #renderMovieContainer = () => {
    render(this.#filmContainer, this.#mainContainer);

    if(this.#filmCards === []) {
      render(this.#noFilm, this.#filmContainer.element);
    } else {
      render(this.#filmContainerList, this.#filmContainer.element);
    }

    render(this.#showMoreButton, this.#filmContainerList.element);

    this.#renderCard(this.#filmCards.slice(0, CARD_OUTPUT_AT_ONCE), this.#filmContainerList,'.films-list__container');
    this.#showMoreButton.element.addEventListener('click', this.#handleShowMoreButtonClick);
  };

  #renderTopRated = () => {
    const topRated = new TopRated();
    render(topRated, this.#filmContainer.element);
    this.#insertCards(topRated, '.films-list__container', 2);
  };

  #renderMostCommented = () => {
    const mostCommented = new MostCommented();
    render(mostCommented, this.#filmContainer.element);
    this.#insertCards(mostCommented, '.films-list__container', 2);
  };

}
