angular.module('useatApp.controllers')
  .controller('RoomDetailCtrl', function($scope, $stateParams, apiUrl, $http, RoomService, GeolocationService, FavoriteService) {
    $scope.room = RoomService.room;

    $scope.state = 'FINDING_LOCATION';

    GeolocationService.getCurrentPosition().then(function (currentPosition) {
      $scope.state = 'LOADING_ROOMS';

      var url = apiUrl + "/rooms/" + $stateParams.roomId + "/?lat="
        + currentPosition.coords.latitude + "&lon=" + currentPosition.coords.longitude;

      $http.get(url)
        .success(function (data) {
          $scope.room = data;
          $scope.state = 'LOADED';
          getMap();
        })
        .error(function (data) {
          $scope.state = 'LOAD_ROOMS_ERROR';
        });

    }, function () {
      $scope.state = 'GEOLOCATION_ERROR';
    });

    function getMap() {
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
        center: myLatlng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var lat = $scope.room.position.coordinates[1];
      var lng = $scope.room.position.coordinates[0];
      map.setCenter(new google.maps.LatLng(lat, lng));
      var roomLocation = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        title: "Room Location"
      });

      $scope.map = map;
    }

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
