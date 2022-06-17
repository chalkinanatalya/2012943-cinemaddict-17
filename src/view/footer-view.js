import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (moviesAmount) => (
  `<p>${moviesAmount} movies inside</p>`
);

export default class FooterInfoView extends AbstractView {
  #moviesAmount = null;

  constructor(moviesAmount) {
    super();
    this.#moviesAmount = moviesAmount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#moviesAmount);
  }
}
