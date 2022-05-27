import UserRankView from '../src/view/user-rank-view.js';
import FooterInfoView from '../src/view/footer-info.js';
import {render} from './framework/render.js';
import ContentPresenter from './presenter/content-presenter.js';
import MovieModel from './model/movie-model.js';

const siteHeaderPart = document.querySelector('.header');
const siteMainPart = document.querySelector('.main');
const siteFooterPart = document.querySelector('.footer');

const movieModel = new MovieModel();
const contentPresenter = new ContentPresenter(siteHeaderPart, siteMainPart, movieModel, siteFooterPart);

render(new UserRankView(), siteHeaderPart);
render(new FooterInfoView(), siteFooterPart);

contentPresenter.init();


