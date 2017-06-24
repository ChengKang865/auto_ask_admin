app.controller('invoiceModifyCtrl', ['$scope', 'autoaskService', '$location', function ($scope, autoaskService, $location) {
    $scope.action = 'edit';

    $scope.vatInvoice = {};

    // 初始化
    $scope.init = function () {
        $scope.loadingPromise = autoaskService.getVatInfo(null, function (resp) {
            $scope.vatInvoice = resp.data;
        });

        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };


    $scope.updateVatInvoice = function () {
        $scope.loadingPromise = autoaskService.updateVatInfo($scope.vatInvoice, function () {
            swal('发票信息修改成功', '', 'success');
            $location.path('app/factoryInfo/invoice/detail');
        })
    };

    $scope.init();
}]);