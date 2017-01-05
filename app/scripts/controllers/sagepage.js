'use strict';

/**
 * @ngdoc function
 * @name dropadayApp.controller:SagepageCtrl
 * @description
 * # SagepageCtrl
 * Controller of the dropadayApp
 */
angular.module('dropadayApp')
    .controller('SagepageCtrl', function ($scope) {
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
        for (var i = 0; i < 13; i++) {
            $scope.allMonths.push(i);
        };
        $scope.allYears = [];
        for (var i = 0; i < 11; i++) {
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