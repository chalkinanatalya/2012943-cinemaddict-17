import AbstractView from '../framework/view/abstract-stateful-view.js';

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

  setSortByDefault = (callback) => {
    this._callback.sortDefaultClick = callback;
    this.element.querySelector('.sort__button[data-sort="default"]').addEventListener('click', this.#sortByDefault);
  };

  setSortByDate = (callback) => {
    this._callback.sortDateClick = callback;
    this.element.querySelector('.sort__button[data-sort="date"]').addEventListener('click', this.#sortByDate);
  };


  setSortByRaiting = (callback) => {
    this._callback.sortRaitingClick = callback;
    this.element.querySelector('.sort__button[data-sort="raiting"]').addEventListener('click', this.#sortByRaiting);
  };

  #sortByDefault = () => {
    this._callback.sortDefaultClick();
  };

  #sortByDate = () => {
    this._callback.sortDateClick();
  };

  #sortByRaiting = () => {
    this._callback.sortRaitingClick();
  };
}


