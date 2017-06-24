app.controller("commentListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    $scope.init = function () {
        //查询条件
        $scope.criteria = {
            page: 1,
            count: 50
        };

        // 初始化时间插件
        $('#startTime').datetimepicker({
            format: 'Y-m-d H:i:s',
            step: 1
        });

        $('#endTime').datetimepicker({
            format: 'Y-m-d H:i:s',
            step: 1
        });

        $scope.dialogShowFlag = false;
        $scope.orderGoodsId = null;
        $scope.replyContent = null;
    }

    // 显示回复dialog
    $scope.showReplyDialog = function (orderGoodsId, preReply) {
        $scope.orderGoodsId = orderGoodsId;
        $scope.replyContent = preReply;
        $scope.dialogShowFlag = true;
    };
    //隐藏回复dialog
    $scope.hideReplyDialog = function () {
        $scope.goodsOrderId = '';
        $scope.replyContent = '';
        $scope.dialogShowFlag = false;
    };

    // 提交回复
    $scope.commitReply = function () {
        if ($scope.orderGoodsId === undefined || $scope.orderGoodsId === null || $scope.orderGoodsId === '') {
            swal('请选择评价', '', 'error');
            return;
        }
        if ($scope.replyContent === '' || $scope.replyContent === null || $scope.replyContent === '') {
            swal('回复内容不能为空', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.replayComment({
            orderGoodsId: $scope.orderGoodsId,
            replyContent: $scope.replyContent
        }, function () {
            swal('回复成功', '', 'success');
            $scope.hideReplyDialog();
            $scope.tableParams.reload();
        });
    };


    // 加载列表
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 50
    }, {
        total: 0,
        getData: function ($defer, params) {
            $scope.criteria.page = params.page();
            $scope.criteria.count = params.count();
            if ($scope.criteria.startTime === undefined || $scope.criteria.startTime === null || $scope.criteria.startTime === '') {
                delete $scope.criteria.startTime;
            }
            if ($scope.criteria.endTime === undefined || $scope.criteria.endTime === null || $scope.criteria.endTime === '') {
                delete $scope.criteria.startTime;
            }
            $scope.loadingPromise = autoaskService.getCommentList($scope.criteria, function (resp) {
                if (resp.data === undefined || resp.data === null) {
                    resp.data = {};
                    resp.data.total = 0;
                    resp.data.result = [];
                }
                $scope.data = resp.data.result === null ? [] : resp.data.result;
                params.total(resp.data.total);
                $defer.resolve([$scope.data]);
            });
        }
    });

    // 查询
    $scope.query = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    $scope.init();
}]);