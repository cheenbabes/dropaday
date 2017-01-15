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
        window.addEventListener("load", function () {
            setTimeout(triggerCharts, 400);
        }, false);

        function triggerCharts() {
            $(document).trigger('redraw.bs.charts');
        }

        //Hide other mode by default
        $scope.otherMode = false;
        $scope.submitted = false;

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
                $scope.totalPagesPledged = x.reduce(function (i, user) {
                    return i + parseInt(user.pages);
                }, 0);
            });
        });

        //Get the list of daily score lists
        var endTime = (new Date()).getTime + 150000
        var startTime = (new Date(0, 0, 0, 0)).valueOf()
        var dailyEndpoint = firebase.database().ref().child("daily").orderByChild("time").startAt(startTime).endAt(endTime);

        dailyEndpoint.on('value', function (snapshot) {
            $scope.dailyArray = $firebaseArray(dailyEndpoint);
            $scope.dailyArray.$loaded().then(function (x) {
                console.log(x);
                console.log("length: " + x.length);

                $scope.totalPagesRead = x.reduce(function (i, score) {
                    return i + parseInt(score.pages);
                }, 0)
            })

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
                var _user = Auth.$getAuth();
                var dailyScoresArray = $firebaseArray(dailyScoresEndpoint);
                dailyScoresArray.$add({
                    pages: pledgedPages,
                    user: _user.uid,
                    time: firebase.database.ServerValue.TIMESTAMP
                });

                $scope.submitted = true;

            }

        }
        
        $scope.labels = ['2006', '2007'];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [[65, 59], [28,48]];



    });