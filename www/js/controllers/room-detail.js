angular.module('useatApp.controllers')
  .controller('RoomDetailCtrl', function($scope, $stateParams, apiUrl, $http, RoomService, GeolocationService, FavoriteService) {
    $scope.room = RoomService.room;

    $scope.state = 'FINDING_LOCATION';

    GeolocationService.getCurrentPosition().then(function (currentPosition) {
      $scope.state = 'LOADING_ROOMS';

      var url = apiUrl + "/rooms/" + $stateParams.roomId + "/?lat="
        + currentPosition.coords.latitude + "&lon=" + currentPosition.coords.longitude;

      $http.get(url)
        .success(function (room) {
          $scope.room = room;
          $scope.state = 'LOADED';
        })
        .error(function (data) {
          $scope.state = 'LOAD_ROOMS_ERROR';
        });

    }, function () {
      $scope.state = 'GEOLOCATION_ERROR';
    });

    $scope.toggleFavorite = function() {
      if ($scope.isFavorite()) {
        FavoriteService.removeFavorite($scope.room.id);
      } else {
        FavoriteService.addFavorite($scope.room.id);
      }
    };

    $scope.isFavorite = function() {
      return FavoriteService.isFavorite($scope.room.id);
    }
  });
