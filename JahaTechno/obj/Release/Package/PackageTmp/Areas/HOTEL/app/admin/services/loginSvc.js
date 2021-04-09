angular.module("hotelAdminApp")
.factory("loginSvc", function ($http) {
    return {
  
        login: function (u, p) {


            //http://localhost:50162/Token
            //http://www.jahatechno.com/Token

            
            return $http({
                url: "http://www.jahatechno.com/Token",
                method: "POST",
                data: $.param({ grant_type: 'password', username: u, password: p }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            
          
        },
        register: function (e, p, cp) {

            //for deve  //http://localhost:50162/api/Account/Register
            // for host  //http://www.jahatechno.com/api/Account/Register


            return  $http({
                url: "http://www.jahatechno.com/api/Account/Register",
                method: "POST",
                data: $.param({Email: e, Password: p, ConfirmPassword: cp}),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

            });
           
        }
        
    };
});

