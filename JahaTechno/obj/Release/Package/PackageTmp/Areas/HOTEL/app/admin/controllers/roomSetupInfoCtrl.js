angular.module("hotelAdminApp")
.controller("roomSetupInfoCtrl",['$scope', '$http', '$location', 'apiCallSvc', 'authLocalStorageSvc', 'hotelManagementUrl', function ($scope, $http, $location, apiCallSvc, authLocalStorageSvc, hotelManagementUrl) {

  // var HostPointHolder = 'http://localhost:50162';
    var HostPointHolder = 'http://www.jahatechno.com';

    $scope.authRoomSetupInfoCtrl = {};
    $scope.authRoomSetupInfoCtrl = authLocalStorageSvc.getAuthData();
    if (!$scope.authRoomSetupInfoCtrl.isAuthenticated) {

        $location.path("/login")
    }


    $scope.model.roomSetupInfo = [];
    $scope.roomSetupInfoError = "";
    $scope.newroomSetupInfo = {};
    $scope.temp = null;


        $scope.GetExistRoomCorrespondingDiscount = [];
        var GetExistRoomCorrespondingDiscountUrl = hotelManagementUrl + '/GetExistRoomCorrespondingDiscount';

        apiCallSvc.get(GetExistRoomCorrespondingDiscountUrl, { Authorization: "Bearer " + $scope.authRoomSetupInfoCtrl.accToken }, null)
       .success(function (data) {
           $scope.GetExistRoomCorrespondingDiscount = data;
       })
       .error(function (err) {
           $scope.roomSetupInfoError = err.Message;
       });




    


    var getHotelRoomsUrl = hotelManagementUrl + '/getHotelRooms?RoomNoAll';
    var RoomNoAll = { RoomNoAll : null };
    apiCallSvc.get(getHotelRoomsUrl, { Authorization: "Bearer " + $scope.authRoomSetupInfoCtrl.accToken }, RoomNoAll)
    .success(function (data) {
        $scope.model.roomSetupInfo = data;    
    })
    .error(function (err) {
        $scope.roomSetupInfoError = err.Message;
    });



    $scope.addRoomSetupInfo = function () {
        $("#addRoomSetupInfoModal").modal("show");
    }

    $scope.insertRoomSetupInfo = function () {

        var insertHotelRoomUrl = hotelManagementUrl + '/insertHotelRoom';
       

        var data = { RoomNo: $scope.newroomSetupInfo.RoomNo, RoomType: $scope.newroomSetupInfo.RoomType, Prize: $scope.newroomSetupInfo.Prize };

        apiCallSvc.get(insertHotelRoomUrl, { Authorization: "Bearer " + $scope.authRoomSetupInfoCtrl.accToken }, data)
                .success(function (data) {


                    apiCallSvc.get(getHotelRoomsUrl, { Authorization: "Bearer " + $scope.authRoomSetupInfoCtrl.accToken }, null)
                    .success(function (data) {
                     $scope.model.roomSetupInfo = data;
                    })
                    .error(function (err) {
                    $scope.roomSetupInfoError = err.Message;
                    });

                    $("#addRoomSetupInfoModal").modal("hide");
                    $scope.newroomSetupInfo = null;


            })
            .error(function (err) {
                $scope.roomSetupInfoError = err.Message;
            });
        

    }

    $scope.delete = function (RoomSetupInfo) {
        $scope.temp = RoomSetupInfo;
        $("#deleteRoomSetupInfo").modal("show");
    }
    $scope.deleteRoomSetupInfoConfirm = function () {

        if ($scope.authRoomSetupInfoCtrl.isAuthenticated) {

            var getHotelRoomsUrl = hotelManagementUrl + '/deleteRoomSetupInfo?DeleteRoomNo=' + $scope.temp.RoomNo;
            apiCallSvc.get(getHotelRoomsUrl, { Authorization: "Bearer " + $scope.authRoomSetupInfoCtrl.accToken }, null)
            .success(function (data) {

                var i = $scope.model.roomSetupInfo.indexOf($scope.temp);
                $scope.model.roomSetupInfo.splice(i, 1);
                $("#deleteRoomSetupInfo").modal("hide");     

            })
            .error(function (err) {

                $scope.roomSetupInfoError = err.Message;
                $("#deleteRoomSetupInfo").modal("hide");
            });
        }
    }




    $scope.fileList = [];
    $scope.ImageProperty = {
        file: ''
    }

    $scope.setFile = function (element) {

        $scope.fileList = [];
        // get the files
        var files = element.files;
        for (var i = 0; i < files.length; i++) {

            $scope.ImageProperty.file = files[i];
            $scope.fileList.push($scope.ImageProperty);
            $scope.ImageProperty = {};


        }
    }


    $scope.UploadFile = function () {


        for (var i = 0; i < $scope.fileList.length; i++) {

            $scope.UploadFileIndividual($scope.fileList[i].file,
                                        $scope.newroomSetupInfo.RoomNo +'_____' + $scope.fileList[i].file.name,
                                        $scope.fileList[i].file.type,
                                        $scope.fileList[i].file.size,
                                        i);

        }

    }


    $scope.UploadFileIndividual = function (fileToUpload, name, type, size, index) {

        $scope.fileUploaedStatus = '';

        var reqObj = new XMLHttpRequest();

        reqObj.addEventListener("load", uploadComplete, false)
        reqObj.addEventListener("error", uploadFailed, false)
        reqObj.open("POST", HostPointHolder + '/HotelImageFileUpload/UploadFiles', true);
        //set Content-Type at request header.For file upload it's value must be multipart/form-data
        reqObj.setRequestHeader("Content-Type", "multipart/form-data");
        //Set Other header like file name,size and type
        reqObj.setRequestHeader('X-File-Name', name);
        reqObj.setRequestHeader('X-File-Type', type);
        reqObj.setRequestHeader('X-File-Size', size);
        reqObj.send(fileToUpload);

    }

    function uploadComplete() {
        $scope.fileUploaedStatus = ' Uploaded';
        $scope.$apply();
    }

    function uploadFailed() {
        $scope.fileUploaedStatus = 'Not Uploaded';
        $scope.$apply();
    }

   

  


    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };




    $scope.DeleteFile = function () {

        var RoomNo = { 'RoomNo': $scope.newroomSetupInfo.RoomNo };

        $http({
            method: 'POST',
            url: HostPointHolder + '/HotelImageFileUpload/DeleteFile',
            data: Object.toparams(RoomNo),
            headers:
              { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        }).success(function (data) {



        }).error(function () {

            alert('Picture not deleted successfully ');

        });
    }

    $scope.roomImagePath = '';
    $scope.showImage = function (RoomSetupInfo) {

        $scope.roomImagePath = '';
        var RoomNoPic = { 'RoomNoPic': RoomSetupInfo.RoomNo };

        $http({
            method: 'POST',
            url: HostPointHolder + '/HotelImageFileUpload/RoomPicture',
            data: Object.toparams(RoomNoPic),
            headers:
              { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        }).success(function (data) {

            console.log('roomImagePath')
            console.log(data);
            console.log('roomImagePath')

            $scope.roomImagePath = data;
          
        }).error(function () {
            
            $scope.roomImagePath = '';
            console.log('roomImagePath');
            console.log($scope.roomImagePath);
            console.log('roomImagePath');
           

        });

    }



   
}]);