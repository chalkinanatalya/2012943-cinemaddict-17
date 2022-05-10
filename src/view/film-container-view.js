import AbstractView from '../framework/view/abstract-stateful-view.js';

const createFilmContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmContainer extends AbstractView {
  get template() {
    return createFilmContainerTemplate();
  }
}
