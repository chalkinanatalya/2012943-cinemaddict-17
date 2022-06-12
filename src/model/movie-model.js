import { generateMovie } from '../mock/movie';
import { generateComment } from '../mock/comment.js';

import {getRandomInteger} from '../utils.js';
import Observable from '../framework/observable.js';

export default class MovieModel extends Observable {
  #comments = Array.from({length: 200}, generateComment);
  commentsId = this.comments.reduce((acc, { id }) => {
    acc.push(id);
    return acc;
  }, []);

  #movies = Array.from({length: 12}, (index) => {
    const commentsList = [];

    for(let i = 0; i < this.commentsId.length; i++) {
      if(this.commentsId[i] !== -1 && commentsList.length < 20) {
        if(index !== 4) {
          if(getRandomInteger(0, 20) === 1) {
            commentsList.push(this.commentsId[i]);
            this.commentsId[i] = -1;
          }
        } else {
          commentsList.push(this.commentsId[i]);
          this.commentsId[i] = -1;
        }
      }
    }
    return generateMovie(commentsList);
  });

  updateMovie = (updateType, movieUpdate) => {
    const movieIndex = this.#movies.findIndex((movie) => movie.id === movieUpdate.id);

    this.#movies = [
      ...this.#movies.slice(0, movieIndex),
      movieUpdate,
      ...this.#movies.slice(movieIndex + 1)
    ];
    this._notify(updateType, movieUpdate.id);
  };

  addComment = (updateType, movieUpdate, commentUpdate) => {
    const movieIndex = this.#movies.findIndex((movie) => movie.id === movieUpdate.id);

    this.#movies = [
      ...this.#movies.slice(0, movieIndex),
      movieUpdate,
      ...this.#movies.slice(movieIndex + 1)
    ];
    this.#comments = [ ...this.#comments, commentUpdate];
    this._notify(updateType, movieUpdate.id);
  };

  deleteComment = (updateType, movieUpdate, commentDelete) => {
    const movieIndex = this.#movies.findIndex((movie) => movie.id === movieUpdate.id);
    const commentIndex = this.#comments.findIndex((comment) => comment.id === commentDelete.id);

    this.#movies = [
      ...this.#movies.slice(0, movieIndex),
      movieUpdate,
      ...this.#movies.slice(movieIndex + 1)
    ];
    this.#comments = [
      ...this.#comments.slice(0, commentIndex),
      ...this.#comments.slice(commentIndex + 1)
    ];
    this._notify(updateType, movieUpdate.id);
  };

  get movies () {
    return this.#movies;
  }

  get comments() {
    return this.#comments;
  }

  calculateValues = (param) => {
    let count = 0;
    for(const movie of this.movies) {
      if(movie.userDetails[param]) {
        count++;
      }
    }
    return count;
  };
}
