import {render, replace, remove} from '../framework/render.js';
import UserRankView from '../view/user-rank-view.js';
import {UpdateType} from '../const.js';

export default class UserRankPresenter {
  #headerContainer = null;
  #movieModel = null;

  #userRankComponent = null;

  get userRank() {
    const watchedMovies = this.#movieModel.calculateValues('alreadyWatched');
    if (watchedMovies > 0 && watchedMovies <= 10) {
      return 'Novice';
    } else if (watchedMovies > 10 && watchedMovies <= 20) {
      return 'Fan';
    } else if (watchedMovies > 20) {
      return 'Movie Buff';
    } else {
      return 0;
    }
  }

  constructor(headerContainer, movieModel) {
    this.#headerContainer = headerContainer;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    if(this.userRank) {
      const prevUserRankComponent = this.#userRankComponent;
      this.#userRankComponent = new UserRankView(this.userRank);

      if (prevUserRankComponent === null) {
        render(this.#userRankComponent, this.#headerContainer);
        return;
      }

      replace(this.#userRankComponent, prevUserRankComponent);
      remove(prevUserRankComponent);
    } else {
      remove(this.#userRankComponent);
      this.#userRankComponent = null;
    }
  };

  #handleModelEvent = (updateType) => {
    if(UpdateType.MINOR || updateType === UpdateType.MAJOR || updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
