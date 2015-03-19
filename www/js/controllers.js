angular.module('useatApp.controllers', [])

  .controller('RoomsCtrl', function($scope, $ionicModal, apiUrl, $http, $state, RoomService, GeolocationService) {
    $scope.capacity = 0;

    $http.get(apiUrl + "/room_features/")
      .success(function(data) {
        $scope.features = data.results;
      });

    $scope.getRooms = function() {
      $scope.state = 'FINDING_LOCATION';

      GeolocationService.getCurrentPosition().then(function(currentPosition) {
        $scope.state = 'LOADING_ROOMS';

        var url = apiUrl + "/rooms/?lat=" + currentPosition.coords.latitude
          + "&lon=" + currentPosition.coords.longitude;

        $http.get(url)
          .success(function(data) {
            $scope.rooms = data.results;
            $scope.state = 'LOADED';
          })
          .error(function(data) {
            $scope.state = 'LOAD_ROOMS_ERROR';
          });

      }, function() {
        $scope.state = 'GEOLOCATION_ERROR';
      });
    };

    $scope.$on("$ionicView.beforeEnter", function() {
      $scope.getRooms();
    });

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.goToRoom = function(room) {
      RoomService.room = room;
      $state.go('tab.room-detail', {roomId: room.id});
    }

    $scope.capacityList = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 350, 400];
  })

  .controller('FavoritesCtrl', function ($scope, $state, FavoriteService, GeolocationService, apiUrl, $http, RoomService) {
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

  })

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
  })


  .controller('InformationCtrl', function($scope) {

  });
