const POSTERS =['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg', 'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'];
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const MOCKTEXTLONG = 'lorem ipsum dolor sit amet, consectet';
const MOCKTEXTSHORT = 'sed augue';
const GENRE = ['Drama', 'Film-Noir', 'Mystery'];
const ACTORS = ['Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea'];
const WRITERS = ['Anne Wigton', 'Heinz Herald', 'Richard Weil'];
const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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

export {POSTERS, EMOTIONS, GENRE, ACTORS, WRITERS, MOCKTEXTLONG, MOCKTEXTSHORT, DESCRIPTION, UserAction, UpdateType, FilterType, SortType, NoFilm};
