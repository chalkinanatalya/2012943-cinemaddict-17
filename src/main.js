import UserRank from '../src/view/user-rank-view.js';
import Menu from '../src/view/menu-view.js';
import Sort from '../src/view/sort-view.js';
import FooterInfo from '../src/view/footer-info';
import {render} from './render.js';
import ContentPresenter from './presenter/content-presenter.js';

const siteHeaderPart = document.querySelector('.header');
const siteMainPart = document.querySelector('.main');
const siteFooterPart = document.querySelector('.footer');

const contentPresenter = new ContentPresenter();

render(new UserRank(), siteHeaderPart);
render(new Menu(), siteMainPart);
render(new Sort(), siteMainPart);
render(new FooterInfo, siteFooterPart);

contentPresenter.init(siteHeaderPart, siteMainPart, siteFooterPart);


