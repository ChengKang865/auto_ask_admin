app.controller('orderDetailCtrl', ['$scope', 'autoaskService', '$location', '$stateParams', 'ngTableParams', function ($scope, autoaskService, $location, $stateParams, ngTableParams) {
    $scope.init = function () {
        var orderId = $stateParams.id;
        $scope.loadingPromise = autoaskService.getOrderDetail({orderId: orderId}, function (resp) {
            $scope.order = resp.data;
        });

    };

    $scope.init();
}]);