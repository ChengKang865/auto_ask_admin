app.controller('invoiceDetailCtrl', ['$scope', 'autoaskService', '$location', '$stateParams', 'ngTableParams', function ($scope, autoaskService) {
    $scope.action = 'info';

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
    $scope.init();

}]);