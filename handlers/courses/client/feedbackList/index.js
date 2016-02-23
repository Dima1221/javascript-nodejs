var xhr = require('client/xhr');
var FeedbackLoader = require('../lib/feedbackLoader');
var pluralize = require('textUtil/pluralize');

function init(options) {

  let loader = new FeedbackLoader(options || window.FEEDBACK_LIST_INIT);

  let countElem = document.querySelector('[data-feedback-count]');

  loader.elem.addEventListener('feedbackChange', function(event) {
    countElem.hidden = false;

    countElem.children[0].innerHTML = event.detail.loader.total;
    countElem.children[1].innerHTML = pluralize(event.detail.loader.total, 'отзыв', 'отзыва', 'отзывов');
  });

  let form = document.querySelector('[data-feedback-form]');

  let teacherSelector = form.elements.teacherId;
  let starsSelector = form.elements.stars;

  teacherSelector.onchange = update;
  starsSelector.onchange = update;

  document.addEventListener('click', (e) => {
    let titleElem = e.target.closest('[data-stars-title]');
    if (!titleElem) return;
    starsSelector.value = titleElem.getAttribute('data-stars-title');
    update();
  });


  function update() {
    let filter = loader.filter;
    filter.teacherId = teacherSelector.value;
    filter.stars = starsSelector.value;
    loader.reset(filter);

    let activeStarsElem = document.querySelector('[data-stars-title].feedback-stat__item_active');
    if (activeStarsElem) {
      activeStarsElem.classList.remove('feedback-stat__item_active');
    }

    if (starsSelector.value) {
      document.querySelector(`[data-stars-title="${starsSelector.value}"]`).classList.add('feedback-stat__item_active');
    }
  }

}

module.exports = init;

if (window.FEEDBACK_LIST_INIT) {
  init();
}
