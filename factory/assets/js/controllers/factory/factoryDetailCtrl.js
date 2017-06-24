app.controller('factoryDetailCtrl', ['$scope', 'autoaskService', 'areaService', function ($scope, autoaskService, areaService) {
    $scope.action = 'info';

    $scope.factory = {};

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
            $scope.factory.address.city = '';
            $scope.factory.address.region = '';
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.factory.address.region = '';
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.factory.address.street = '';
            $scope.factory.address.detail = '';
        })
    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });


        $scope.loadingPromise = autoaskService.getFactory(null, function (resp) {
            $scope.factory = resp.data;
            var address = angular.copy($scope.factory.address);
            $scope.provinceChanged(address.province);
            $scope.cityChanged(address.province, address.city);
            $scope.regionChanged(address.province, address.city, address.region).then(function () {
                    $scope.factory.address = address;
                }
            );
        });

        if ($scope.action == 'info') {
            $('input').attr('disabled', true).attr('placeholder', '');
            $('select').attr('disabled', true);
        }
    };
    $scope.init();
}]);