angular.module("commonApp").controller("orderFormController", ['$location','$scope','$http','apiCallSvc',
function ($location, $scope, $http, apiCallSvc) {


   // var HostPoint = 'http://localhost:50162';

    var HostPoint = 'http://www.jahatechno.com';

    $scope.cell = '';

    $scope.FormReset = function () {
        $scope.cell = '';
        $scope.fileList = [];
        $scope.fileListAll = [];
        $scope.email = '';
        $scope.name = '';
        $scope.description = '';
        $scope.numberOfDays = '';
        $scope.budget ='';
        $scope.budgetCurrency = '';

    };

    $scope.FormCancel = function () {

        $location.path('/home');

    };

   

    $scope.fileList = [];
    $scope.ImageProperty = {
        file: ''
    }


    $scope.fileListAll = [];
    $scope.setFile = function (element) {
        
        $scope.fileList = [];
        // get the files
        var files = element.files;
        for (var i = 0; i < files.length; i++) {

            $scope.ImageProperty.file = files[i];
            $scope.fileList.push($scope.ImageProperty);
            $scope.fileListAll.push($scope.ImageProperty);
            $scope.ImageProperty = {};

            console.log($scope.fileListAll);

        }
    }




    // ______ is the separator....

    $scope.UploadFile = function () {

        for (var i = 0; i < $scope.fileList.length; i++) {

            $scope.UploadFileIndividual($scope.fileList[i].file,
                                       $scope.cell +'_____' + $scope.fileList[i].file.name ,
                                        $scope.fileList[i].file.type,
                                        $scope.fileList[i].file.size,
                                        i);

        }

    }


    $scope.UploadFileIndividual = function (fileToUpload, name, type, size, index) {
        //Create XMLHttpRequest Object
        var reqObj = new XMLHttpRequest();
        //event Handler
       
        reqObj.open("POST", HostPoint + '/OrderFileUpload/UploadFiles', true);
        //set Content-Type at request header.For file upload it's value must be multipart/form-data
        reqObj.setRequestHeader("Content-Type", "multipart/form-data");
        //Set Other header like file name,size and type
        reqObj.setRequestHeader('X-File-Name', name);
        reqObj.setRequestHeader('X-File-Type', type);
        reqObj.setRequestHeader('X-File-Size', size);


        // send the file
        reqObj.send(fileToUpload);

     

    }


    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };




    $scope.DeleteFile = function (fileObjectForDelete) {

        var fileName ={ 'fileName' : $scope.cell + '_____' + fileObjectForDelete.file.name};

        $http({
            method: 'POST',
            url: HostPoint + '/OrderFileUpload/DeleteFile',
            data: Object.toparams(fileName),
            headers:
              { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        }).success(function (data) {

            $.each($scope.fileListAll, function (i) {
                if ($scope.fileListAll[i].file.name === fileObjectForDelete.file.name) {
                    $scope.fileListAll.splice(i, 1);
                    return false;
                }
            });
            
        }).error(function () {

            alert('Picture not deleted successfully ');

        });


    }

    $scope.skypeAddress ='';
    $scope.imoAddress = '';

    $scope.FormDataSave = function () {

        var order = {
            'orderId' : 0 ,
            'name': $scope.name,
            'cell':  $scope.cell ,
            'email': $scope.email,
            'skypeAddress': $scope.skypeAddress,
            'imoAddress':$scope.imoAddress,
            'description':  $scope.description ,
            'numberOfDays': $scope.numberOfDays,
            'budget': $scope.budget,
            'budgetCurrency': $scope.budgetCurrency
        };

        $http({
            method: 'POST',
            url: HostPoint + '/Orders/OrderPost',
            data: Object.toparams(order),
            headers:
              { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
        }).success(function (data) {

            console.log('Success')
            console.log(data);
            console.log('Success')
            $scope.FormReset();
           
        }).error(function (err) {
            console.log('error')
            console.log(err.message);
            console.log('error')
            alert('operation  aborted..');
        });
    }



    }]);