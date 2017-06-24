app.controller('bindQRCodeDetailCtrl', ['$scope', 'autoaskService', '$location', '$stateParams', 'ngTableParams', function ($scope, autoaskService, $location, $stateParams, ngTableParams) {
    $scope.init = function () {
        $scope.qrCode = '';
        $scope.loadingPromise = autoaskService.getSelfQRCode(null, function (resp) {
            $scope.qrCode = resp.data;
        });
    };

    $scope.init();
}]);