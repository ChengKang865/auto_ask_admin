app.controller('serviceProviderDetailCtrl', function ($scope, areaService, autoaskService) {

    $scope.action = 'info';

    $scope.serviceProvider = {};

    // 地址控制
    $scope.provinces = [];
    $scope.cities = [];
    $scope.regions = [];
    $scope.streets = [];

    $scope.provinceChanged = function (province) {
        return autoaskService.getCities(province, function (cities) {
            $scope.cities = cities;
            $scope.regions = [];
            $scope.streets = [];
            $scope.serviceProvider.address.city = '';
            $scope.serviceProvider.address.region = '';
            $scope.serviceProvider.address.street = '';
            $scope.serviceProvider.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.serviceProvider.address.region = '';
            $scope.serviceProvider.address.street = '';
            $scope.serviceProvider.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.serviceProvider.address.street = '';
            $scope.serviceProvider.address.detail = '';
        })
    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });

        // 确定操作类型
        if ($scope.action == 'add') {
            // 什么都不做
        } else {
            $scope.loadingPromise = autoaskService.getServiceProvider(null, function (resp) {
                $scope.serviceProvider = resp.data;
                var address = angular.copy($scope.serviceProvider.address);
                $scope.provinceChanged(address.province);
                $scope.cityChanged(address.province, address.city);
                $scope.regionChanged(address.province, address.city, address.region).then(function () {
                        $scope.serviceProvider.address = address;
                    }
                );
            });
        }
        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };
    $scope.init();

});