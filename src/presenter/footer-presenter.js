import {render} from '../framework/render.js';
import FooterInfoView from '../view/footer-view.js';

export default class FooterPresenter {
  #movieModel = null;
  #footerContainer = null;

  #footerComponent = null;

  constructor(footerContainer, movieModel) {
    this.#footerContainer = footerContainer;
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#footerComponent = new FooterInfoView(this.#movieModel.movies.length);
    render(this.#footerComponent, this.#footerContainer);
  };
}
