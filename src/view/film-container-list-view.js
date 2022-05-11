import AbstractView from '../framework/view/abstract-view.js';

const createFilmContainerListTemplate = () => (
  `<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container"></div>
  </section>`
);

export default class FilmContainerList extends AbstractView {
  get template() {
    return createFilmContainerListTemplate();
  }
}
