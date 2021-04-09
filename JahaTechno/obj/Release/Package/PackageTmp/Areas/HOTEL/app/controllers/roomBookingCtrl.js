angular.module("hotelApp")
.controller("roomBookingCtrl", function ($scope, $timeout, $rootScope, $window, $http, apiDateTimeLocalize) {


   //  var HostPointHolder = 'http://localhost:50162';
    var HostPointHolder = 'http://www.jahatechno.com';

    $scope.successMassage = '';
    $scope.error = '';

    $scope.firstName = '';
    $scope.lastName = '';
    $scope.cell = '';
    $scope.email = '';
    $scope.skypeAddress = '';
    $scope.IMOAddress = '';

    $scope.RoomID = 0;
    $scope.RoomNo = "";
    $scope.RoomType = "";
    $scope.Prize = "";


    $scope.BookingInfo = [];
   


    //For Hotel Room Bookin Details
    $scope.BookingID = 0;
    $scope.BookingPersonInfoId = 0;
    $scope.RoomIDs = "";
    $scope.BookedDateFR = '';
    $scope.BookedDateTO = '';
    $scope.BookingStatus = "";
    $scope.BookingStatusBool = false;
    $scope.PaymentStatus = "";
    $scope.AdvancePayed = "0";
    $scope.TotalAmountPayed = "0";

    // This method is to get all the Room Details. 
    selectRoomDetails('');
    //selectRoomBookingDetails('');

    selectAvailableStatus('');

    function selectRoomDetails(RoomNo) {
        $http.get(HostPointHolder+'/api/HOTELManagement/getHotelRooms/', { params: { RoomNoAll: RoomNo } }).success(function (data) {

            $scope.HotelRoomData = data;
            if ($scope.HotelRoomData.length > 0) {
            }

        })
   .error(function () {

       $scope.error = "An Error has occured while loading posts!";
   });

    }

    function selectRoomBookingDetails(RoomID) {

        $http.get(HostPointHolder + '/api/HOTELManagement/getRoomBookingDetails/', { params: { RoomID: RoomID } }).success(function (data) {
            $scope.RoomBookingData = data;
            if ($scope.RoomBookingData.length > 0) {

            }
        })
  .error(function () {

      $scope.error = "An Error has occured while loading posts!";
  });
    }



    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };
  

    $scope.selectRoomBookingTotalBillBasedFromDate = function selectRoomBookingTotalBillBasedFromDate(RoomID, BookedDateFR, BookedDateTO)
    {

        if (apiDateTimeLocalize.isNumber(RoomID) == true && (RoomID > 0) && apiDateTimeLocalize.isDate(BookedDateFR) == true && apiDateTimeLocalize.isDate(BookedDateTO) == true) {

            var dateHolderBookedDateFR = new Date(BookedDateFR);
            dateHolderBookedDateFR = apiDateTimeLocalize.getAddTimeOffInMin(dateHolderBookedDateFR);

            var tempBookedDateFR = new Date(dateHolderBookedDateFR).toJSON();
            tempBookedDateFR = tempBookedDateFR.substring(0, 10);

            var dateHolderBookedDateTO = new Date(BookedDateTO);
            dateHolderBookedDateTO = apiDateTimeLocalize.getAddTimeOffInMin(dateHolderBookedDateTO);

            var tempBookedDateTO = new Date(dateHolderBookedDateTO).toJSON();
            tempBookedDateTO = tempBookedDateTO.substring(0, 10);
            $scope.temptotalBill = [];

            $http.get(HostPointHolder + '/api/HOTELManagement/getRoomBookingDetailsBasedFromDate/', { params: { RoomNo: RoomID, BookedDateFR: tempBookedDateFR, BookedDateTO: tempBookedDateTO } })
            .success(function (data) {

                $scope.temptotalBill = data;
                var tempTotalDiscount = 0;
                var tempTotalAmountForBooking = 0;

                

                for (i = 0; i < $scope.temptotalBill.length; i++) {

                    tempTotalAmountForBooking = $scope.temptotalBill[0].totalPrizeAfterDiscounted;
                    tempTotalDiscount += Number($scope.temptotalBill[i].DiscountAmountValue);
                }
                
                $scope.TotalDiscount = tempTotalDiscount;
                $scope.TotalAmountForBooking = tempTotalAmountForBooking;


                console.log($scope.VatPercent);

                console.log($scope.TotalAmountForBooking);

                //calculation total vat
                $scope.TotalVatAmount = ((parseFloat($scope.VatPercent) / parseFloat(100)) * parseFloat($scope.TotalAmountForBooking));

                console.log('$scope.TotalVatAmount');
                console.log($scope.TotalVatAmount);
                console.log('$scope.TotalVatAmount');





            })
            .error(function (err) { 
                console.log(err);
                
            });



        }


    }

    $scope.roomBookingCalculation = function (RoomID, BookedDateFR, BookedDateTO)
    {
        $scope.getRoomVatBasedLastActiveDate();
        $scope.selectRoomBookingTotalBillBasedFromDate(RoomID, BookedDateFR, BookedDateTO);
        
    }

    $scope.selectRoomBookingDetailsBasedFromDate = function selectRoomBookingDetailsBasedFromDate(RoomID, BookedDateFR, BookedDateTO) {
        $scope.BookingStatusBool = false;


        if (apiDateTimeLocalize.isNumber(RoomID) == true && (RoomID > 0) && apiDateTimeLocalize.isDate(BookedDateFR) == true) {
            var dateHolderBookedDateFR = new Date(BookedDateFR);
            dateHolderBookedDateFR = apiDateTimeLocalize.getAddTimeOffInMin(dateHolderBookedDateFR);

            var tempBookedDateFR = new Date(dateHolderBookedDateFR).toJSON();
            tempBookedDateFR = tempBookedDateFR.substring(0, 10);

            $http.get(HostPointHolder + '/api/HOTELManagement/getRoomBookingDetailsBasedFromDate/', { params: { RoomID: RoomID, BookedDateFR: tempBookedDateFR } })
            .success(function (data) {
                $scope.RoomBookingData = data;
                console.log($scope.RoomBookingData);
                $scope.TotalAmountPayed = 0;

                if ($scope.RoomBookingData.length > 0) {
                    $scope.BookingID = $scope.RoomBookingData[0].BookingID;
                    $scope.RoomIDs = $scope.RoomBookingData[0].RoomNo;
                    $scope.BookedDateFR = new Date($scope.RoomBookingData[0].BookedDateFR);
                    $scope.BookedDateTO = new Date($scope.RoomBookingData[0].BookedDateTO);
                    $scope.BookingStatus = $scope.RoomBookingData[0].BookingStatus;
                    $scope.BookingStatusBool = true;
                    $scope.IsFormValid = true;
                    $scope.PaymentStatus = $scope.RoomBookingData[0].PaymentStatus;
                    $scope.AdvancePayed = 0;
                    $scope.TotalAmountPayed =0;
                    var tempTotalAmountPayed = 0; 
                    for (i = 0; i < $scope.RoomBookingData.length; i++) {

                        tempTotalAmountPayed += Number($scope.RoomBookingData[i].AdvancePayed);

                    }
                    $scope.TotalAmountPayed = tempTotalAmountPayed.toString();

                    //var tempBookingPersonInfoId = 0;
                    //tempBookingPersonInfoId = $scope.RoomBookingData[0].BookingPersonInfoId;
                    //$http.get('/api/HOTELManagement/getHotelRoomBookingPersonalInfo/', { params: { BookingPersonInfoId: tempBookingPersonInfoId } }).success(function (data) {

                    //    $scope.getPersonInfo = [];
                    //    $scope.getPersonInfo = data;
                    //    $scope.firstName = $scope.getPersonInfo[0].firstName;
                    //    $scope.lastName = $scope.getPersonInfo[0].lastName;;
                    //    $scope.cell = $scope.getPersonInfo[0].cell;
                    //    $scope.email = $scope.getPersonInfo[0].email;
                    //    $scope.skypeAddress = $scope.getPersonInfo[0].skypeAddress;
                    //    $scope.IMOAddress = $scope.getPersonInfo[0].IMOAddress;
                    //    console.log($scope.getPersonInfo);
                    //}).error(function (err) {

                    //    $scope.error = "An Error has occured while loading posts!";
                    //});


                    $scope.firstName = 'defaultfirstName';
                    $scope.lastName = 'defaultlastName';
                    $scope.cell = 'defaultcell';
                    $scope.email = 'defaultemail@gmail.com';
                    $scope.skypeAddress = 'defaultskypeAddress';
                    $scope.IMOAddress = 'defaultIMOAddress';


                   

                } else {


                    $scope.BookingStatusBool = false;

                }




            })
            .error(function () {

                $scope.error = "An Error has occured while loading posts!";
            });

           
        }
    }



    function selectAvailableStatus(RoomNo) {
        $http.get(HostPointHolder + '/api/HOTELManagement/getRoomDashboardDetails/', { params: { RoomNo: RoomNo } }).success(function (data) {
            $scope.RoomAvailableData = data;
            if ($scope.RoomAvailableData.length > 0) {
            }
        })
  .error(function () {
      $scope.error = "An Error has occured while loading posts!";
  });
    }

    // clear all the control values after insert and edit.
    function cleardetails() {
        // For Hotel Room Details
        $scope.RoomID = 0;
        $scope.RoomNo = "";
        $scope.RoomType = "";
        $scope.Prize = "";


        $scope.BookingID = 0;
        $scope.BookingPersonInfoId = 0;
        $scope.RoomIDs = "";
        $scope.BookedDateFR = new Date().toJSON().substring(0, 10);
        $scope.BookedDateTO = new Date().toJSON().substring(0, 10);
        $scope.BookingStatus = "";
        $scope.PaymentStatus = "";
        $scope.AdvancePayed = "0";
        $scope.TotalAmountPayed = "0";


        $scope.firstName = '';
        $scope.lastName = '';
        $scope.cell = '';
        $scope.email = '';
        $scope.skypeAddress = '';
        $scope.IMOAddress = '';

        // clear the error parts
        $scope.error = '';

 
    }



    //Edit RoomBooking edit  Details
    $scope.roomBookingEdit = function roomBookingEdit(BookingID, RoomID, BookedDateFR, BookedDateTO, BookingStatus, PaymentStatus, AdvancePayed, TotalAmountPayed) {
        cleardetails();
        $scope.IsFormValid = true;
        $scope.showEditMusics = true;
        $scope.BookingID = BookingID;
        $scope.RoomIDs = RoomID.toString();
        $scope.BookedDateFR = BookedDateFR;
        $scope.BookedDateTO = BookedDateTO;
        $scope.BookingStatus = BookingStatus;
        $scope.PaymentStatus = PaymentStatus;
        $scope.AdvancePayed = AdvancePayed;
        $scope.TotalAmountPayed = TotalAmountPayed;
    }

    //Delete RoomBooking Selete Detail
    $scope.roomBookingDelete = function roomBookingDelete(BookingID) {
        cleardetails();
        $scope.BookingID = BookingID;
        var delConfirm = confirm("Are you sure you want to delete the Room Booking Data ?");
        if (delConfirm == true) {
            $http.get(HostPointHolder + '/api/HotelRoom/deleteROom/', { params: { BookingID: $scope.BookingID } }).success(function (data) {
                cleardetails();
                selectRoomBookingDetails('');
            })
      .error(function () {
          $scope.error = "An Error has occured while loading posts!";
      });

        }
    }


    ////Form Validation
    $scope.$watch("f1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });


    //Save Room Booking
    $scope.saveroomBooking = function () {


        if ($scope.IsFormValid == false)
        {
            $scope.error = 'Please , fill the required field';
            return;
        }


        if (apiDateTimeLocalize.isNumber($scope.AdvancePayed) == true && apiDateTimeLocalize.isNumber($scope.TotalAmountPayed) == true && apiDateTimeLocalize.isNumber($scope.TotalAmountForBooking) == true)
        {
            var totalAmountCheck = parseFloat( $scope.AdvancePayed);
            totalAmountCheck += parseFloat( $scope.TotalAmountPayed);

            var TotalAmountForBookingCheck = parseFloat($scope.TotalAmountForBooking) + parseFloat($scope.TotalVatAmount);


            if (totalAmountCheck > TotalAmountForBookingCheck)
            {
                $scope.error ='Receiving money can not be greater than Bill';
                return;
            }

        }
        else
        {
            $scope.error = 'Please , Refresh';
            return;
        }

       

            $scope.bookingInsertedPersonalInfo = [];
            $scope.bookingInserted = [];
            $http.get(HostPointHolder + '/api/HOTELManagement/insertHotelRoomBookingPersonalInfo/', { params: { firstName: $scope.firstName, lastName: $scope.lastName, cell: $scope.cell, email: $scope.email, skypeAddress: $scope.skypeAddress, IMOAddress: $scope.IMOAddress } }).success(function (data) {

                $scope.bookingInsertedPersonalInfo = data;
                console.log($scope.bookingInsertedPersonalInfo[0]);


                if ($scope.bookingInsertedPersonalInfo[0] > 0) {
                    $scope.BookingPersonInfoId = $scope.bookingInsertedPersonalInfo[0];



                    var dateHolderBookedDateFR = new Date($scope.BookedDateFR);
                    dateHolderBookedDateFR = apiDateTimeLocalize.getAddTimeOffInMin(dateHolderBookedDateFR);

                    var tempBookedDateFR = new Date(dateHolderBookedDateFR).toJSON();
                    tempBookedDateFR = tempBookedDateFR.substring(0, 10);


                    var dateHolderBookedDateTO = new Date($scope.BookedDateTO);
                    dateHolderBookedDateTO = apiDateTimeLocalize.getAddTimeOffInMin(dateHolderBookedDateTO);

                    var tempBookedDateTO = new Date(dateHolderBookedDateTO).toJSON();
                    tempBookedDateTO = tempBookedDateTO.substring(0, 10);

                    var sumTotalAmountPayed = parseFloat($scope.AdvancePayed) + parseFloat($scope.TotalAmountPayed);

                    $http.get(HostPointHolder + '/api/HOTELManagement/insertRoomBooking/',
                        {
                            params:
                              {
                                  BookingID: $scope.BookingID,
                                  BookingPersonInfoId: $scope.BookingPersonInfoId,
                                  RoomID: $scope.RoomIDs,
                                  BookedDateFR: tempBookedDateFR,
                                  BookedDateTO: tempBookedDateTO,
                                  BookingStatus: $scope.BookingStatus,
                                  PaymentStatus: $scope.PaymentStatus,
                                  AdvancePayed: $scope.AdvancePayed,
                                  TotalAmountPayed: sumTotalAmountPayed
                              }
                        }).success(function (data) {
                            $scope.bookingInserted = data;
                            cleardetails();
                            $scope.successMassage = 'Data is saved';
                            //selectRoomBookingDetails('');
                        })
                     .error(function () {

                         $scope.error = "An Error has occured while loading posts!";
                     });



                }
                else {
                    $scope.error = "An Error has occured while loading posts!";
                }

                //selectRoomBookingDetails('');
            }).error(function () {

                $scope.error = "An Error has occured while loading posts!";

            });
    };



    var getRoomVatBasedLastActiveDateUrl = HostPointHolder + '/api/RoomVats/';

    $scope.getRoomVatBasedLastActiveDate = function () {

        $http.get(getRoomVatBasedLastActiveDateUrl, { params: { id : 0 } }).success(function (data) {

           
            $scope.appliedVatPercentage = data;
            console.log($scope.appliedVatPercentage);

            $scope.VatPercent = $scope.appliedVatPercentage.VatAmount;
        })
        .error(function (err) {

            $scope.error = "An Error has occured while loading posts!";
        });



    }




    //Save Hotel Room
    $scope.saveRoom = function () {


        $http.get(HostPointHolder + '/api/HotelRoom/insertHotelRoom/', { params: { RoomNo: $scope.RoomNo, RoomType: $scope.RoomType, Prize: $scope.Prize } }).success(function (data) {
                $scope.roomInserted = data;
                cleardetails();
                selectRoomDetails('');
            })
         .error(function () {
             $scope.error = "An Error has occured while loading posts!";
         });


    };

  
    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };

    $scope.roomImagePath = '';
    $scope.showImage = function (RoomIDs) {

        if (apiDateTimeLocalize.isNumber(RoomIDs) == true) {
            $scope.roomImagePath = '';
            var RoomNoPic = { 'RoomNoPic': RoomIDs };

            $http({
                method: 'POST',
                url: HostPointHolder + '/HOTEL/HotelImageFileUpload/RoomPicture',
                data: Object.toparams(RoomNoPic),
                headers:
                  { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
            }).success(function (data) {
                $scope.roomImagePath = data;

                //var roomNo = { RoomNo: RoomIDs };
                $http({
                    method: 'GET',
                    url: HostPointHolder + '/api/RoomDiscounts/GetRoomDiscountsRoomBased/' + RoomIDs,
                    data: null,
                    headers:
                      { 'Content-Type': 'application/json' }
                }).success(function (data) {

                    $scope.roomDiscountInfo = data;


                }).error(function (err) {

                    $scope.error = "An Error has occured while loading posts!";
                });

            }).error(function (err) {

                $scope.error = "An Error has occured while loading posts!";
                $scope.roomImagePath = '';


            });

        }

    }



    $scope.checkFromdateTodate = function (FromDate, ToDate) {

        if (apiDateTimeLocalize.isDate(FromDate) == true && apiDateTimeLocalize.isDate(ToDate) == true) {

            var fDate = new Date(FromDate);
            var tDate = new Date(ToDate);
            if (fDate > tDate) {
                $scope.roomDiscountError = 'End date can not be greater than Start date';
                $scope.newRoomDiscount.FromDate = '';
                $scope.newRoomDiscount.ToDate = '';

            } else {
                $scope.roomDiscountError = '';

            }

        }


    }



    $scope.minDate = function () {
        var createDate = new Date();
        return new Date(apiDateTimeLocalize.getAddTimeOffInMin(createDate));
    };



    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(new Date().getFullYear() + 1, 12, 31),
        minDate: $scope.minDate(),
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