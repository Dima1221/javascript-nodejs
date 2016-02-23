var angular = require('angular');

/**
 * WARNING: must use @ngInject (@see https://github.com/olov/ng-annotate)
 * for resolve factories, otherwise uglify will break the script!
 * will not be auto-injected
 */
angular.module('profile').config(($locationProvider, $stateProvider, $urlRouterProvider) => {
  $locationProvider.html5Mode(true);

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('root', {
      abstract:    true,
      resolve:     {
        me: (Me) => Me.get()
      },
      templateUrl: "/profile/templates/partials/root",
      controller:  'ProfileRootCtrl'
    });

  var states = {
    'root.aboutme':       {
      url:   "/",
      title: 'Публичный профиль',
      views: {
        main:   {
          templateUrl: "/profile/templates/partials/aboutme",
          controller:  'ProfileAboutMeCtrl'
        },
        bottom: {
          template: `<course-feedback-list ng-if="me.teachesCourses && me.teachesCourses.length"/>`,
          controller:  'ProfileCourseFeedbackList'
        }
      }
    },
    'root.account':       {
      url:   '/account',
      title: 'Аккаунт',
      views: {
        main: {
          templateUrl: "/profile/templates/partials/account",
          controller:  'ProfileAccountCtrl'
        }
      }
    },
    'root.quiz':          {
      url:     '/quiz',
      title:   'Тесты',
      views:   {
        main: {
          templateUrl: "/profile/templates/partials/quiz",
          controller:  'ProfileQuizResultsCtrl'
        }
      },
      resolve: {
        quizResults: /*@ngInject*/ (QuizResults) => QuizResults.query()
      }
    },
    'root.subscriptions': {
      url:     '/subscriptions',
      title:   'Уведомления',
      views:   {
        main: {
          templateUrl: "/profile/templates/partials/subscriptions",
          controller:  'ProfileSubscriptionsCtrl'
        }
      },
      resolve: {
        newsletters: /*@ngInject*/ (Newsletters) => Newsletters.query()
      }
    },
    'root.orders':        {
      url:     '/orders',
      title:   'Заказы',
      views:   {
        main: {
          templateUrl: "/profile/templates/partials/orders",
          controller:  'ProfileOrdersCtrl'
        }
      },
      resolve: {
        orders: /*@ngInject*/ (Orders) => Orders.query()
      }
    },
    'root.courses':       {
      url:     '/courses',
      title:   'Курсы',
      views:   {
        main: {
          templateUrl: "/profile/templates/partials/courseGroups",
          controller:  'ProfileCourseGroupsCtrl'
        }
      },
      resolve: {
        courseGroups: /*@ngInject*/ (CourseGroups) => CourseGroups.query()
      }
    }
  };

  // enable all states, but show in tabs only those which have info
  for (var key in states) {
    $stateProvider.state(key, states[key]);
  }

});
