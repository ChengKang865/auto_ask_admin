app.controller('serviceModifyCtrl', ['$scope', 'autoaskService', 'ueditorService', '$location', '$stateParams', function ($scope, autoaskService, ueditorService, $location, $stateParams) {
    $scope.init = function () {
        $scope.data = {};

        $scope._simpleConfig = ueditorService.getConfig();
        ueditorService.ueditorInit();

        // 地址控制
        $scope.provinces = [];
        $scope.cities = [];
        $scope.regions = [];
        $scope.streets = [];

        // 加载省份列表
        autoaskService.getProvinces(function (provinces) {
            $scope.provinces = provinces;
            $scope.jurProvinces = provinces;
        });
    };

    $scope.provinceChanged = function (province) {
        return autoaskService.getCities(province, function (cities) {
            $scope.cities = cities;
            $scope.regions = [];
            $scope.streets = [];
            $scope.outlets.address.city = '';
            $scope.outlets.address.region = '';
            $scope.outlets.address.street = '';
            $scope.outlets.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.outlets.address.region = '';
            $scope.outlets.address.street = '';
            $scope.outlets.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.outlets.address.street = '';
            $scope.outlets.address.detail = '';
        })
    };
    // 获取信息
    $scope.loadingPromise = autoaskService.getRichTextDetail({
        id: $stateParams.id
    }, function (resp) {
        $scope.data = resp.data;
    });
    $scope.saveActivity = function () {
        autoaskService.modifyService($scope.data, function (resp) {
            swal("操作成功", "", "success");
            $location.path('/app/config/service/list');
        });
    };

    $scope.init();
}]);