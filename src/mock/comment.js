import {EMOTIONS, MOCKTEXTLONG, MOCKTEXTSHORT} from '../const.js';
import {getRandomDate, getRandomSubjects} from '../utils.js';
import { nanoid } from 'nanoid';

export const generateComment = () => (
  { id: nanoid(),
    author: MOCKTEXTSHORT,
    comment: MOCKTEXTLONG,
    date: getRandomDate(),
    emotion: getRandomSubjects(EMOTIONS)
  }
);


