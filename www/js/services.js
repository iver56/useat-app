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
    this.favorites = simpleStorage.get('favorites');
    if (!this.favorites) {
      this.favorites = [];
    }
    this.addFavorite = function(roomId) {
      this.favorites.push(roomId);
      this.saveFavorites()
    };
    this.removeFavorite = function(roomId) {
      var index = this.favorites.indexOf(roomId);
      this.favorites.splice(index, 1);
      this.saveFavorites()
    };
    this.getFavorites = function() {
      return this.favorites;
    };
    this.saveFavorites = function() {
      simpleStorage.set('favorites', this.favorites)
    };
    this.isFavorite = function(roomId) {
      if (this.favorites.indexOf(roomId) != -1) {
        return true;
      } else {
        return false;
      }
    };
  })
;
