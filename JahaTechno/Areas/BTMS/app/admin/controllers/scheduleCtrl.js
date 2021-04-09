angular.module("busAdminApp")
.controller("scheduleCtrl", function ($scope, $http, $location, apiCallSvc, authLocalStorageSvc, scheduleUrl, busUrl, busRouteUrl) {

    $scope.authscheduleCtrl = {};
    $scope.authscheduleCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authscheduleCtrl.isAuthenticated) {

        $location.path("/login")
    }

    $scope.scheduleDate = new Date();
    $scope.scheduleError = "";

    $scope.newSchedule = null;
    $scope.scheduleToDelete = -1;

    $scope.getAddTimeOffInMin = function (date) {

        var localDateInstance = new Date();

        localDateInstance = date; 


        var timeOffSetInMin = localDateInstance.getTimezoneOffset();

        if (timeOffSetInMin < 0) {

            localDateInstance = localDateInstance.setMinutes(date.getMinutes() + Math.abs(timeOffSetInMin));

        }
        else if (timeOffSetInMin > 0) {
            localDateInstance = localDateInstance.setMinutes(date.getMinutes() - Math.abs(timeOffSetInMin));
        }
        else {
            localDateInstance = localDateInstance;
        }

        return localDateInstance;
    }


    $scope.dStart = 'T00:00:00.000Z';
    $scope.dEnd = 'T23:59:00.000Z';

    $scope.calculationTime = function(date , restOfDate)
    {
        var oriDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + restOfDate;
        var orDateCreate  = new Date(oriDate);
        orDateCreate = $scope.getAddTimeOffInMin(orDateCreate); 
        var returnDate = new Date(orDateCreate).toJSON();
        return returnDate;
    }

    $scope.getSchedulesOfDay = function () {

        var url = scheduleUrl + "?$expand=Bus,BusRoute,Bookings&$filter=DepartDateTime ge  datetime'" + $scope.calculationTime($scope.scheduleDate, $scope.dStart) + "'";

        apiCallSvc.get(url, { Authorization: "Bearer " + $scope.authscheduleCtrl.accToken }, null)
        .success(function (data) {
            //console.log(data);
            $scope.model.dateSchedules = data.value;
        })
        .error(function (err) {
            $scope.scheduleError = err["odata.error"].message.value;
        });
    };
    $scope.getSchedulesOfDay();
    apiCallSvc.get(busUrl, { Authorization: "Bearer " + $scope.authscheduleCtrl.accToken }, null)
    .success(function (data) {
       
        $scope.model.buses = data.value;
        console.log($scope.model.buses);
    })
    .error(function (err) {
        $scope.scheduleError = err["odata.error"].message.value;
    });
    apiCallSvc.get(busRouteUrl, { Authorization: "Bearer " + $scope.authscheduleCtrl.accToken }, null)
    .success(function (data) {
        
        $scope.model.busRoutes = data.value;
        console.log($scope.model.busRoutes);
    })
    .error(function (err) {
        $scope.scheduleError = err["odata.error"].message.value;
    });
    $scope.show = function () {
        $scope.getSchedulesOfDay();
    }
    $scope.createNewSchedule = function () {
        $("#addNewSchedule").modal("show");
    }
    $scope.insertSchedule = function () {
        

        $scope.newSchedule.date.setHours($scope.newSchedule.time.getHours());
        $scope.newSchedule.date.setMinutes($scope.newSchedule.time.getMinutes());
        
        // adding or substracting minute from date so that it can be matched with the UI time.
        $scope.newSchedule.dateHolder =   $scope.getAddTimeOffInMin($scope.newSchedule.date);

      

        apiCallSvc.post(scheduleUrl, { Authorization: "Bearer " + $scope.authscheduleCtrl.accToken }, { DepartDateTime: $scope.newSchedule.date, BusRouteId: $scope.newSchedule.busRouteId, BusId: $scope.newSchedule.busId })
        .success(function (data) {
            //console.log(data.ScheduleId);
            apiCallSvc.get(scheduleUrl + "(" + data.ScheduleId + ")?$expand=Bus,BusRoute,Bookings", { Authorization: "Bearer " + $scope.authscheduleCtrl.accToken }, null)
            .success(function (data) {
                //console.log(data);
                $scope.model.dateSchedules.push(data);
                $("#addNewSchedule").modal("hide");
            })
            .error(function (err) {
                $scope.scheduleError = err["odata.error"].message.value;
            });
        })
        .error(function (err) {
            $scope.scheduleError = err["odata.error"].message.value;
        });
    }
    $scope.deleteSchedule = function (id) {
        $scope.scheduleToDelete = id;
        $("#deleteSchedule").modal("show");
    }
    $scope.deleteScheduleConfirmed = function () {
        apiCallSvc.remove(scheduleUrl + "(" + $scope.scheduleToDelete + ")", { Authorization: "Bearer " + $scope.authscheduleCtrl.accToken }, null)
        .success(function (data) {
            for (var i = 0; i< $scope.model.dateSchedules.length;i++){
                if ($scope.scheduleToDelete == $scope.model.dateSchedules[i].ScheduleId) {
                    $scope.model.dateSchedules.splice(i, 1);
                    $scope.scheduleToDelete = -1;
                    $("#deleteSchedule").modal("hide");
                    break;
                }
            }
        })
        .error(function (err) {
            $scope.scheduleError = err["odata.error"].message.value;
            $("#deleteSchedule").modal("hide");
        });
    }
    /////datepicker
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(new Date().getFullYear() + 1, 12, 31),
        minDate: new Date(new Date().getFullYear()-2,1,1),
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
    ///timepicker
   
   

    $scope.ismeridian = true;
});