import AbstractView from '../framework/view/abstract-view.js';
import {FilterType, NoFilm} from '../const.js';

const createNoFilmViewTemplate = (message) => (
  `<section class="films-list">
    <h2 class="films-list__title">${message}</h2>
  </section>`
);

export default class NoFilmView extends AbstractView {
  #message = null;

  constructor(filterTYpe) {
    super();
    this.#message = this.#setMessage(filterTYpe);
  }

  #setMessage = (filterTYpe) => {
    let message = '';
    switch (filterTYpe) {
      case FilterType.ALL:
        message = NoFilm.ALL;
        break;
      case FilterType.WATCHLIST:
        message = NoFilm.WATCHLIST;
        break;
      case FilterType.ALREADYWATCHED:
        message = NoFilm.ALREADYWATCHED;
        break;
      case FilterType.FAVORITE:
        message = NoFilm.FAVORITE;
        break;
    }
    return message;
  };

  get template() {
    return createNoFilmViewTemplate(this.#message);
  }
}
