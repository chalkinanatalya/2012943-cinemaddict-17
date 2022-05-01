import {getRandomInteger, getRandomSubjects, getRandomDate} from '../utils.js';
import {POSTERS, MOCKTEXTLONG, MOCKTEXTSHORT} from '../const.js';

const getRandomTime = () => {
  const hours = getRandomInteger(0, 12);
  const minutes = getRandomInteger(0, 59);

  return {
    hours, minutes
  };

};

export const generateMovie = (commentsList) => (
  {
    id: getRandomInteger(1, 1000),
    comments: commentsList,
    filmInfo: {
      title: MOCKTEXTLONG,
      alternativeTitle: MOCKTEXTLONG,
      totalRaiting: getRandomInteger(0, 10),
      poster: getRandomSubjects(POSTERS),
      ageRaiting: `${getRandomInteger(0, 18)}+`,
      director: MOCKTEXTSHORT,
      writers: [MOCKTEXTSHORT],
      actors: [MOCKTEXTSHORT],
      release: {
        date: getRandomDate(),
        releaseCountry: MOCKTEXTSHORT,
      },
      runTime: `${getRandomTime().hours}h ${getRandomTime().minutes}m`,
      genre: [MOCKTEXTSHORT],
      description: MOCKTEXTLONG
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: getRandomDate(),
      favorite: Boolean(getRandomInteger(0, 1)),
    }

  }

);


