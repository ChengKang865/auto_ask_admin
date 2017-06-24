app.controller("noticeDetailCtrl", ["$scope", "autoaskService", "ngTableParams", "$location", "areaService", '$stateParams', function ($scope, autoaskService, ngTableParams, $location, areaService, $stateParams) {
    $scope.init = function () {
        $scope.notice = {};

        // 地址控制
        $scope.address = {
            provinces: '',
            cities: '',
            regions: ''
        };
        $scope.provinces = [];
        $scope.cities = [];
        $scope.regions = [];

        //加载省份列表
        $scope.loadingPromise = areaService.loadRegion().then(function () {
            $scope.provinces = areaService.getProvinces();
        });

        $scope.loadingPromise = autoaskService.getNotice({id: $stateParams.id}, function (resp) {
            $scope.notice = resp.data;
        });

        $('input').attr('disabled', true).attr('placeholder', '');
        $('select').attr('disabled', true);
    };

    $scope.init();
}]);