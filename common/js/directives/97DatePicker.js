'use strict';
app.directive('97DatePicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            minDate: '@'
        },
        link: function (scope, element, attr, ngModel) {

            element.val(ngModel.$viewValue);

            function onpicking(dp) {
                var date = dp.cal.getNewDateStr();
                scope.$apply(function () {
                    ngModel.$setViewValue(date);
                });
            }

            element.bind('click', function () {
                WdatePicker({
                    onpicking: onpicking,
                    dateFmt: 'yyyy-MM-dd',
                    minDate: (scope.minDate || '%y-%M-%d')
                })
            });
        }
    };
});