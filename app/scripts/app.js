brunch = angular.module('Brunch', ['firebase', 'ui.router']);

brunch.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: '/templates/home.html'
  });
}]);

brunch.controller('HomeCtrl', ['$scope', function($scope, $firebaseArray) {
var ref = new Firebase("https://brunch-and-booze.firebaseio.com/");

}]);