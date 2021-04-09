angular.module("hotelAdminApp")
.controller("adminCtrl", function ($scope, $http, $location,$window, apiCallSvc, authLocalStorageSvc, loginSvc) {
    $scope.model = {};
    $scope.loginModel = {};
    $scope.registerModel = {};

    $scope.logingPage = function () {
        $location.path('/login');
    };
    $scope.registerPage = function () {
        $location.path('/register');
    };

    $scope.roomSetupInfoPage = function () {

        $location.path('/roomSetupInfo');
    };

    $scope.roomDiscountPage = function () {

        $location.path('/roomDiscount');
    };
    $scope.roomVatPage = function () {

        $location.path('/vatEntry');
    };

    $scope.auth = authLocalStorageSvc.getAuthData();

    $scope.loginErr = "";
    $scope.signin = function () {
        //console.log("ok");

        loginSvc.login($scope.loginModel.username, $scope.loginModel.password)
                .then(function (data) {
                    $scope.loginErr = "";     
                    authLocalStorageSvc.saveAuthData($scope.loginModel.username, data.access_token);
                    $scope.loginModel = null;
                    $scope.auth = authLocalStorageSvc.getAuthData(); 
                     $location.path("/home");
                },function (err) {
                    $scope.loginErr = err.error_description;
                });
                
    }



    $scope.signout = function () {
        authLocalStorageSvc.removeAuthData();
        $scope.auth = {};
        
    }

   
    $scope.register = function () {

        $scope.registerErr = "";
       
        loginSvc.register($scope.registerModel.username, $scope.registerModel.password1, $scope.registerModel.password2)
                .then(function (data) {
                    $scope.registerErr = "";
                    $location.path("/login");
                }, function (err) {
                    $scope.registerErr  = err.error_description;
                });
                
    }


});