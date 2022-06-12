import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {UpdateType} from '../const.js';

export default class FilterPresenter {
  #mainContainer = null;

  #movieModel = null;
  #filterModel = null;
  #sortModel = null;

  #filterComponent = null;

  constructor(mainContainer, movieModel, filterModel, sortModel) {
    this.#mainContainer = mainContainer;

    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  get filter() {
    return [
      this.#movieModel.calculateValues('watchlist'),
      this.#movieModel.calculateValues('alreadyWatched'),
      this.#movieModel.calculateValues('favorite')
    ];
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.#filterModel.filterType, this.filter);
    this.#filterComponent.setFilterByOption(this.#handleFilterByOption);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#mainContainer, 'beforebegin');
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleFilterByOption = (filterType) => {
    if (this.#filterModel.filterType === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.PATCH, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
