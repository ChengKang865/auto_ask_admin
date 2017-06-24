app.controller("ueditorEditCtrl", ["$scope", "autoaskService", '$q', function ($scope, autoaskService, $q) {
    $scope.init = function () {
        // 初始化日期插件
        $('#datetimepicker').datetimepicker({
            step:1
        });

        $('#datetimepicker5').datetimepicker({
            datepicker:false,
            format:'H:i',
            step:1
        });
    };

    $scope.printDateTime = function () {
        console.log($scope.date);
    };

    //导出csv
    // 导出cvs
    $scope.filename = "test";

    $scope.getDataList = function() {
        var deferred = $q.defer();

        autoaskService.goodsNumRecordList({
            page: 1,
            count: 10000,
            addType: true
        }, function (resp) {
            deferred.resolve(resp.data.result);
        });

        return deferred.promise;
    };

    $scope.getHeader = function () {
        return ["发货单号", "发货时间", "具体商品", "收货方"]
    };

    $scope.init();
}]);