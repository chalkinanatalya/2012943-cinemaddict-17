import Observable from '../framework/observable.js';
import {SortType} from '../const.js';

export default class SortModel extends Observable {
  #sortType = SortType.DEFAULT;

  get sortType() {
    return this.#sortType;
  }

  setSort = (updateType, sortType) => {
    this.#sortType = sortType;
    this._notify(updateType, sortType);
  };
}
