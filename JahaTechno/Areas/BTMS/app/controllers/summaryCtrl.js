angular.module("busApp")
.controller("summaryCtrl", function ($scope, $http, $location) {

    $scope.disableBrowser = function () {
        // Prevent Browser back button
        $scope.$on('$locationChangeStart', function (evnt, next, current) {
            alert("Your, browsers back button is disabled!");

            //Prevent browser's back button default action.
            evnt.preventDefault();

        });
    }

    $scope.disableBrowser();

});