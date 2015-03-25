angular.module('useatApp.controllers')
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

        console.log($scope.capacity)

        var url = apiUrl + "/rooms/?lat=" + currentPosition.coords.latitude
          + "&lon=" + currentPosition.coords.longitude
          + "&min_capacity=" + $scope.capacityList[$scope.capacity];

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
      $scope.getRooms();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.goToRoom = function(room) {
      RoomService.room = room;
      $state.go('tab.room-detail', {roomId: room.id});
    };

    $scope.capacityList = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 350, 400];
  });
