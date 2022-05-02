import FilmContainer from '../view/film-container-view.js';
import {render} from '../render.js';
import FilmContainerList from '../view/film-container-list-view.js';
import FilmCard from '../view/film-card-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';
import Menu from '../view/menu-view.js';
import {getRandomInteger} from '../utils.js';


export default class ContentPresenter {
  filmContainer = new FilmContainer();
  filmContainerList = new FilmContainerList();
  topRated = new TopRated();
  mostCommented = new MostCommented();
  menu = new Menu();

  insertCards = (obj, place, name, amount) => {
    for(let i = 0; i < amount; i++) {
      render(new FilmCard(obj[i]), place.getElement().querySelector(name));
    }
  };

  init = (headerContainer, mainContainer, movieModel, footerContainer) => {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
    this.movieModel = movieModel;
    this.footerContainer = footerContainer;
    this.movieContainer = [...this.movieModel.getMovies()];
    this.commentContainer = [...this.movieModel.getComments()];
    this.menu.watchlist = this.movieModel.calculateValues('watchlist');
    this.menu.alreadyWatched = this.movieModel.calculateValues('alreadyWatched');
    this.menu.favorite = this.movieModel.calculateValues('favorite');

    render(this.menu, this.mainContainer, 'beforebegin');
    render(this.filmContainer, this.mainContainer);
    render(this.filmContainerList, this.filmContainer.getElement());
    this.insertCards(this.movieContainer, this.filmContainerList,'.films-list__container', this.movieContainer.length);
    render(new ShowMoreButton(), this.filmContainerList.getElement());
    render(this.topRated, this.filmContainer.getElement());
    this.insertCards(this.movieContainer, this.topRated, '.films-list__container', 2);
    render(this.mostCommented, this.filmContainer.getElement());
    this.insertCards(this.movieContainer, this.mostCommented, '.films-list__container', 2);
    render(new FilmInfoPopup(this.movieContainer[getRandomInteger(0, this.movieContainer.length - 1)], this.commentContainer), this.footerContainer);

  };
}
