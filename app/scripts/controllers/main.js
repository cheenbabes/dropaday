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
    
        //Gets the firebase User and allows user to make their pledge of pages
        $scope.auth.$onAuthStateChanged(function (firebaseUser) {
            $scope.firebaseUser = firebaseUser;

            var userRef = firebase.database().ref().child("users/" + firebaseUser.uid);
            var syncPledge = $firebaseObject(userRef);
            syncPledge.$bindTo($scope, "pledge");

        });

        ////////////////TEST////////
        var ref = firebase.database().ref().child("data");
        var syncObject = $firebaseObject(ref);
        syncObject.$bindTo($scope, "data");
        ////////////////////////////
    
        //Get the list of all signed up users and their scores
        var userEndpoint = firebase.database().ref().child("users");
        $scope.userList = $firebaseArray(userEndpoint);
    
        //tally total scores call $loaded() because async callback -- make sure entire array is loaded before reducing
        $scope.userList.$loaded().then(function(x) {
            $scope.totalPages = x.reduce(function (i, user){
                return i  + parseInt(user.pages);
            }, 0);
        });
    
    
//    console.log("pledge pages" + $scope.pledge.pages)
        
        //function to report daily scores
        //by default, submit the user's pledge.
        //otherwise, provide input to submit his own score
        //we should probably sanitize the input here as well
        $scope.reportDailyScore = function() {
            var dailyScoresEndpoint = firebase.database().ref().child("daily");
            var dateString = (new Date()).toISOString().slice(0,10).replace(/-/g,"")
            
            //this needs a real value!
            var pledgedPages = 20;
            
            //Some manipulation here to check for custom input
            
            //Add to array
            console.log("about to add to array");
            var dailyScoresArray = $firebaseArray(dailyScoresEndpoint.child(dateString));
            dailyScoresArray.$add({
                user: "firebaseUser",
                pages: pledgedPages,
                time: new Date()
            });
            
            console.log("Successfully added to array endpoint");
        }

        

    });