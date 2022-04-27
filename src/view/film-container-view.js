import { createElement } from '../render.js';

const createFilmContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmContainer {

  getTemplate() {
    return createFilmContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
