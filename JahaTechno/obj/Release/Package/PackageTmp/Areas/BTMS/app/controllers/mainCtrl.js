angular.module("busApp")
.controller("mainCtrl", function ($scope, $http, $location, BusrouteGetUrl, destinationPointsUrl, ScheduleGetUrl, apiCallSvc) {

               
            
                $scope.model = {};
                $scope.searchData = {};

                //for bookingCtrl
                $scope.model.seats = [];
                $scope.model.selectedSeats = [];
                $scope.model.total = 0;
           
                

                //for booking ctrl
                $scope.model.customer = {};

                //for Reservation extra Info
                $scope.model.reservationExtraInfo = [];

                
                
                
                $scope.searchData.date = new Date();
                $scope.searchData.dateOptions = {

                    formatYear: 'yy',
                    maxDate: new Date(new Date().getFullYear() + 1, 12, 31),
                    minDate: new Date(),
                    startingDay: 1
                };
                $scope.popup = {
                    opened: false
                };
                $scope.openfn = function () {
                    $scope.popup.opened = true;
                };
                apiCallSvc.post(BusrouteGetUrl, null, null)
                .success(function (data) {
                    $scope.model.startPoints = data.value;
                })
                .error(function (msg) {

                });
                $scope.populateDestinations = function () {
                    if (!$scope.searchData.from) $scope.model.destinationPoints = [];
                    else {
                        apiCallSvc.post(destinationPointsUrl, null, { "from": $scope.searchData.from })
                        .success(function (data) {

                            $scope.model.endPoints = data.value;
                        })
                        .error(function (msg) {
                            $scope.error = msg;
                        });
                    }
                };

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

                $scope.calculationTime = function (date, restOfDate) {
                    var oriDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + restOfDate;
                    var orDateCreate = new Date(oriDate);
                    orDateCreate = $scope.getAddTimeOffInMin(orDateCreate);
                    var returnDate = new Date(orDateCreate).toJSON();
                    return returnDate;
                }



                $scope.searchSchedule = function () {

                    var d = $scope.calculationTime($scope.searchData.date, $scope.dStart);
                    var d1 = $scope.calculationTime($scope.searchData.date, $scope.dEnd);
                  

                    var url = ScheduleGetUrl + "?$expand=BusRoute,Bus&$filter=DepartDateTime ge datetime'" + d + "' and DepartDateTime le datetime'" + d1 + "' and  BusRoute/From eq '" + $scope.searchData.from + "' and BusRoute/To eq '" + $scope.searchData.To + "'";
                    console.log(url);
                    apiCallSvc.get(url, null, null)
                    .success(function (data) {
                        $scope.model.availableSchedules = data.value;
                        //angular.forEach($scope.model.availableSchedules, function (v, k) {
                        //    //v["DepartDateTime"] = new Date(v["DepartDateTime"]);
                        //    v["DepartDateTime"] =new Date(Date.parse(v["DepartDateTime"]));
                        //    //console.log(v["DepartDateTime"].getHours());
                        //});
                        //console.log($scope.model.availableSchedules);
                    })
                        .error(function (msg) {
                            $scope.error = msg;
                    });
                }
                $scope.selectSchedue = function (id) {
                    $scope.selectedScedule = id;
                    $location.path("/schedule");
                }
  });