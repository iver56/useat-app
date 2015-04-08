angular.module('useatApp.controllers')
  .controller('RoomsCtrl', function($scope, $ionicModal, apiUrl, $http, $state, RoomService, GeolocationService) {
    $scope.capacity = {min: 0};
    $scope.state = 'INITIALIZING';

    $http.get(apiUrl + "/room_features/")
      .success(function(data) {
        $scope.features = data.results;
      });

    $scope.getRooms = function() {
      $scope.state = 'FINDING_LOCATION';

      GeolocationService.getCurrentPosition().then(function(currentPosition) {
        $scope.state = 'LOADING_ROOMS';


        var url = apiUrl + "/rooms/?lat=" + currentPosition.coords.latitude
          + "&lon=" + currentPosition.coords.longitude
          + "&min_capacity=" + $scope.capacityList[$scope.capacity.min];

        if ($scope.features) {
          var featureIds = [];
          for (var i = 0; i < $scope.features.length; i++) {
            var feature = $scope.features[i];
            if (feature.checked) {
              featureIds.push(feature.id);
            }
          }
          if (featureIds.length > 0) {
            url += "&feature_ids=" + featureIds.join(",");
          }
        }

        $http.get(url)
          .success(function(data) {
            $scope.rooms = data.results;
            if ($scope.rooms.length == 0) {
              $scope.state = 'NO_ROOMS'
            } else {
              $scope.state = 'LOADED';
            }
          })
          .error(function(data) {
            $scope.state = 'LOAD_ROOMS_ERROR';
          })
          .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
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

    $scope.$on('modal.hidden', function() {
      $scope.getRooms();
    });

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.goToRoom = function(room) {
      RoomService.room = room;
      $state.go('tab.room-detail', {roomId: room.id});
    };

    $scope.capacityList = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 350, 400];
  });
