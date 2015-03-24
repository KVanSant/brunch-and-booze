brunch = angular.module('Brunch', ['firebase', 'ui.router']);

brunch.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: '/templates/home.html'
  });
}]);


brunch.controller('HomeCtrl', ['$scope', 'Arrays', function($scope, Arrays) {
  $scope.brunchList = Arrays.brunchItems;
  $scope.boozeList = Arrays.boozeItems;
  $scope.pairingList = Arrays.pairingItems;
 
  
  $scope.brunchList.$loaded(
    function() {

      $scope.searchBrunch = function(userInput) {

        //get UID of queried brunch item
        for (var i = 0; i < $scope.brunchList.length; i++) {
          if ($scope.brunchList[i].name == userInput) {
            $scope.brunchItemID = $scope.brunchList[i]["$id"];
            $scope.theBrunchItem = [];
            $scope.theBrunchItem.push($scope.brunchList[i]);
          }   
        };

        //using UID of brunch item, list all associated pairings and put into array
        $scope.pairingList.$loaded(
          function() {  
            for (var i = 0; i < $scope.pairingList.length; i++) {
              if ($scope.pairingList[i].brunchItem == $scope.brunchItemID) {
                $scope.foundPairings = [];
                $scope.foundPairings.push($scope.pairingList[i]);
                console.log($scope.foundPairings);
              };
            };
         

            //get UIDs of all the drinks that pair with brunch item
            for (var i = 0; i < $scope.foundPairings.length; i++) {
              $scope.drinkMatches = [];
              $scope.drinkMatches.push($scope.foundPairings[i].boozeItem);
              console.log($scope.drinkMatches);
            };
         


          // get the information for all the drinks that pair with brunch item
          $scope.boozeList.$loaded(
            function() {  
              for (i = 0; i < $scope.drinkMatches.length; i++) {
                for (j = 0; j < $scope.boozeList.length; j++){
                  if($scope.drinkMatches[i] == $scope.boozeList[j]["$id"]) {
                    $scope.thePairedDrinks = [];
                    $scope.thePairedDrinks.push($scope.boozeList[j]);
                    console.log($scope.thePairedDrinks);
                  };
                }
              }
            }
          )
        }
      );
   

      }
    }
  );

}]);


brunch.factory('Arrays', ['$firebaseArray',  function($firebaseArray){
  var ref = new Firebase("https://brunch-and-booze.firebaseio.com/");

    return {

      brunchItems: $firebaseArray(ref.child('brunch')),

      boozeItems: $firebaseArray(ref.child('booze')),

      pairingItems: $firebaseArray(ref.child('pairings')),
  
    }  
}]);