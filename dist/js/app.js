(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
brunch = angular.module('Brunch', ['firebase', 'ui.router']);

brunch.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: '/templates/home.html'
  });

  $stateProvider.state('recipes', {
    url: '/recipes',
    controller: 'RecipesCtrl',
    templateUrl: '/templates/recipes.html'
  });

  $stateProvider.state('admin', {
    url: '/admin',
    controller: 'AdminCtrl',
    templateUrl: '/templates/admin.html'
  });


}]);


brunch.controller('HomeCtrl', ['$scope', 'Arrays', '$location', '$anchorScroll', function($scope, Arrays, $location, $anchorScroll) { 
  $scope.brunchList = Arrays.brunchItems;
  $scope.boozeList = Arrays.boozeItems;
  $scope.pairingList = Arrays.pairingItems;
    
      

  $scope.searchBrunch = function(userInput) {
    $scope.theBrunchItem = [];
    $scope.drinkMatches = [];
    $scope.foundDrinkPairings = [];
    $scope.thePairedDrinks = [];
    $scope.thePairedFoods = [];  
    $scope.boozeSearchName = true; // if user searched for booze item prior to brunch search this will hide what they searched for
    $scope.brunchSearchName = false; // this shows what brunch item the user searched for
     var doesExist = false;
   
    
    //get UID of queried brunch item
    $scope.brunchList.$loaded(
      function() {
        for (var i = 0; i < $scope.brunchList.length; i++) {
          if ($scope.brunchList[i].name.toLowerCase() == userInput.toLowerCase()) {
            $scope.brunchItemID = $scope.brunchList[i]["$id"];
            $scope.theBrunchItem.push($scope.brunchList[i]);
            $scope.foodName = " "; 
            doesExist = true;
          } 
        };
        //if searched item does not exist show a message that item was not found  
        if (doesExist == false) {
          return $scope.notFound = true;
        }

        //if searched item does exit find pairing match
        else  {
        $scope.notFound = false;
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
      $scope.brunchSearchName = true; // if user searched for brunch item prior to booze search this hides what they searched for
      $scope.boozeSearchName = false; // this shows what booze item the user searched for
      var doesExist = false;
     

      //get UID of queried brunch item
    $scope.boozeList.$loaded(
      function() {
        for (var i = 0; i < $scope.boozeList.length; i++) {
          if ($scope.boozeList[i].name.toLowerCase() == userInput.toLowerCase()) {
            $scope.boozeItemID = $scope.boozeList[i]["$id"];
            $scope.theBoozeItem.push($scope.boozeList[i]);
            $scope.drinkName = " ";
            doesExist = true;
          }
        };

        //if searched item does not exist show a message that item was not found  
        if (doesExist == false) {
          return $scope.notFound = true;
        }

        //if searched item does exit find pairing match
        else {  
          $scope.notFound = false;
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
                      if($scope.foodMatches[i] == $scope.brunchList[j]["$id"]) {               
                        $scope.thePairedFoods.push($scope.brunchList[j]);
                      }
                    }
                  }
                }
              )
              return $scope.show = true;
            }
          )
        }
      }
    ); 
  };



  
  $scope.searchAgain = function() {
    return $scope.show = false;
  };
  


}]);



brunch.controller('RecipesCtrl', ['$scope', 'Arrays', function($scope, Arrays) {
  $scope.brunchList = Arrays.brunchItems;
  $scope.boozeList = Arrays.boozeItems;
  $scope.pairingList = Arrays.pairingItems;

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