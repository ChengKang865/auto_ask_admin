app.controller("qrCodeInfoListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {
            page: 1,
            count: 10
        };
        $scope.tableParams.reload();
        //弹窗默认是关闭状态
        $scope.updateExpressFlag = false;
        $scope.imgView = false;
        $scope.expireSecondsDiv = false;
        $scope.expireSeconds = null;
        $scope.type = 'QR_LIMIT_STR_SCENE';
        $scope.data = [];

    };
    $scope.subscribeCount = 0;

    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            $scope.loadingPromise = autoaskService.getWeiXinQrcodeInfoList($scope.criteria, function (resp) {
                if (resp.data.list === undefined || resp.data === null) {
                    resp.data.list = {};
                    resp.data.list.total = 0;
                    resp.data.list.result = [];
                }
                $scope.data = resp.data.list.result === null ? [] : resp.data.list.result;
                params.total(resp.data.list.total);
                $scope.subscribeCount = resp.data.subscribeCount;
                $defer.resolve([$scope.data]);
            });
        }
    });

    //显示窗口
    $scope.showqrCodeInfoAdd = function () {
        $scope.updateExpressFlag = true;
    };
    //隐藏窗口
    $scope.hidePromote = function () {
        $scope.updateExpressFlag = false;
        $scope.name = null;
        $scope.type = null
        $scope.expireSecondsDiv = false;
        $scope.expireSeconds = null;
        $scope.type = 'QR_LIMIT_STR_SCENE';
    };

    $scope.hideImgView = function () {
        $scope.imgView = false;
    };
    //添加操作
    $scope.saveInfo = function () {
        if ($scope.name === undefined || $scope.name === null || $scope.name === '') {
            swal("名称不能为空", "", "error");
            return;
        }
        console.log($scope.expireSeconds);
        $scope.loadingPromise = autoaskService.insertWeiXinQrcodeInfo({
            name: $scope.name,
            type: $scope.type,
            expireSeconds: $scope.expireSeconds
        }, function () {
            swal('创建微信二维码成功', '', 'success');
            $scope.tableParams.reload();
            $scope.hidePromote();
        });
    };
    //删除
    $scope.deleteQR = function (id) {
        $scope.loadingPromise = autoaskService.deleteWeiXinQrcodeInfo({
            qrCodeInfoId: id
        }, function () {
            $scope.tableParams.reload();
            swal('删除成功！', '', 'success');
        });
    };
    //查看二维码
    $scope.seeImage = function (imgUrl){
        $scope.seeImgUrl = imgUrl;
        $scope.imgView = true;
    };
    //显示隐藏失效div
    $scope.show_or_hide_div = function(){
        var type = $scope.type;
        console.log(type)
        //永久二维码
            if(type === 'QR_LIMIT_STR_SCENE'){
                $scope.expireSecondsDiv = false;
                $scope.expireSeconds = null;
            }else{
                $scope.expireSecondsDiv = true;
            }
    }

    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    $scope.init();
}]);