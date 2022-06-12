const POSTERS =['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg', 'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'];
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const MOCKTEXTLONG = 'lorem ipsum dolor sit amet, consectet';
const MOCKTEXTSHORT = 'sed augue';

const UserAction = {
  UPDATE_TASK: 'UPDATE_COMMENT',
  ADD_TASK: 'ADD_COMMENT',
  DELETE_TASK: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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
  RAITING: 'raiting',
};

export {POSTERS, EMOTIONS, MOCKTEXTLONG, MOCKTEXTSHORT, UserAction, UpdateType, FilterType, SortType};
