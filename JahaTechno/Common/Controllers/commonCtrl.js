angular.module("commonApp")
.controller("commonCtrl", function ($scope, $rootScope, $http, $location, $window, apiCallSvc, authLocalStorageSvc, loginSvc) {


    //////////////////////////
    $scope.model = {};
    $scope.loginModel = {};
    $scope.registerModel = {};

    $scope.HomePage = function () {
        $location.path('/Index');
    };
    $scope.ContactPage = function () {
        $location.path('/contact');
    };

    $scope.logingPage = function () {
        $scope.loginErr = "";
        $location.path('/login');
    };
    $scope.registerPage = function () {
        $location.path('/register');
    };
    $scope.orderPage = function () {
        $location.path('/order');
    };

    
    $rootScope.isRootScopeAuthenticated = false;
    
    $scope.loginErr = "";
    $scope.signin = function () {
        loginSvc.login($scope.loginModel.username, $scope.loginModel.password)
                .then(function (data) {
                    $scope.loginErr = "";    
                    authLocalStorageSvc.saveAuthData($scope.loginModel.username, data.access_token);
                    $scope.loginModel = null;
                    $scope.auth = authLocalStorageSvc.getAuthData();
                    $rootScope.isRootScopeAuthenticated = $scope.auth.isAuthenticated;
                    $location.path("/home");
                }, function (err) {
                    $scope.loginErr = "";
                    $scope.loginErr = err.error_description;
                   
                });
                
    }



    $scope.signout = function () {
        authLocalStorageSvc.removeAuthData();
        $scope.auth = {};
        $rootScope.isRootScopeAuthenticated = false;
        
    }

   
    
    $scope.register = function () {

       
        $scope.registerErr = "";
        $scope.loginErr = "";
        loginSvc.register($scope.registerModel.username, $scope.registerModel.password1, $scope.registerModel.password2)
                .then(function (data) {
                    
                    $scope.registerErr = "";
                    $location.path("/login");
                }, function (err) {       
                    $scope.registerErr = err.error_description;
                   
                });
                
    }


});