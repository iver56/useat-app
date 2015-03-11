angular.module('useatApp.controllers', [])

  .controller('RoomsCtrl', function($scope, $ionicModal, apiUrl, $http, $state, RoomService, GeolocationService) {

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
  })

  .controller('FavoritesCtrl', function ($scope, $state) {
    $scope.favoriteRooms = [
      {
        id: 1,
        name: "VE22",
        building_name: "Perleporten",
        capacity: 60
      },
      {
        id: 2,
        name: "R Zoo-2",
        building_name: "Realfagbygget",
        capacity: 12
      }
    ];
    $scope.goToFavoriteRoom = function(room) {
      $state.go('tab.roomFavorite-detail', {roomId: room.id})
    }
  })

  .controller('RoomDetailCtrl', function($scope, $stateParams, apiUrl, $http, RoomService, GeolocationService, $ionicLoading) {
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
        zoom: 16,
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
  })


  .controller('SettingsCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });


/*
 .controller('MapCtrl', function ($scope, Chats) {
 $scope.chats = Chats.all();
 $scope.remove = function (chat) {
 Chats.remove(chat);
 }
 })

 .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
 $scope.chat = Chats.get($stateParams.chatId);
 })
 */

