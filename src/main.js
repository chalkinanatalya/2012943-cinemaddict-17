import MoviesApiService from '../service/movies-api-service.js';
import CommentsApiService from '../service/comments-api-service.js';

import UserRankPresenter from './presenter/user-rank-presenter.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import FooterPresenter from './presenter/footer-presenter.js';

import MovieModel from './model/movie-model.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';

const AUTHORIZATION = 'Basic k3erj4bjpdka';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderPart = document.querySelector('.header');
const siteMainPart = document.querySelector('.main');
const siteFooterPart = document.querySelector('.footer');

const movieModel = new MovieModel(new MoviesApiService(END_POINT, AUTHORIZATION), new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const sortModel = new SortModel();

const userRankPresenter = new UserRankPresenter(siteHeaderPart, movieModel);
const filterPresenter = new FilterPresenter(siteMainPart, movieModel, filterModel, sortModel);
const sortPresenter = new SortPresenter(siteMainPart, movieModel, filterModel, sortModel);
const contentPresenter = new ContentPresenter(siteMainPart, movieModel, filterModel, sortModel);
const footerPresenter = new FooterPresenter(siteFooterPart, movieModel);

userRankPresenter.init();
filterPresenter.init();
sortPresenter.init();
contentPresenter.init();
footerPresenter.init();
movieModel.init();
