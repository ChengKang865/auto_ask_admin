app.controller('bindQRCodeModifyCtrl', ['$scope', 'autoaskService', '$location', function ($scope, autoaskService, $location) {
    $scope.init = function () {
        $scope.qrCode = '';
        $scope.loadingPromise = autoaskService.getSelfQRCode(null, function (resp) {
            $scope.qrCode = resp.data;
        });
    };

    $scope.updateSelfQRCode = function () {
        if ($scope.qrCode === undefined || $scope.qrCode === null || $scope.qrCode === '') {
            swal('二维码不能为空', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.updateSelfQRCode({code: $scope.qrCode}, function () {
            swal('更新二维码成功', '', 'success');
            $location.path('app/partnerInfo/qrcode/detail');
        })
    };

    $scope.init();
}]);