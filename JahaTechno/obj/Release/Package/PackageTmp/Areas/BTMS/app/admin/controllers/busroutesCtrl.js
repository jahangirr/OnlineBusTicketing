angular.module("busAdminApp")
.controller("busrouteCtrl", function ($scope, $http, $location, apiCallSvc, authLocalStorageSvc, busRouteUrl) {


    $scope.authBusRouteCtrl = {};
    $scope.authBusRouteCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authBusRouteCtrl.isAuthenticated) {

        $location.path("/login")
    }


    $scope.newBusRoute = null;
    $scope.temp = null;
    $scope.busrouteError = "";
    apiCallSvc.get(busRouteUrl, { Authorization: "Bearer " + $scope.authBusRouteCtrl.accToken }, null)
    .success(function (data) {
        $scope.model.allBusRoutes = data.value;
    })
    .error(function (err) {
        $scope.busrouteError = err["odata.error"].message.value;
    });
    $scope.createRoute = function () {
        $("#addBusRoute").modal("show");
    }
    $scope.saveRoute = function () {
        apiCallSvc.post(busRouteUrl, { Authorization: "Bearer " + $scope.authBusRouteCtrl.accToken }, $scope.newBusRoute)
        .success(function (data) {
            $scope.model.allBusRoutes.push(data);
            $("#addBusRoute").modal("hide");
            $scope.newBusRoute = null;

        })
        .error(function (err) {
            $scope.busrouteError = err["odata.error"].message.value;
        });
    }
    $scope.edit = function (obj) {
        $scope.temp = obj;
        $("#editBusRoute").modal("show");
    };

    $scope.UpdateRoute = function () {
        apiCallSvc.put(busRouteUrl + "(" + $scope.temp.BusRouteId + ")", { Authorization: "Bearer " + $scope.authBusRouteCtrl.accToken }, $scope.temp)
        .success(function (data) {
            $scope.temp = null;
            $("#editBusRoute").modal('hide');
        })
        .error(function (err) {
            $scope.busrouteError = err["odata.error"].message.value;
            $("#editBusRoute").modal('hide');
        });
    }

    $scope.delete = function (obj) {
        $scope.temp = obj;
        $("#deleteBusRoute").modal("show");
    };

    $scope.deleteRoute = function () {
        apiCallSvc.remove(busRouteUrl + "(" + $scope.temp.BusRouteId + ")", { Authorization: "Bearer " + $scope.authBusRouteCtrl.accToken }, null)
        .success(function (data) {
            var i = $scope.model.allBusRoutes.indexOf($scope.temp);
            $scope.model.allBusRoutes.splice(i, 1);
            $scope.temp = null;
            $("#deleteBusRoute").modal('hide');
        })
        .error(function (err) {
            $scope.busrouteError = err["odata.error"].message.value;
            $("#deleteBusRoute").modal('hide');
        });
    }
});