import FilmContainer from '../view/film-container-view.js';
import {render} from '../render.js';
import FilmContainerList from '../view/film-container-list-view.js';
import FilmCard from '../view/film-card-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import TopRated from '../view/top-rated.js';
import MostCommented from '../view/most-commented.js';
import FilmInfoPopup from '../view/film-info-popup-view.js';


export default class ContentPresenter {
  filmContainer = new FilmContainer();
  filmContainerList = new FilmContainerList();
  topRated = new TopRated();
  mostCommented = new MostCommented();

  insertCards = (amount, place, name) => {
    for(let i = 0; i < amount; i++) {
      render(new FilmCard(), place.getElement().querySelector(name));
    }
  };

  init = (headerContainer, mainContainer, footerContainer) => {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
    this.footerContainer = footerContainer;

    render(this.filmContainer, this.mainContainer);
    render(this.filmContainerList, this.filmContainer.getElement());
    this.insertCards(5, this.filmContainerList,'.films-list__container');
    render(new ShowMoreButton(), this.filmContainerList.getElement());
    render(this.topRated, this.filmContainer.getElement());
    this.insertCards(2, this.topRated, '.films-list__container');
    render(this.mostCommented, this.filmContainer.getElement());
    this.insertCards(2, this.mostCommented, '.films-list__container');
    render(new FilmInfoPopup(), this.footerContainer);
  };
}
