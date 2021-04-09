angular.module("busAdminApp")
.controller("homeCtrl", function ($scope, $http, $location, apiCallSvc, authLocalStorageSvc, loginSvc, scheduleUrl) {
    $scope.today = new Date();
    $scope.homeError = "";
   
    var d = $scope.today.toJSON();

    var next = new Date($scope.today);
    next.setDate($scope.today.getDate() + 1);

    var d1 = next.toJSON();


    var url = scheduleUrl + "?$expand=Bus,BusRoute,Bookings&$filter=DepartDateTime ge  datetime'" + d + "'  and DepartDateTime lt  datetime'" + d1 + "'";
    apiCallSvc.get(url, { Authorization: "Bearer " + $scope.auth.accToken }, null)
    .success(function (data) {
        //console.log(data);
        $scope.model.allSchedules = data.value;
    })
    .error(function (err) {
        //console.log(err);
        $scope.homeError = err["odata.error"].message.value;
    });
});