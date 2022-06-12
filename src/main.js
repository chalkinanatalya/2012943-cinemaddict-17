import UserRankView from '../src/view/user-rank-view.js';
import FooterInfoView from '../src/view/footer-info.js';
import {render} from './framework/render.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import MovieModel from './model/movie-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';

const siteHeaderPart = document.querySelector('.header');
const siteMainPart = document.querySelector('.main');
const siteFooterPart = document.querySelector('.footer');

const movieModel = new MovieModel();
const filterModel = new FilterModel();
const sortModel = new SortModel();
const contentPresenter = new ContentPresenter(siteMainPart, movieModel, filterModel, sortModel);
const filterPresenter = new FilterPresenter(siteMainPart, movieModel, filterModel, sortModel);
const sortPresenter = new SortPresenter(siteMainPart, movieModel, filterModel, sortModel);

render(new UserRankView(), siteHeaderPart);
render(new FooterInfoView(), siteFooterPart);

contentPresenter.init();
filterPresenter.init();
sortPresenter.init();


