'use strict';

/**
 * @ngdoc overview
 * @name dropadayApp
 * @description
 * # dropadayApp
 *
 * Main module of the application.
 */
var app = angular
    .module('dropadayApp', [
    'ngResource',
    'ngRoute',
    'firebase'
  ]);


app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);



app
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/account', {
                templateUrl: 'views/account.html',
                controller: 'AccountCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/pledge', {
              templateUrl: 'views/pledge.html',
              controller: 'PledgeCtrl',
              resolve:{
                  "currentAuth": ["Auth", function(Auth){
                      return Auth.$requireSignIn();
                  }]
              }
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.hashPrefix('');

        var config = {
            apiKey: "AIzaSyATzNL3BmeVl3J2ibY1JqwcBMsBeRkR9mQ",
            authDomain: "dropaday-1ed46.firebaseapp.com",
            databaseURL: "https://dropaday-1ed46.firebaseio.com",
            storageBucket: "dropaday-1ed46.appspot.com",
            messagingSenderId: "440966895707"
        };
        firebase.initializeApp(config);
    })
    .factory("Auth", ["$firebaseAuth",
        function ($firebaseAuth) {
            return $firebaseAuth();
}]);