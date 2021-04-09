angular.module("busAdminApp")
.controller("userCtrl", function ($scope, $http, $location, apiCallSvc, authLocalStorageSvc, loginSvc, userListUrl) {


    $scope.authuserCtrl = {};
    $scope.authuserCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authuserCtrl.isAuthenticated) {

        $location.path("/login")
    }

    $scope.userError = "";
    $scope.userInfo = null;
    apiCallSvc.get(userListUrl, { Authorization: "Bearer " + $scope.auth.accToken }, null)
    .success(function (data) {
        $scope.model.users = data;
    })
    .error(function (err) {
        $scope.userError = "Error encountered";

    });
    $scope.register = function () {

        loginSvc.register($scope.userInfo.Email, $scope.userInfo.Password, $scope.userInfo.ConfirmPassword)
        .success(function () {
            $scope.userInfo = null;
            apiCallSvc.get(userListUrl, { Authorization: "Bearer " + $scope.auth.accToken }, null)
            .success(function (data) {
                $scope.model.users = data;
            })
            .error(function (err) {
                $scope.userError = "Error encountered";

            });
        })
        .error(function (err) {
            $scope.userError = err.status;
        });
    }

   
});