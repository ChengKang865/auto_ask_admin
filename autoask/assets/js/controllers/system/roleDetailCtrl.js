app.controller("roleDetailCtrl", ["$scope", "autoaskService", "$stateParams", function ($scope, autoaskService, $stateParams) {
    $scope.init = function () {
        $scope.staff = {};
        $scope.loadingPromise = autoaskService.getStaff({id: $stateParams.id}, function (resp) {
            $scope.staff = resp.data;
        });
    };
    $('input').attr('disabled', true).attr('placeholder', '');
    $('select').attr('disabled', true);

    $scope.init();
}]);