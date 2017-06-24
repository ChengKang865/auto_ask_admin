app.controller('partnerDetailCtrl', ['$scope', 'autoaskService', 'areaService', function ($scope, autoaskService, areaService) {
    $scope.action = 'info';

    $scope.partner = {};

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
            $scope.partner.address.city = '';
            $scope.partner.address.region = '';
            $scope.partner.address.street = '';
            $scope.partner.address.detail = '';
        })
    };
    $scope.cityChanged = function (province, city) {
        return autoaskService.getRegions(province, city, function (regions) {
            $scope.regions = regions;
            $scope.streets = [];
            $scope.partner.address.region = '';
            $scope.partner.address.street = '';
            $scope.partner.address.detail = '';
        })
    };
    $scope.regionChanged = function (province, city, region) {
        return autoaskService.getStreets(province, city, region, function (streets) {
            $scope.streets = streets;
            $scope.partner.address.street = '';
            $scope.partner.address.detail = '';
        })
    };

    // 初始化
    $scope.init = function () {

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });


        $scope.loadingPromise = autoaskService.getPartner(null, function (resp) {
            $scope.partner = resp.data;
            var address = angular.copy($scope.partner.address);
            $scope.provinceChanged(address.province);
            $scope.cityChanged(address.province, address.city);
            $scope.regionChanged(address.province, address.city, address.region).then(function () {
                    $scope.partner.address = address;
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