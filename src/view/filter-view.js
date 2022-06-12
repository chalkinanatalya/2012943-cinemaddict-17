import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';
import {makeActiveFilter} from '../utils.js';

const createMenuTemplate = (currentFilter, filterList) => (

  `<nav class="main-navigation filter">
  <a href="#all" class="main-navigation__item ${makeActiveFilter(currentFilter, FilterType.ALL)}" data-filter="${FilterType.ALL}">All movies</a>
  <a href="#watchlist" class="main-navigation__item ${makeActiveFilter(currentFilter, FilterType.WATCHLIST)}" data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${filterList.watchlist}</span></a>
  <a href="#history" class="main-navigation__item ${makeActiveFilter(currentFilter, FilterType.ALREADYWATCHED)}" data-filter="${FilterType.ALREADYWATCHED}">History <span class="main-navigation__item-count">${filterList.alreadyWatched}</span></a>
  <a href="#favorites" class="main-navigation__item ${makeActiveFilter(currentFilter, FilterType.FAVORITE)}" data-filter="${FilterType.FAVORITE}">Favorites <span class="main-navigation__item-count">${filterList.favorite}</span></a>
  </nav>`
);

export default class FilterView extends AbstractView {
  #currentFilter = null;
  #filterList = {};

  constructor(currentFilterType, filterList) {
    super();
    this.#currentFilter = currentFilterType;
    this.#filterList = filterList;
  }

  get template() {
    return createMenuTemplate(this.#currentFilter, this.#filterList);
  }

  setFilterByOption = (callback) => {
    this._callback.filterOptionClick = callback;
    this.element.querySelectorAll('.filter a').forEach((filterButton) => filterButton.addEventListener('click', this.#filterByOption));
  };

  #filterByOption = (evt) => {
    this._callback.filterOptionClick(evt.target.getAttribute('data-filter'));
  };
}
