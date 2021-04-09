angular.module("hotelAdminApp")
.controller("roomVatCtrl", function ($filter, $scope, $http, $location, apiCallSvc, authLocalStorageSvc, apiDateTimeLocalize, hotelManagementUrl) {

   // var HostPoint = 'http://localhost:50162';
    var HostPoint = 'http://www.jahatechno.com';

    $scope.authRoomVatCtrl = {};
    $scope.authRoomVatCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authRoomVatCtrl.isAuthenticated) {

        $location.path("/login")
    }


    $scope.newRoomVat = null;
    $scope.temp = null;
    $scope.roomVatError = "";

    var getRoomVatUrl = HostPoint + '/api/RoomVats';

    apiCallSvc.get(getRoomVatUrl, { Authorization: "Bearer " + $scope.authRoomVatCtrl.accToken }, null)
    .success(function (data) {

        console.log(data);

        $scope.model.allVats = data;
    })
    .error(function (err) {

        $scope.roomVatError = err.message;
    });


    $scope.createVat = function () {
        $("#addCreateVat").modal("show");
    }


    var PostRoomVatUrl = HostPoint + '/api/RoomVats';
    $scope.saveVat = function () {
        $scope.newRoomVat.FromActiveDate = new Date(apiDateTimeLocalize.getAddTimeOffInMin($scope.newRoomVat.FromActiveDate));
        apiCallSvc.post(PostRoomVatUrl, { Authorization: "Bearer " + $scope.authRoomVatCtrl.accToken }, $scope.newRoomVat)
       .success(function (data) {
           $scope.model.allVats.push(data);
           $("#addCreateVat").modal("hide");
           $scope.newRoomVat = null;

       })
        .error(function (err) {
            $scope.roomVatError = err.message;
        });
    }



    $scope.delete = function (obj) {
        $scope.temp = obj;
        $("#deleteVat").modal("show");
    };



    $scope.deleteVat = function () {


        apiCallSvc.remove(PostRoomVatUrl + '/' + $scope.temp.RoomVatId, { Authorization: "Bearer " + $scope.authRoomVatCtrl.accToken }, null)
        .success(function (data) {
            console.log('Success');
            console.log($scope.model.allVats);
            console.log('Sepraton');
            var i = $scope.model.allVats.indexOf($scope.temp);
            $scope.model.allVats.splice(i, 1);
            console.log($scope.model.allVats);
            console.log('Success');
            $scope.temp = null;
            $("#deleteVat").modal('hide');
        })
        .error(function (err) {
            console.log('Eorrors ');
            $scope.roomVatError = err.message;
            console.log($scope.roomVatError);
            $("#deleteVat").modal('hide');
            console.log('Eorrors ');
        });
    }






    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(new Date().getFullYear() + 1, 12, 31),
        minDate: new Date(new Date().getFullYear() - 2, 1, 1),
        startingDay: 1
    };


    $scope.popup = {
        opened: false
    };
    $scope.openfn = function () {
        $scope.popup.opened = true;
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.openfn2 = function () {
        $scope.popup2.opened = true;
    };
});