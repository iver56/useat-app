angular.module('useatApp.controllers')
  .controller('FavoritesCtrl', function ($scope, $state, FavoriteService, GeolocationService, apiUrl, $http, RoomService) {
    $scope.state = 'INITIALIZING';

    $scope.getRooms = function() {
      var favorites = FavoriteService.getFavorites();
      if (favorites.length == 0) {
        $scope.state = 'NO_FAVORITES';
        $scope.rooms = [];
      } else {
        $scope.state = 'FINDING_LOCATION';

        GeolocationService.getCurrentPosition().then(function (currentPosition) {
          $scope.state = 'LOADING_ROOMS';

          var url = apiUrl + "/rooms/favorites/?ids=" + favorites.join(',')
            + "&lat=" + currentPosition.coords.latitude
            + "&lon=" + currentPosition.coords.longitude;

          $http.get(url)
            .success(function (data) {
              $scope.rooms = data;
              $scope.state = 'LOADED';
            })
            .error(function (data) {
              $scope.state = 'LOAD_ROOMS_ERROR';
            })
            .finally(function() {
              $scope.$broadcast('scroll.refreshComplete');
            });

        }, function () {
          $scope.state = 'GEOLOCATION_ERROR';
        });
      }
    };

    $scope.goToRoom = function(room) {
      RoomService.room = room;
      $state.go('tab.roomFavorite-detail', {roomId: room.id});
    };

    $scope.$on("$ionicView.beforeEnter", function() {
      $scope.getRooms();
    });

  });
