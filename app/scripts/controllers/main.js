'use strict';

/**
 * @ngdoc function
 * @name dropadayApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dropadayApp
 */
angular.module('dropadayApp')
    .controller('MainCtrl', function ($scope, $firebaseObject, Auth, firebase, $firebaseArray) {

        $scope.auth = Auth;

        $scope.auth.$onAuthStateChanged(function (firebaseUser) {
            $scope.firebaseUser = firebaseUser;

            console.log(firebaseUser)

            var userRef = firebase.database().ref().child("users/" + firebaseUser.uid);
            var syncPledge = $firebaseObject(userRef);
            syncPledge.$bindTo($scope, "pledge");

        });

        //TEST////////
        var ref = firebase.database().ref().child("data");
        var syncObject = $firebaseObject(ref);
        syncObject.$bindTo($scope, "data");
        /////////
    
    
        var userEndpoint = firebase.database().ref().child("users");
        var userList = $firebaseArray(userEndpoint);
    
        $scope.userList = userList;


    });