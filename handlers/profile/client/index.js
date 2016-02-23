var angular = require('angular');
var notification = require('client/notification');
var moment = require('momentWithLocale');
var pluralize = require('textUtil/pluralize');

var profile = angular.module('profile', [
  'ui.router', 'ngResource', 'global403Interceptor', 'ajoslin.promise-tracker', 'progress', 'focusOn', 'ngMessages'
]);

require('./directive/profileField');
require('./directive/orderParticipants');
require('./directive/orderContact');
require('./directive/profilePhoto');
require('./directive/profilePassword');
require('./directive/profileAuthProviders');
require('./directive/dateValidator');
require('./directive/dateRangeValidator');
require('./directive/courseFeedbackList');

require('./factory/me');

require('./factory/quizResults');
require('./factory/orders');
require('./factory/newsletters');
require('./factory/courseGroups');

require('./config');

require('./controller/root');

require('./controller/orders');

require('./controller/courseGroups');

require('./controller/aboutme');
require('./controller/courseFeedbackList');

require('./controller/subscriptions');

require('./controller/quizResults');

require('./controller/account');


profile
  .filter('unsafe_html', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }])
  .filter('capitalize', () => function(str) {
    return str[0].toUpperCase() + str.slice(1);
  })
  .filter('longDate', () => function(date, offset) {
    date = moment(date);
    if (offset !== undefined) date = date.utcOffset(offset);
    return date.format('D MMMM YYYY в LT');
  })
  .filter('shortDate', () => function(date, offset) {
    date = moment(date);
    if (offset !== undefined) date = date.utcOffset(offset);
    return date.format('D MMM YYYY');
  })
  .filter('quizDuration', () => function(ms) {
    var seconds = Math.round(ms / 1000);
    return moment.duration(seconds, 'seconds').humanize();
  })
  .filter('pluralize', function() {
    return pluralize;
  })
  .filter('trust_html', function($sce){
    return function(text) {
      text = $sce.trustAsHtml(text);
      return text;
    };
  });




