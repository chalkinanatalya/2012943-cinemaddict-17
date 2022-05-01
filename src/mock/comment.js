import {EMOTIONS, MOCKTEXTLONG, MOCKTEXTSHORT} from '../const.js';
import {getRandomDate, getRandomSubjects, getRandomInteger} from '../utils.js';

export const generateComment = () => (
  { id: getRandomInteger(1, 99),
    author: MOCKTEXTSHORT,
    comment: MOCKTEXTLONG,
    date: getRandomDate(),
    emotion: getRandomSubjects(EMOTIONS)

  }
);


