'use strict';

/**
 * @ngdoc function
 * @name dropadayApp.controller:SagepageCtrl
 * @description
 * # SagepageCtrl
 * Controller of the dropadayApp
 */
angular.module('dropadayApp')
    .controller('SagepageCtrl', function ($scope, $firebaseObject, Auth, firebase, $firebaseArray) {

        $scope.auth = Auth;
        //Gets the firebase User and allows user to make their pledge of pages
        Auth.$onAuthStateChanged(function (firebaseUser) {
            $scope.firebaseUser = firebaseUser;
            Flash.create('success', "Thank you for logging in!");
            //            var userRef = firebase.database().ref().child("users/" + firebaseUser.uid);
            //            var syncPledge = $firebaseObject(userRef);
            //            syncPledge.$bindTo($scope, "pledge");

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

        $scope.pledgePages = function (book, pages) {
            var _user = Auth.$getAuth();
            var _userObj = $firebaseObject(firebase.database().ref().child("users").child(_user.uid));
            //use the promise to make sure the object is loaded before writing
            _userObj.$loaded().then(function (x) {
                _userObj.pages = parseInt(pages);
                _userObj.book = book;
                _userObj.time = firebase.database.ServerValue.TIMESTAMP;
                _userObj.name = _user.providerData[0].displayName; 
                
                _userObj.$save().then(function(){
                    console.log("Successfully saved");
                }, function(error){
                    console.log("Error: ", error);
                })
            });

        }

        $scope.books = [
            {
                id: 1,
                book: "Sri Isopanisad",
                pages: 158
 },
            {
                id: 2,
                book: "Krishna Book",
                pages: 706
 },
            {
                id: 3,
                book: "Nectar of Devotion",
                pages: 407
 },
            {
                id: 4,
                book: "Teachings of Lord Caitanya",
                pages: 347
 },
            {
                id: 5,
                book: "Bhagavad-gita As It Is",
                pages: 868
 },
            {
                id: 6,
                book: "Srimad Bhagavatam",
                pages: 15119
 },
            {
                id: 7,
                book: "Caitanya Caritamrta",
                pages: 6621
 }
];

        $scope.allMonths = [];
        for (var i = 0; i <= 12; i++) {
            $scope.allMonths.push(i);
        };
        $scope.allYears = [];
        for (var i = 0; i <= 10; i++) {
            $scope.allYears.push(i);
        };

        //initialize variables
        $scope.book = $scope.books[0];
        $scope.month = 1;
        $scope.year = 0;

        //make sure that book pages per day always returns at least 1
        $scope.formatPages = function (book, year, month) {
            var intYear = parseInt(year);
            var intMonth = parseInt(month);

            return Math.ceil(book.pages / (month * 30 + year * 365));
        }
    });