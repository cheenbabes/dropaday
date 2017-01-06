'use strict';

/**
 * @ngdoc function
 * @name dropadayApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dropadayApp
 */
angular.module('dropadayApp')
    .controller('MainCtrl', function ($scope, $firebaseObject, Auth) {
        var ref = firebase.database().ref().child("users/");

        var syncObject = $firebaseObject(ref);

        syncObject.$bindTo($scope, "data");

        $scope.auth = Auth;
        $scope.auth.$onAuthStateChanged(function (firebaseUser) {
            $scope.firebaseUser = firebaseUser;
        });

        if ($scope.firebaseUser) {
            var query = Ref.child('users/' + firebaseUser.uid);
            $scope.thisUser = $firebaseObject(query);
            $scope.thisUser.pledge = 5
        }
    });