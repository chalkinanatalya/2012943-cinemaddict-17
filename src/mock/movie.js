import {getRandomInteger, getRandomSubjects, getRandomDate} from '../utils.js';
import {POSTERS, MOCKTEXTLONG, MOCKTEXTSHORT} from '../const.js';
import { nanoid } from 'nanoid';


export const generateMovie = (commentsList) => (
  {
    id: `s${nanoid()}`,
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
      runTime: 500,
      genre: [MOCKTEXTSHORT],
      description: MOCKTEXTLONG
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: false,
      watchingDate: getRandomDate(),
      favorite: false,
    }

  }

);


