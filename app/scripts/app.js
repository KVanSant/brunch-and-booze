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
            var brunchItemID = $scope.brunchList[i][0];
            console.log(brunchItemID);
            $scope.theBrunchItem = [];
            $scope.theBrunchItem.push($scope.brunchList[i]);
            console.log($scope.theBrunchItem);
          }
          
        };

        //using UID of brunch item, list all associated pairings and put into array
        $scope.pairingList.$loaded(
          function() {  
            for (var i = 0; i < $scope.pairingList.length; i++) {
              console.log($scope.pairingList[i]);
              if ($scope.pairingList[i].brunchItem == brunchItemID) {
                var foundPairings = [];
                foundPairings.push($scope.pairingList[i]);
                console.log(foundPairings);
               };
             };
          }
        );

        // get UIDs of all the drink that pair with brunch item
        // for (var i = 0; i < foundPairings.length; i++) {
        //   var drinkMatches = [];
        //   drinkMatches.push(foundPairings[i].boozeItem);
        // };



        // get the information for all the drinks that pair with brunch item
        // $scope.boozeList.$loaded(
        //   function() {  
        //     for (i = 0; i < drinkMatches.length; i++) {
        //       for (j = 0; j < $scope.boozeList.length; j++){
        //         if(drinkMatches[i] == $scope.boozeList[j][0]) {
        //           $scope.thePairedDrinks = [];
        //           $scope.thePairedDrinks.push(drinksList[j]);
        //           $scope.thePairedDrinks[0];
        //         };
        //       }
        //     }
        //   }
        // )

   

      }
    }
  );

}]);


brunch.factory('Arrays', ['$firebaseArray',  function($firebaseArray){
  var ref = new Firebase("https://brunch-and-booze.firebaseio.com/");
  var brunchRef = $firebaseArray(ref.child('brunch'));

    return {

      brunchItems: brunchRef,

      boozeItems: $firebaseArray(ref.child('booze')),

      pairingItems: $firebaseArray(ref.child('pairings')),
  
    }  
}]);