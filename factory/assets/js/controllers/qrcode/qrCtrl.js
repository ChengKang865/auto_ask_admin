'use strict';


/**
 * 商品列表
 */
app.controller('qrListCtrl', function ($scope, autoaskService, $timeout, ngTableParams, $state, commonService) {

});


/**
 * 商品详情
 */
app.controller('qrDetailCtrl', function ($scope, autoaskService, $timeout, commonService, $stateParams) {
    // 判断类型: edit, add, info
    $scope.action = $stateParams.action;
    $scope.id = $stateParams.id;
    $scope.status = $stateParams.status;
    
});