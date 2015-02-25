angular.module('useatApp.controllers', [])

  .controller('FindRoomCtrl', function ($scope, $ionicModal, apiUrl, $http) {

    $scope.rooms = [
      {
        name: "G122",
        building_name: "Gamle elektro",
        capacity: 8
      },
      {
        name: "KJEL22",
        building_name: "Kjelhuset",
        capacity: 25
      },
      {
        name: "S21",
        building_name: "Sentralbygg 2",
        capacity: 20
      }
    ];

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
  })

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

  .controller('FavoritesCtrl', function ($scope, Friends) {
    $scope.friends = Friends.all();
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
  /*
   .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
   $scope.friend = Friends.get($stateParams.friendId);
   })
   */

  .controller('SettingsCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
