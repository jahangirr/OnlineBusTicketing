angular.module("commonApp")
.factory("loginSvc", function ($http) {
    return {

       
        login: function (u, p) {

           
           
            return $http({
                url: "http://localhost:50162/Token",
                method: "POST",
                data: $.param({ grant_type: 'password', username: u, password: p }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            
          
        },
        register: function (e, p, cp) {

            return  $http({
                url: "http://localhost:50162/api/Account/Register",
                method: "POST",
                data: $.param({Email: e, Password: p, ConfirmPassword: cp}),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

            });
           
        }
        
    };
});

