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

            //function to report daily scores
            //by default, submit the user's pledge.
            //otherwise, provide input to submit his own score



        });

        //Get the list of all signed up users and their scores
        var userEndpoint = firebase.database().ref().child("users");
        $scope.userList = $firebaseArray(userEndpoint);

        //tally total scores call $loaded() because async callback -- make sure entire array is loaded before reducing
        $scope.userList.$loaded().then(function (x) {
            $scope.totalPages = x.reduce(function (i, user) {
                return i + parseInt(user.pages);
            }, 0);
        });

        $scope.otherMode = false;


        //dummy confirmation, data is actualy bound and live at the endpoint.
        $scope.showConfirmation = function (pages) {
            //Flash.create('success', "Thank you for pledging to read " + pages + " of Srila Prabhupada's books a day.");
        };


        $scope.otherAmount = function () {
            //User read some other amount than the pledge
            //Make the other input available and hide the pledge window.
            $scope.otherMode = true;

        }

        $scope.reportDailyScore = function () {
            var dailyScoresEndpoint = firebase.database().ref().child("daily");
            var dateString = (new Date()).toISOString().slice(0, 10).replace(/-/g, "")

            var _user = Auth.$getAuth();
            var _userInfo = $firebaseObject(firebase.database().ref().child("users/" + _user.uid));
        
            _userInfo.$loaded().then(function (x){
                console.log(x.pages);
                var dailyScoresObject = $firebaseObject(dailyScoresEndpoint.child(dateString).child(_user.uid));
                dailyScoresObject.pages = x.pages;
                dailyScoresObject.user = _user.uid;
                dailyScoresObject.$save().then(function (ref) {
                    console.log("Success")
                }, function (error) {
                    console.log("Error:", error);
                });
                
            })
            
            
            //check to see if the other box has anything, if so, take that value, otherwise, pages will be read from the user pledge
            //            var pages;
            //            if $scope.other.pages != null and !isNaN($scope.other.pages){
            //                pages = $scope.other.pages;
            //            }else{
            //                pages = _userInfo.pages;
            //            }


            //write to endpoint indexed by the user so multiple submissions will overwrite the same info, eg user can't submit more than 1 report per day
            
        

            
        }



    });