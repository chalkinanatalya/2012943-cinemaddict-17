import UserRank from '../src/view/user-rank-view.js';
import Sort from '../src/view/sort-view.js';
import FooterInfo from '../src/view/footer-info';
import {render} from './framework/render.js';
import ContentPresenter from './presenter/content-presenter.js';
import MovieModel from './model/movie-model.js';

const siteHeaderPart = document.querySelector('.header');
const siteMainPart = document.querySelector('.main');
const siteFooterPart = document.querySelector('.footer');

const movieModel = new MovieModel();
const contentPresenter = new ContentPresenter(siteHeaderPart, siteMainPart, movieModel, siteFooterPart);

render(new UserRank(), siteHeaderPart);
render(new Sort(), siteMainPart);
render(new FooterInfo, siteFooterPart);

contentPresenter.init();


