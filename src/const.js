const EMOTIONS = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_COMMENT',
  ADD_TASK: 'ADD_COMMENT',
  DELETE_TASK: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  ALREADYWATCHED: 'alreadyWatched',
  FAVORITE: 'favorite',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const NoFilm = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  ALREADYWATCHED: 'There are no watched movies now',
  FAVORITE: 'There are no favorite movies now',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {EMOTIONS, UserAction, UpdateType, FilterType, SortType, NoFilm, TimeLimit};
