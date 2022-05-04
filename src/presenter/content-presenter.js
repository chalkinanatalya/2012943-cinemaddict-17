import FilmContainer from '../view/film-container-view.js';
import {render} from '../render.js';
import FilmContainerList from '../view/film-container-list-view.js';
import FilmCard from '../view/film-card-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';
import Menu from '../view/menu-view.js';

export default class ContentPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #movieModel = null;
  #footerContainer = null;

  #filmContainer = new FilmContainer();
  #filmContainerList = new FilmContainerList();
  #showMoreButton = new ShowMoreButton();

  #topRated = new TopRated();
  #mostCommented = new MostCommented();


  constructor(headerContainer, mainContainer, movieModel, footerContainer) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#movieModel = movieModel;
    this.#footerContainer = footerContainer;
  }

  #insertCards = (place, name, amount) => {
    for(let i = 0; i < amount; i++) {
      const filmCard = new FilmCard(this.movieContainer[i]);
      render(filmCard, place.element.querySelector(name));
      this.#renderPopup(filmCard, i);
    }
  };

  init = () => {
    this.movieContainer = [...this.#movieModel.movies];
    this.commentContainer = [...this.#movieModel.comments];

    this.#renderMenu();
    this.#renderMovieContainer();
  };

  #renderPopup = (filmCard, i) => {
    const body = document.querySelector('body');
    const filmInfoPopup = new FilmInfoPopup(this.movieContainer[i], this.commentContainer);

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

  #renderCard = () => {
    this.#insertCards(this.#filmContainerList,'.films-list__container', this.movieContainer.length);
    this.#insertCards(this.#topRated, '.films-list__container', 2);
    this.#insertCards(this.#mostCommented, '.films-list__container', 2);
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
    render(this.#filmContainerList, this.#filmContainer.element);
    render(this.#showMoreButton, this.#filmContainerList.element);
    render(this.#topRated, this.#filmContainer.element);
    render(this.#mostCommented, this.#filmContainer.element);

    this.#renderCard();
  };

}
