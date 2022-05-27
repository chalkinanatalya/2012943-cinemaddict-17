import AbstractView from '../framework/view/abstract-stateful-view.js';

const createFooterStatisticsTemplate = () => (
  '<p>130 291 movies inside</p>'
);

export default class FooterInfoView extends AbstractView {
  get template() {
    return createFooterStatisticsTemplate();
  }
}
