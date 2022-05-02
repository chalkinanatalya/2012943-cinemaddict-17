import { generateMovie } from '../mock/movie';
import { generateComment } from '../mock/comment.js';
import {getRandomInteger} from '../utils.js';

export default class MovieModel {
  comments = Array.from({length: 20}, generateComment);
  commentsId = Array.from(this.comments, (commentId) => commentId.id);
  movies = Array.from({length: 5}, (index) => {
    // eslint-disable-next-line prefer-const
    let commentsList = [];

    for(let i = 0; i < this.commentsId.length; i++) {
      if(this.commentsId[i] !== -1) {
        if(index !== 4) {
          if(getRandomInteger(0, 1)) {
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

  getMovies = () => this.movies;
  getComments = () => this.comments;

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
