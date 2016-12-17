'use strict';

/**
 * @ngdoc function
 * @name dropadayApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dropadayApp
 */
angular.module('dropadayApp')
  .controller('MainCtrl', function ($scope, $firebaseObject) {
    var ref = firebase.database().ref().child("data");
    
    var syncObject = $firebaseObject(ref);
    
    syncObject.$bindTo($scope, "data");
    
  });
