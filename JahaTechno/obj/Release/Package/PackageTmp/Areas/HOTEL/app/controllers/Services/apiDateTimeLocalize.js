angular.module("hotelApp")
.factory("apiDateTimeLocalize", function () {
    return {
        isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        ,
        isDate: function (sDate) {
            var scratch = new Date(sDate);
            if (scratch.toString() == "NaN" || scratch.toString() == "Invalid Date")
            { return false; }
            else
            {
                return true;
            }
        }
        ,
        getAddTimeOffInMin: function (date) {

            var localDateInstance = new Date();

            localDateInstance = new Date(date);


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



    };
})