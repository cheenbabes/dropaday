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

        //Hide other mode by default
        $scope.otherMode = false;

        //Gets the firebase User and allows user to make their pledge of pages
        Auth.$onAuthStateChanged(function (firebaseUser) {
            $scope.firebaseUser = firebaseUser;

            var userRef = firebase.database().ref().child("users/" + firebaseUser.uid);
            var syncPledge = $firebaseObject(userRef);
            syncPledge.$bindTo($scope, "pledge");

        });

        //Get the list of all signed up users and their scores but update it in real time via async 'on' call
        var userEndpoint = firebase.database().ref().child("users");
        userEndpoint.on('value', function (snapshot) {
            $scope.userList = $firebaseArray(userEndpoint);

            //tally total scores call $loaded() because async callback -- make sure entire array is loaded before reducing
            $scope.userList.$loaded().then(function (x) {
                $scope.totalPages = x.reduce(function (i, user) {
                    return i + parseInt(user.pages);
                }, 0);
            });
        });




        //dummy confirmation, data is actualy bound and live at the endpoint.
        $scope.showConfirmation = function (pages) {
            //Flash.create('success', "Thank you for pledging to read " + pages + " of Srila Prabhupada's books a day.");
        };


        $scope.otherAmount = function () {
            //User read some other amount than the pledge
            //Make the other input available and hide the pledge window.
            $scope.otherMode = true;

        }

        $scope.reportDailyScore = function (pledgedPages) {
            console.log("pledged pages" + pledgedPages);
            var clear = true;
            var _pages = parseInt(pledgedPages);
            if (isNaN(_pages)) {
                clear = false;
                console.log("You didnt submit a number!")
            }

            if (clear) {
                console.log("Good job, it's a number")
                var dailyScoresEndpoint = firebase.database().ref().child("daily");
                var dateString = (new Date()).toISOString().slice(0, 10).replace(/-/g, "")

                var _user = Auth.$getAuth();
                var _userInfo = $firebaseObject(firebase.database().ref().child("users/" + _user.uid));

                _userInfo.$loaded().then(function (x) {
                    var dailyScoresObject = $firebaseObject(dailyScoresEndpoint.child(dateString).child(_user.uid));
                    dailyScoresObject.pages = pledgedPages;
                    dailyScoresObject.user = _user.uid;
                    dailyScoresObject.$save().then(function (ref) {
                        console.log("Success")
                    }, function (error) {
                        console.log(error);
                    });

                });
            }

        }



    });