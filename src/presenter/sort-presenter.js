import {render, replace, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import {UpdateType} from '../const.js';

export default class SortPresenter {
  #mainContainer = null;

  #sortModel = null;
  #movieModel = null;

  #sortComponent = null;

  constructor(mainContainer, movieModel, sortModel) {
    this.#mainContainer = mainContainer;

    this.#sortModel = sortModel;
    this.#movieModel = movieModel;

    this.#sortModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    if (this.#movieModel.movies.length) {
      const prevSortComponent = this.#sortComponent;

      this.#sortComponent = new SortView(this.#sortModel.sortType);
      this.#sortComponent.setSortByOption(this.#handleSortByOption);

      if (prevSortComponent === null) {
        render(this.#sortComponent, this.#mainContainer, 'beforebegin');
        return;
      }

      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    }
  };

  #handleSortByOption = (sortType) => {
    if (this.#sortModel.sortType === sortType) {
      return;
    }

    this.#sortModel.setSort(UpdateType.PATCH, sortType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
