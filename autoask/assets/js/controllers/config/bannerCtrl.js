'use strict';

/**
 * 列表页面控制器
 */
app.controller('bannerCtrl', function ($scope, $rootScope, autoaskService, commonService) {

    $scope.channel = 'pc';

    // 查询
    $scope.query = function () {
        $rootScope.loadingPromise = autoaskService.getBannerList({channel: $scope.channel}, function (resp) {
            $scope.bannerList = resp.data;
        });
    };


    $scope.uploadImage = function (element) {
        if (element.files.length === 0)
            return;
        var file = element.files[0];
        var listName = element.getAttribute("list-bind");
        var listIndex = parseInt(element.getAttribute("list-index"));
        var formData = new FormData();
        formData.append('file', file);
        autoaskService.uploadFile(formData, function (resp) {
            $scope[listName][listIndex].picUrl = resp.data;
        })
    };

    $scope.addBanner = function () {
        if (commonService.isUndefinedOrNull($scope.bannerList)) {
            $scope.bannerList = [];
        }
        $scope.bannerList.push({});

    };

    $scope.deleteBanner = function (index) {
        $scope.bannerList.splice(index, 1);
    };

    $scope.submit = function () {
        $rootScope.loadingPromise = autoaskService.updateBannerList({
            "channel": $scope.channel,
            "bannerList": $scope.bannerList
        }, function (resp) {

            swal("更新成功", "", "success");

        });
    };

    $scope.query();
});