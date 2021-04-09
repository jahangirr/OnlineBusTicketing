angular.module("hotelApp")
.controller("mainCtrl", function ($scope, $http,$location, apiCallSvc) {

    $scope.logingPage = function () {
        $location.path('/login');
    };
    $scope.registerPage = function () {
        $location.path('/register');
    };

    $scope.hotelRoomBooking = function () {


        $location.path('/hotelRoomBooking');
    };

    $scope.hotelHomePage = function () {

        $location.path('/home');
    };

   

      
  });