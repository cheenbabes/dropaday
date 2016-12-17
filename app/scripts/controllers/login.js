'use strict';

/**
 * @ngdoc function
 * @name dropadayApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the dropadayApp
 */
angular.module('dropadayApp')
  .controller('LoginCtrl', function ($scope, firebase, Auth) {
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser){
        $scope.firebaseUser = firebaseUser;
    });
    
    });
