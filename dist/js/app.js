(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
brunch = angular.module('Brunch', ['firebase', 'ui.router', 'ngDialog']);

brunch.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: '/templates/home.html'
  });

  $stateProvider.state('admin', {
    url: '/admin',
    controller: 'AdminCtrl',
    templateUrl: '/templates/admin.html'
  });

}]);


brunch.controller('HomeCtrl', ['$scope', 'Arrays', '$location', '$anchorScroll', 'ngDialog', function($scope, Arrays, $location, $anchorScroll, ngDialog) {
  var ref = new Firebase("https://brunch-and-booze.firebaseio.com/");
  $scope.brunchList = Arrays.brunchItems;
  $scope.boozeList = Arrays.boozeItems;
  $scope.pairingList = Arrays.pairingItems;
  $scope.showRecipe = true;

  $scope.searchBrunch = function(userInput) {
    $scope.theBrunchItem = [];
    $scope.drinkMatches = [];
    $scope.foundDrinkPairings = [];
    $scope.thePairedDrinks = [];
    $scope.thePairedFoods = [];
    var doesExist = false;


    //get UID of queried brunch item
    $scope.brunchList.$loaded(
      function() {
        for (var i = 0; i < $scope.brunchList.length; i++) {
          if ($scope.brunchList[i].name.toLowerCase() == userInput.toLowerCase()) {
            $scope.brunchItemID = $scope.brunchList[i]["$id"];
            $scope.theBrunchItem.push($scope.brunchList[i]);
           doesExist = true;
          }
        };
        //if searched item does not exist show a message that item was not found
        if (doesExist == false) {
        return $scope.brunchDoesNotExist = true;
        }

        //if searched item does exit find pairing match
        else  {
          //using UID of brunch item, list all associated pairings and put into array
          $scope.pairingList.$loaded(
            function() {
              for (var i = 0; i < $scope.pairingList.length; i++) {
                if ($scope.pairingList[i].brunchItem == $scope.brunchItemID) {
                  $scope.foundDrinkPairings.push($scope.pairingList[i]);
                };
              };


              //get UIDs of all the drinks that pair with brunch item
              for (var i = 0; i < $scope.foundDrinkPairings.length; i++) {
                $scope.drinkMatches.push($scope.foundDrinkPairings[i].boozeItem);
              };


              // get the information for all the drinks that pair with brunch item
              $scope.boozeList.$loaded(
                function() {
                  for (i = 0; i < $scope.drinkMatches.length; i++) {
                    for (j = 0; j < $scope.boozeList.length; j++){
                      if($scope.drinkMatches[i] == $scope.boozeList[j]["$id"]) {
                        $scope.thePairedDrinks.push($scope.boozeList[j]);
                      }
                    }
                  }
                }
              )
              return $scope.show = true;
              return $scope.showRecipe = true;
            }
          );
        }
      }
    );
  };


  $scope.searchBooze = function(userInput) {
      $scope.theBoozeItem = [];
      $scope.foodMatches = [];
      $scope.foundFoodPairings = [];
      $scope.thePairedFoods = [];
      $scope.thePairedDrinks = [];
      var doesExist = false;



      //get UID of queried brunch item
    $scope.boozeList.$loaded(
      function() {
        for (var i = 0; i < $scope.boozeList.length; i++) {
          if ($scope.boozeList[i].name.toLowerCase() == userInput.toLowerCase()) {
            $scope.boozeItemID = $scope.boozeList[i]["$id"];
            $scope.theBoozeItem.push($scope.boozeList[i]);
            doesExist = true;
          }
        };

        //if searched item does not exist show a message that item was not found
        if (doesExist == false) {
        return $scope.boozeDoesNotExist = true;
        }

        //if searched item does exit find pairing match
        else {
          //using UID of brunch item, list all associated pairings and put into array
          $scope.pairingList.$loaded(
            function() {
              for (var i = 0; i < $scope.pairingList.length; i++) {
                if ($scope.pairingList[i].boozeItem == $scope.boozeItemID) {
                  $scope.foundFoodPairings.push($scope.pairingList[i]);
                };
              };


              //get UIDs of all the drinks that pair with brunch item
              for (var i = 0; i < $scope.foundFoodPairings.length; i++) {
                $scope.foodMatches.push($scope.foundFoodPairings[i].brunchItem);
              };


              // get the information for all the drinks that pair with brunch item
              $scope.brunchList.$loaded(
                function() {
                  for (i = 0; i < $scope.foodMatches.length; i++) {
                    for (j = 0; j < $scope.brunchList.length; j++){
                      if ($scope.foodMatches[i] == $scope.brunchList[j]["$id"]) {
                        $scope.thePairedFoods.push($scope.brunchList[j]);
                      }
                    }
                  }
                }
              )
              return $scope.show = true;
              return $scope.showRecipe = true;
            }
          )
        }
      }
    );
  };

  $scope.searchBrunchAndBooze = function(userInput){
    var doesExist = false;

        for (var i = 0; i < $scope.brunchList.length; i++) {
          for (var j = 0; j < $scope.boozeList.length; j++) {
            if ($scope.brunchList[i].name.toLowerCase() == userInput.toLowerCase()) {
              doesExist = true;
            } else if ($scope.boozeList[j].name.toLowerCase() == userInput.toLowerCase()) {
                doesExist = true;
            }
          } //second for closing
        }; //first for closing
        if (doesExist == false) {
          ngDialog.open({
                  template: '<div class="modal-header">\
                             <h3 class="modal-title">Oh no!</h3>\
                           </div>\
                           <div class="modal-body">\
                             <p>We do not have a pairing for that. Feel free to search again!</p>\
                           </div>\
                           <div class="modal-footer">\
                             <button class="btn btn-primary modal-button" ng-click="closeThisDialog()">Search Again</button>\
                           </div>',
               className: 'ngdialog-theme-default modal',
               plain: true
             });
        } else {
    console.log(doesExist);
  }

};

  $scope.showSelectedRecipe = function(pairing) {
    $scope.selectedPairing = pairing;
    return $scope.showRecipe = false;
  };

   $scope.searchAgain = function() {
    return $scope.show = false,
           $scope.showRecipe = true;
           $scope.itemName = " ";
  };


}]);






brunch.controller('AdminCtrl', ['$scope', 'Arrays', function($scope, Arrays) {
  $scope.brunchList = Arrays.brunchItems;
  $scope.boozeList = Arrays.boozeItems;
  $scope.pairingList = Arrays.pairingItems;

  $scope.items = ['Brunch', 'Booze'];
  $scope.selection = $scope.items[0];

  $scope.createBrunch = function() {
    Arrays.addFood($scope.name, $scope.image, $scope.ingredients, $scope.instructions, $scope.category);
  }

  $scope.createBooze = function() {
    Arrays.addDrink($scope.name, $scope.image, $scope.ingredients, $scope.instructions, $scope.category);
  }


}]);




brunch.factory('Arrays', ['$firebaseArray',  function($firebaseArray){
  var ref = new Firebase("https://brunch-and-booze.firebaseio.com/");
  var brunchRef = $firebaseArray(ref.child('brunch'));
  var boozeRef = $firebaseArray(ref.child('booze'));


    return {

      brunchItems: $firebaseArray(ref.child('brunch')),

      boozeItems: $firebaseArray(ref.child('booze')),

      pairingItems: $firebaseArray(ref.child('pairings')),

      addFood: function(name, image, ingredients, instructions, category) {
       brunchRef.$add({
          name: name,
          image: image,
          ingredients: ingredients,
          instructions: instructions,
          category: category
        });
       },

       addDrink: function(name, image, ingredients, instructions, category) {
        boozeRef.$add({
          name: name,
          image: image,
          ingredients: ingredients,
          instructions: instructions,
          category: category
        });
       }
    }
}]);

},{}]},{},[1]);