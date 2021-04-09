angular.module("commonApp")
.factory("authLocalStorageSvc", function () {
    return {
        getAuthData: function () {
            if (sessionStorage.length > 0) {
                console.log("no");
                return angular.fromJson(sessionStorage.getItem("auth"));
            }
            else {
                return {};
            }
        },
        saveAuthData: function (u, a) {
            sessionStorage.setItem("auth", JSON.stringify({ user: u, accToken: a, isAuthenticated: true }));
        },
        removeAuthData: function () {
            sessionStorage.removeItem("auth");
        }
    }
});
