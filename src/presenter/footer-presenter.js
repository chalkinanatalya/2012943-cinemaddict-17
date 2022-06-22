import {render, replace, remove} from '../framework/render.js';
import FooterInfoView from '../view/footer-view.js';
import {UpdateType} from '../const.js';

export default class FooterPresenter {
  #movieModel = null;
  #footerContainer = null;

  #footerComponent = null;

  constructor(footerContainer, movieModel) {
    this.#footerContainer = footerContainer;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFooterComponent = this.#footerComponent;
    this.#footerComponent = new FooterInfoView(this.#movieModel.movies.length);

    if (prevFooterComponent === null) {
      render(this.#footerComponent, this.#footerContainer);
      return;
    }

    replace(this.#footerComponent, prevFooterComponent);
    remove(prevFooterComponent);
  };

  #handleModelEvent = (updateType) => {
    if(updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
