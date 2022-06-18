import ApiService from '../src/framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MoviesApiService extends ApiService {
  async fetchMovies() {
    const response = await this._load({ url: 'movies' });
    return ApiService.parseResponse(response);
  }

  updateMovie = async (movie) => (
    await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    }).then(ApiService.parseResponse)
  );

  #adaptToServer = (movie) => {
    const adaptedMovie = {
      ...movie,
      'film_info': {
        ...movie.filmInfo,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'total_rating': movie.filmInfo.totalRating,
        'age_rating': movie.filmInfo.ageRating,
        release: {
          ...movie.filmInfo.release,
          date: movie.filmInfo.release.date instanceof Date ? movie.filmInfo.release.date.toISOString() : null,
          'release_country': movie.filmInfo.release.releaseCountry,
        },
        runtime: movie.filmInfo.runTime,
      },
      'user_details': {
        ...movie.userDetails,
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate,
      }
    };

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.film_info.alternativeTitle;
    delete adaptedMovie.film_info.totalRating;
    delete adaptedMovie.film_info.ageRating;
    delete adaptedMovie.film_info.runTime;
    delete adaptedMovie.film_info.release.releaseCountry;
    delete adaptedMovie.userDetails;
    delete adaptedMovie.user_details.alreadyWatched;
    delete adaptedMovie.user_details.watchingDate;
    return adaptedMovie;
  };
}
