ionic.Platform.isIE = function() {
  return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
};

angular.module(
  'useatApp',
  [
    'ionic',
    'useatApp.controllers',
    'useatApp.services',
    'useatApp.directives'
  ]
)
  .run(function($ionicPlatform, $rootScope, $location) {
    $ionicPlatform.ready(function() {
      if (ionic.Platform.isIE()) {
        setTimeout(function() {
          document.body.className += ' platform-ie';
        }, 10);
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, next, current) {
      var shouldRedirectToHome = !$rootScope.isfirstStateChangeDone && $location.url() !== 'tab.rooms';
      $rootScope.isfirstStateChangeDone = true;
      if (shouldRedirectToHome) {
        //App is reloaded and the history stack is gone. Let's redirect to home.
        return $location.path('/tab/rooms');
      }
    });
  })

  .constant('apiUrl', 'http://useat-api.iver.io')

  .config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      .state('tab.rooms', {
        url: '/rooms',
        views: {
          'tab-rooms': {
            templateUrl: 'templates/tab-rooms.html',
            controller: 'RoomsCtrl'
          }
        }
      })

      .state('tab.room-detail', {
        url: '/rooms/:roomId',
        views: {
          'tab-rooms': {
            templateUrl: 'templates/room-detail.html',
            controller: 'RoomDetailCtrl'
          }
        }
      })

      .state('tab.favorites', {
        url: '/favorites',
        views: {
          'tab-favorites': {
            templateUrl: 'templates/tab-favorites.html',
            controller: 'FavoritesCtrl'
          }
        }
      })

      .state('tab.roomFavorite-detail', {
        url: '/favorites/:roomId',
        views: {
          'tab-favorites': {
            templateUrl: 'templates/room-detail.html',
            controller: 'RoomDetailCtrl'
          }
        }
      })

      .state('tab.information', {
        url: '/information',
        views: {
          'tab-information': {
            templateUrl: 'templates/tab-information.html',
            controller: 'InformationCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/rooms');

  });

angular.module('useatApp.controllers', []);

if (ionic.Platform.isIE()) {
  angular.module('ionic')
    .factory('$ionicNgClick', ['$parse', '$timeout', function($parse, $timeout) {
      return function(scope, element, clickExpr) {
        var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

        element.on('click', function(event) {
          scope.$apply(function() {
            if (scope.clicktimer) return; // Second call
            clickHandler(scope, {$event: (event) });
            scope.clicktimer = $timeout(function() { delete scope.clicktimer; }, 1, false);
          });
        });

        // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
        // something else nearby.
        element.onclick = function(event) {};
      };
    }]);
}
