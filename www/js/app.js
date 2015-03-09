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
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
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
    // Each state's controller can be found in controllers.js
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

      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/rooms');

  });
