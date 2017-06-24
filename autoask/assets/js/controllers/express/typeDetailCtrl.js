app.controller("expressTypeDetailCtrl", ["$scope", "autoaskService", "$stateParams", function ($scope, autoaskService, $stateParams) {
    $scope.init = function () {
        $scope.express = {};
        $scope.loadingPromise = autoaskService.getExpressType({id: $stateParams.id}, function (resp) {
            $scope.express = resp.data;
        });
    };
    $('input').attr('disabled', true).attr('placeholder', '');

    $scope.init();
}]);