angular.module("busAdminApp")
.controller("busCtrl", function ($scope, $http, $location, apiCallSvc, authLocalStorageSvc, busUrl) {


    $scope.authBusCtrl = {};
    $scope.authBusCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authBusCtrl.isAuthenticated) {

        $location.path("/login")
    }

    $scope.busError = "";
    $scope.newBus = null;
    $scope.temp = null;
    apiCallSvc.get(busUrl, null, null)
    .success(function (data) {
        $scope.model.buses = data.value;
    })
    .error(function (err) {
        $scope.busError = err["odata.error"].message.value;

    });
    $scope.addBus = function () {

        $("#addBusModal").modal("show");
    }
    $scope.insertBus = function () {
        apiCallSvc.post(busUrl, { Authorization: "Bearer " + $scope.authBusCtrl.accToken }, $scope.newBus)
        .success(function (data) {
            $scope.newBus.BusId = data.BusId;
            $scope.model.buses.push(data);
            $("#addBusModal").modal("hide");
            $scope.newBus = null;
        })
        .error(function (err) {
            $scope.busError = err["odata.error"].message.value;
            $("#addBusModal").modal("hide");
        });
    }
    $scope.delete = function (bus) {
        $scope.temp = bus;
        $("#deleteBus").modal("show");
    }
    $scope.deleteBusConfirm = function () {


        apiCallSvc.remove(busUrl + "(" + $scope.temp.BusId + ")", { Authorization: "Bearer " + $scope.authBusCtrl.accToken }, null)
        .success(function (data) {
            var i = $scope.model.buses.indexOf($scope.temp);
            $scope.model.buses.splice(i, 1);
            $("#deleteBus").modal("hide");
        })
        .error(function (err) {
            $scope.busError = err["odata.error"].message.value;
            $("#deleteBus").modal("hide");
        });
    }
    $scope.edit = function (bus) {
        $scope.temp = bus;
        $("#editBusModal").modal("show");
    }
    $scope.updateBus = function () {
        apiCallSvc.put(busUrl + "(" + $scope.temp.BusId + ")", { Authorization: "Bearer " + $scope.authBusCtrl.accToken }, $scope.temp)
       .success(function (data) {
           $("#editBusModal").modal("hide");
           $scope.temp = null;
       })
         .error(function (err) {
             $scope.busError = err["odata.error"].message.value;
             $("#editBusModal").modal("hide");
         });
    }
});