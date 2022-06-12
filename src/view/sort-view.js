import AbstractView from '../framework/view/abstract-view.js';
import {makeActiveSort} from '../utils.js';
import {SortType} from '../const.js';

const createSortTemplate = (currentSort) => (
  ` <ul class="sort">
  <li><a href="#" class="sort__button ${makeActiveSort(currentSort, SortType.DEFAULT)}" data-sort="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${makeActiveSort(currentSort, SortType.DATE)}" data-sort="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${makeActiveSort(currentSort, SortType.RAITING)}" data-sort="${SortType.RAITING}">Sort by rating</a></li>
</ul>`
);

export default class SortView extends AbstractView {
  #currentSort = null;

  constructor(currentSortType) {
    super();
    this.#currentSort = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSort);
  }

  setSortByOption = (callback) => {
    this._callback.sortOptionClick = callback;
    this.element.querySelectorAll('.sort a').forEach((sortButton) => sortButton.addEventListener('click', this.#sortByOption));
  };

  #sortByOption = (evt) => {
    this._callback.sortOptionClick(evt.target.getAttribute('data-sort'));
  };
}
