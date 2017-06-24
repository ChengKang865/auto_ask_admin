'use strict';

/**
 * 列表页面控制器
 */
app.controller('indexProductCtrl', function ($scope, $rootScope, autoaskService, commonService) {


    $scope.loadingPromise = autoaskService.getProductList({productCategoryId: null}, function (resp) {
        $scope.products = resp.data.result;
    });

    $scope.channel = "pc";
    $scope.label = "new_gen";


    // 查询
    $scope.query = function () {
        $scope.loadingPromise = autoaskService.getIndexProductList({
            channel: $scope.channel,
            label: $scope.label
        }, function (resp) {
            $scope.indexProductList = resp.data;
            //for(var index in $scope.indexProductList) {
            //    if($scope.indexProductList[index].picUrl === undefined || $scope.indexProductList[index].picUrl === null) {
            //        $scope.indexProductList[index].picUrl = undefined;
            //    }
            //}
        });
    };

    $scope.addIndexProduct = function () {
        if (commonService.isUndefinedOrNull($scope.indexProductList)) {
            $scope.indexProductList = [];
        }
        $scope.indexProductList.push({});
    };

    $scope.deleteIndexProduct = function (index) {
        $scope.indexProductList.splice(index, 1);
    };

    $scope.submit = function () {
        $rootScope.loadingPromise = autoaskService.updateIndexProductList({
            "channel": $scope.channel,
            "label": $scope.label,
            "indexProductList": $scope.indexProductList
        }, function (resp) {
            swal("更新成功", "", "success");
        });
    };

    //上传图片
    $scope.uploadImage = function (element) {
        if (element.files.length === 0)
            return;
        var index = element.id.split("-")[1];
        var file = element.files[0];
        var formData = new FormData();
        formData.append('file', file);
        $scope.loadingPromise = autoaskService.uploadFile(formData, function (resp) {
            var indexProduct = $scope.indexProductList[index];
            if (commonService.isUndefinedOrNull(indexProduct)) {
                indexProduct = {};
            }
            indexProduct.picUrl = resp.data;
            $scope.indexProductList[index] = indexProduct;
        })
    };

    $scope.query();
});