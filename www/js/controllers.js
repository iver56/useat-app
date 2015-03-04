angular.module('useatApp.controllers', [])

  .controller('FindRoomCtrl', function ($scope, $ionicModal, apiUrl, $http, $state) {
    $http.get(apiUrl + "/rooms/").success(function(data) {
      $scope.rooms = data.results;
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

    $scope.goToRoom = function(roomId) {
      $state.go('tab.room-detail', {roomId: roomId});
    }
  })

  .controller('FavoritesCtrl', function ($scope) {
    $scope.favoriteRooms = [
      {
        name: "VE22",
        building_name: "Perleporten",
        capacity: 60
      },
      {
        name: "R Zoo-2",
        building_name: "Realfagbygget",
        capacity: 12
      }
    ];
  })

   .controller('RoomDetailCtrl', function($scope, $stateParams, apiUrl, $http) {
    $http.get(apiUrl + "/rooms/" + $stateParams.roomId + "/").success(function(data) {
      $scope.room = data;
      console.log(data)
    });
   })


  .controller('SettingsCtrl', function ($scope) {
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
