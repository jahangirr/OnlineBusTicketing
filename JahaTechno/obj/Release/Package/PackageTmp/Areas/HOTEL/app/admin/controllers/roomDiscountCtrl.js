angular.module("hotelAdminApp")
.controller("roomDiscountCtrl", function ($filter, $scope, $http, $location, apiCallSvc, authLocalStorageSvc,apiDateTimeLocalize, hotelManagementUrl) {

  //  var HostPoint = 'http://localhost:50162';
   var HostPoint = 'http://www.jahatechno.com';

    $scope.authRoomDiscountCtrl = {};
    $scope.authRoomDiscountCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authRoomDiscountCtrl.isAuthenticated) {

        $location.path("/login")
    }


    $scope.newRoomDiscount = null;
    $scope.temp = null;
    $scope.roomDiscountError = "";

    var getRoomDiscountUrl = HostPoint + '/api/RoomDiscounts';

    apiCallSvc.get(getRoomDiscountUrl, { Authorization: "Bearer " + $scope.authRoomDiscountCtrl.accToken }, null)
    .success(function (data) {

        console.log(data);

        $scope.model.allRoomDiscount = data;
    })
    .error(function (err) {

        $scope.roomDiscountError = err.message;
    });

    $scope.createRoomDiscount = function () {
        $("#addRoomDiscount").modal("show");
    }



    $scope.checkFromdateTodate = function (FromDate, ToDate) {

        if (apiDateTimeLocalize.isDate(FromDate) == true && apiDateTimeLocalize.isDate(ToDate) == true)
        {

            var fDate = new Date(FromDate);
            var tDate = new Date(ToDate);
            if(fDate>tDate)
            {
                $scope.roomDiscountError = 'End date can not be greater than Start date';
                $scope.newRoomDiscount.FromDate = '';
                $scope.newRoomDiscount.ToDate = '';

            } else {
                $scope.roomDiscountError = '';

            }

        }
            

    }


    $scope.GetExistRoomValid = [];
    var GetExistRoomValidUrl = hotelManagementUrl + "/GetExistRoomValid?falseParam=''";
    apiCallSvc.get(GetExistRoomValidUrl, { Authorization: "Bearer " + $scope.authRoomDiscountCtrl.accToken }, null)
       .success(function (data) {
           $scope.GetExistRoomValid = data;
       })
       .error(function (err) {

           
           $scope.roomDiscountError = err.Message;
       });





    var PostRoomDiscountUrl = HostPoint + '/api/RoomDiscounts';
    $scope.saveRoomDiscount = function () {
        
       
        $scope.newRoomDiscount.FromDate = new Date( apiDateTimeLocalize.getAddTimeOffInMin($scope.newRoomDiscount.FromDate));
       
        $scope.newRoomDiscount.ToDate = new Date( apiDateTimeLocalize.getAddTimeOffInMin($scope.newRoomDiscount.ToDate));


                apiCallSvc.post(PostRoomDiscountUrl, { Authorization: "Bearer " + $scope.authRoomDiscountCtrl.accToken }, $scope.newRoomDiscount)
               .success(function (data) {
                   $scope.model.allRoomDiscount.push(data);
                   $("#addRoomDiscount").modal("hide");
                   $scope.newRoomDiscount = null;

               })
                .error(function (err) {
                    $scope.roomDiscountError = err.message;
                });


    }



    $scope.edit = function (obj) {
        $scope.temp = obj;
        $scope.temp.FromDate = new Date($scope.temp.FromDate.substring(0, 10));
        $scope.temp.ToDate = new Date($scope.temp.ToDate.substring(0, 10));
        $("#editRoomDiscount").modal("show");
    };



   


    $scope.UpdateRoomDiscount = function () {
 
        var id = $scope.temp.RoomDiscountId;
        
        apiCallSvc.put(PostRoomDiscountUrl + "/" + id, { Authorization: "Bearer " + $scope.authRoomDiscountCtrl.accToken }, $scope.temp)
        .success(function (data) {

            $scope.temp = null;
            $("#editRoomDiscount").modal('hide');
        })
        .error(function (err) {

            $scope.roomDiscountError = err.message;

            $("#editRoomDiscount").modal('hide');
        });
    }


    //$scope.UpdateRoomDiscount = function () {

    //    var tempValue = $scope.temp;
    //    $scope.UpdateRoomDiscountInterface(tempValue);


    //}

    //$scope.UpdateRoomDiscountInterface = function (temp) {

    //    alert('update is missing ....');
    //    var reqObj = new XMLHttpRequest();
    //    reqObj.addEventListener("load", updateComplete, false)
    //    reqObj.addEventListener("error", updateFailed, false)
    //    reqObj.open("POST", HostPoint + '/RoomDiscounts/PutRoomDiscount', true);
    //    //set Content-Type at request header.For file upload it's value must be multipart/form-data
    //    reqObj.setRequestHeader("Content-Type", "application/json");
    //    reqObj.send(temp);

    //}

    function updateComplete() {

        $scope.temp = null;
        $("#editRoomDiscount").modal('hide');
        $scope.$apply();
    }

    function updateFailed() {

        $scope.roomDiscountError = err.message;
        $("#editRoomDiscount").modal('hide');
        $scope.$apply();
    }


    $scope.delete = function (obj) {
        $scope.temp = obj;
        $("#deleteRoomDiscount").modal("show");
    };



    $scope.deleteRoomDiscount = function () {
        

        apiCallSvc.remove(PostRoomDiscountUrl +'/'+ $scope.temp.RoomDiscountId , { Authorization: "Bearer " + $scope.authRoomDiscountCtrl.accToken }, null)
        .success(function (data) {
            console.log('Success');
            console.log($scope.model.allRoomDiscount);
            console.log('Sepraton');
            var i = $scope.model.allRoomDiscount.indexOf($scope.temp);
            $scope.model.allRoomDiscount.splice(i, 1);
            console.log($scope.model.allRoomDiscount);
            console.log('Success');
            $scope.temp = null;
            $("#deleteRoomDiscount").modal('hide');
        })
        .error(function (err) {
            console.log('Eorrors ');
            $scope.roomDiscountError = err.message;
            console.log($scope.roomDiscountError);
            $("#deleteRoomDiscount").modal('hide');
            console.log('Eorrors ');
        });
    }


    $scope.minDate = function () {
       var createDate = new Date();
       return new Date(apiDateTimeLocalize.getAddTimeOffInMin(createDate));
    };
    
   

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(new Date().getFullYear() + 1, 12, 31),
        minDate:$scope.minDate(),
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