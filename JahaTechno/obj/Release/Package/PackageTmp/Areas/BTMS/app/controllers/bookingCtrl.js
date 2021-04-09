angular.module("busApp")
.controller("bookingCtrl", function ($scope, $rootScope, $http, $location, bookingUrl, reservationUrl, apiCallSvc, ScheduleGetUrl) {
    
   
    apiCallSvc.post(bookingUrl, null, { id: $scope.selectedScedule })
                .success(function (data) {
                    console.log('success'+bookingUrl);
                    $scope.model.customer = {};
                    $scope.model.selectedSeats.length = 0;
                    
                    $scope.model.busInfo = { BusId: data.BusId, ScheduleId: data.ScheduleId, TotalSeats: data.TotalSeats, Bookings: data.Bookings, Fare: data.Fare };
                    console.log(data);
                    for (var i = 0; i < $scope.model.busInfo.TotalSeats; i++) {
                        var obj = { seatNumber: i + 1, status: $scope.getStatus(i), fare:data.Fare };
                        $scope.model.seats.push(obj)
                        if ((i + 1) % 2 == 0 && (i+1)%4!==0) $scope.model.seats.push({ seatNumber: 0 });
                    }

                })
                .error(function (msg) {
                    console.log('error' + bookingUrl + '  selectedSechedule' + $scope.selectedScedule);

                });




    $scope.getStatus = function (id) {
        var status = "available";
        for (var i = 0; i < $scope.model.busInfo.Bookings.length; i++) {
            if ($scope.model.busInfo.Bookings[i].SeatNumber == id+1) {
                status = "booked";
                break;
            }
        }
        return status;
    }
    $scope.selectSeat = function (seat) {
        if (seat.status == 'booked') return;
        
        //seat.status = seat.status == 'selected' ? 'available' : 'selected';
        if (seat.status == 'selected') {
            for (var i = 0; i < $scope.model.selectedSeats.length; i++) {
                if($scope.model.selectedSeats[i].seatNumber == seat.seatNumber)
                {
                    $scope.model.selectedSeats.splice(i, 1);
                }
            }
            seat.status = 'available';
            
        }
        else {
            $scope.model.selectedSeats.push({ seatNumber: seat.seatNumber, fare: seat.fare });
            seat.status = 'selected';
        }
        $scope.totalFare();
    }
   
    $scope.totalFare = function () {
        $scope.model.total = 0;
        for (var i = 0; i < $scope.model.selectedSeats.length; i++) {
            
            $scope.model.total += Number($scope.model.selectedSeats[i].fare);
        }
        
    }
    
   
   
    $scope.reserveSeats = function () {

        console.log($scope.model.customer);
        console.log($scope.model.selectedSeats);
        console.log($scope.selectedScedule);
        var bookings = [];
        for (var i = 0; i < $scope.model.selectedSeats.length; i++) {
            bookings.push({
                CustomerName: $scope.model.customer.CustomerName,
                MobileNumber: $scope.model.customer.MobileNumber,
                Address: $scope.model.customer.Address,
                SeatNumber: $scope.model.selectedSeats[i].seatNumber,
                ScheduleId: $scope.selectedScedule
            });
        }

        
        console.log(bookings);
        
        
        var url = ScheduleGetUrl + "?$expand=Bus,BusRoute&$filter=ScheduleId eq " + $scope.selectedScedule;
        apiCallSvc.get(url, null, null)
       .success(function (data) {
          
           $rootScope.reservationCouchNo = '';
           $rootScope.reservationFrom = '';
           $rootScope.reservationTo = '';
           $rootScope.reservationDepartDateTime = '';

           $scope.BookingExtraInfo = [];
           $scope.BookingExtraInfo = data.value;

           $rootScope.reservationCouchNo = $scope.BookingExtraInfo[0].Bus.CoachNo;
           $rootScope.reservationFrom = $scope.BookingExtraInfo[0].BusRoute.From;
           $rootScope.reservationTo = $scope.BookingExtraInfo[0].BusRoute.To;
           $rootScope.reservationDepartDateTime = $scope.BookingExtraInfo[0].DepartDateTime;
          
       })
       .error(function (err) {
           $scope.scheduleError = err["odata.error"].message.value;
       });
 

        apiCallSvc.post(reservationUrl, null, { bookings: bookings })
        .success(function (data) {
            $scope.selectedScedule = 0;
            $location.path("/confirmation");
        })
        .error(function(err){

        });
    }

});