var Spinner = require('client/spinner');
var angular = require('./angular');

angular.module('progress', [])
  .directive('progressSpinner', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var options = scope.$eval(attrs.progressSpinner) || {};
        options.elem = element[0];

        var spinner = new Spinner(options);

        scope.$watch(attrs.progress, function(isLoading) {
          if (isLoading) {
            spinner.start();
          } else {
            spinner.stop();
          }
        });

      }
    };
  })
  .directive('progressOverlay', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var options = scope.$eval(attrs.progressOverlay) || {};

        var type = options.type || 'light';

        scope.$watch(attrs.progress, function(isLoading) {
          if (isLoading) {
            element.addClass('modal-overlay_' + type);
          } else {
            element.removeClass('modal-overlay_' + type);
          }
        });
      }
    };
  });