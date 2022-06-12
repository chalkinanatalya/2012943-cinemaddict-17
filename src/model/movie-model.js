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

  updateMovie = (updateType, movieId, userDetail) => {
    const movie = this.#movies.find((movies) => movies.id === movieId);
    movie.userDetails[userDetail] = !movie.userDetails[userDetail];
    this._notify(updateType, movieId);
  };

  addComment = (updateType, movieId, comment) => {
    const movie = this.#movies.find((movies) => movies.id === movieId);
    this.#comments.push(comment);
    movie.comments.push(comment.id);
    this._notify(updateType, movieId);
  };

  deleteComment = (updateType, movieId, commentId) => {
    const movie = this.#movies.find((movies) => movies.id === movieId);
    this.#comments.splice(this.#comments.findIndex((comment) => comment === commentId), 1);
    movie.comments.splice(movie.comments.findIndex((comment) => comment === commentId), 1);
    this._notify(updateType, movieId);
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
