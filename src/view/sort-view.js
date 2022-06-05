import AbstractView from '../framework/view/abstract-view.js';

const createSortTemplate = () => (
  ` <ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort="default">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort="date">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort="raiting">Sort by rating</a></li>
</ul>`
);

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortByOption = (callback) => {
    this._callback.sortOptionClick = callback;
    this.element.querySelectorAll('.sort a').forEach((sortButton) => sortButton.addEventListener('click', this.#sortByOption));
  };

  #sortByOption = (evt) => {
    this._callback.sortOptionClick(evt);
  };
}
