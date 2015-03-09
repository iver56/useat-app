angular.module('useatApp.services', [])

  .service('RoomService', function() {
    this.room = null;
  })
  .service('GeolocationService', function($q) {

    this.getCurrentPosition = function() {
      var deferred = $q.defer();

      navigator.geolocation.getCurrentPosition(function(currentPosition) {
        deferred.resolve(currentPosition);
      }, function(error) {
        deferred.reject(error);
      }, {
        maximumAge: 30000,
        timeout: 5000
      });

      return deferred.promise;
    };

  })
;
