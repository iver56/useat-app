angular.module('useatApp.directives', []).directive('placeDistance', function() {
  return {
    restrict: 'A',
    scope: {
      metres: "="
    },
    controller: function($scope, $element){
      $scope.Math = window.Math;
    },
    template: '{{ metres < 1000 ? Math.round(metres / 10) * 10 + " m" : (metres / 1000).toFixed(metres < 10000 ? 1 : 0).replace(".", ",") + " km" }}'
  };
});
