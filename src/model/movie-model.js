import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class MovieModel extends Observable {
  #moviesApiService = null;
  #commentsApiService = null;
  #movies = [];

  constructor(moviesApiService, commentsApiService) {
    super();
    this.#moviesApiService = moviesApiService;
    this.#commentsApiService = commentsApiService;
  }

  get movies () {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.fetchMovies();
      this.#movies = movies.map(this.#adaptMovieToClient);
    } catch(err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  };

  getComments = async (movieId) =>{
    let comments = [];
    try {
      comments = await this.#commentsApiService.getComments(movieId);
    } catch(err) {
      comments = [];
    }

    return comments;
  };

  updateMovie = async (updateType, movieUpdate) => {
    const movieIndex = this.#movies.findIndex((movie) => movie.id === movieUpdate.id);

    if (movieIndex === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(movieUpdate);
      const updatedMovie = this.#adaptMovieToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, movieIndex),
        updatedMovie,
        ...this.#movies.slice(movieIndex + 1)
      ];
      this._notify(updateType, updatedMovie.id);
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  };

  addComment = async (updateType, movieUpdate, commentUpdate) => {
    const movieIndex = this.#movies.findIndex((movie) => movie.id === movieUpdate.id);

    if (movieIndex === -1) {
      throw new Error('Can\'t add unexisting comment');
    }

    try {
      const response = await this.#commentsApiService.addComment(commentUpdate, movieUpdate);
      const updatedMovie = this.#adaptMovieToClient(response.movie);
      this.#movies = [
        ...this.#movies.slice(0, movieIndex),
        updatedMovie,
        ...this.#movies.slice(movieIndex + 1)
      ];
      this._notify(updateType, updatedMovie.id);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, movieUpdate, commentId) => {
    const movieIndex = this.#movies.findIndex((movie) => movie.id === movieUpdate.id);

    try {
      await this.#commentsApiService.deleteComment(commentId);
      this.#movies = [
        ...this.#movies.slice(0, movieIndex),
        movieUpdate,
        ...this.#movies.slice(movieIndex + 1)
      ];
      this._notify(updateType, movieUpdate.id);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptMovieToClient = (movie) => {
    const adaptedMovie = {
      ...movie,
      filmInfo: {
        ...movie.film_info,
        alternativeTitle: movie.film_info.alternative_title,
        totalRating: movie.film_info.total_rating,
        ageRating: movie.film_info.age_rating,
        release: {
          ...movie.film_info.release,
          date: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
          releaseCountry: movie.film_info.release.release_country,
        },
        runTime: movie.film_info.runtime,
      },
      userDetails: {
        ...movie.user_details,
        alreadyWatched: movie.user_details.already_watched,
        watchingDate: movie.user_details.watching_date,
      }
    };

    delete adaptedMovie.film_info;
    delete adaptedMovie.filmInfo.alternative_title;
    delete adaptedMovie.filmInfo.total_rating;
    delete adaptedMovie.filmInfo.age_rating;
    delete adaptedMovie.filmInfo.runtime;
    delete adaptedMovie.filmInfo.release.release_country;
    delete adaptedMovie.user_details;
    delete adaptedMovie.userDetails.already_watched;
    delete adaptedMovie.userDetails.watching_date;

    return adaptedMovie;
  };

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
