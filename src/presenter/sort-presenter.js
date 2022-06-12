import {render, replace, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import {UpdateType} from '../const.js';

export default class SortPresenter {
  #mainContainer = null;

  #movieModel = null;
  #filterModel = null;
  #sortModel = null;

  #sortComponent = null;

  constructor(mainContainer, movieModel, filterModel, sortModel) {
    this.#mainContainer = mainContainer;

    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#sortModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView(this.#sortModel.sortType);
    this.#sortComponent.setSortByOption(this.#handleSortByOption);

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#mainContainer, 'beforebegin');
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
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
