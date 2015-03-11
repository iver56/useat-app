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

  .service('FavoriteService', function() {
    this.favorites = [];
    this.addFavorite = function(room) {
      this.favorites.push(room);
      this.saveFavorites()
    };
    this.removeFavorite = function(room) {
      var index = this.favorites.indexOf(room);
      this.favorites.splice(index, 1);
      this.saveFavorites()
    };
    this.getFavorites = function() {
      return this.favorites;
    };
    this.saveFavorites = function() {
      simpleStorage.set('favorites', this.favorites)
    }
  })
;
