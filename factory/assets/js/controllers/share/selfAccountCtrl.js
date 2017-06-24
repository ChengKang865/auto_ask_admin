app.controller('selfAccountDetailCtrl', ['$scope', 'autoaskService', function ($scope, autoaskService) {
    $scope.init = function () {
        // 初始化模态弹出框模式
        $scope.dialogShowFlag = false;

        $scope.fee = 1;
        $scope.realAmount = 0;

        $scope.loadingPromise = autoaskService.getAccountInfo(null, function (resp) {
            $scope.accountInfo = resp.data;
            if ($scope.accountInfo === undefined || $scope.accountInfo === null) {
                $scope.amount = 0;
            } else {
                $scope.amount = $scope.accountInfo.balance;
                $scope.calFee();
            }
        });
    };

    //显示对话窗口
    $scope.showApplyDialog = function () {
        $scope.dialogShowFlag = true;
    };

    //隐藏对话窗口
    $scope.hideApplyDialog = function () {
        $scope.dialogShowFlag = false;
    };


    // 确认体现
    $scope.confirmApply = function () {
        $scope.calFee();
        if ($scope.amount === undefined || $scope.amount === null || isNaN($scope.amount)) {
            swal('请输入合法的额度', '', 'error');
            return;
        }
        if ($scope.amount < 2) {
            swal('金额必须大于2元', '', 'error');
            return;
        }
        if ($scope.amount > $scope.accountInfo.balance) {
            swal('申请金额不能大于现有余额', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.submitApply({
            amount: $scope.amount,
            fee: $scope.fee
        }, function () {
            swal('申请成功', '', 'success');
            $scope.hideApplyDialog();
            $scope.init();
        });
    };


    $scope.calFee = function () {
        var amountReg = /^\d+(\.\d{1,2})?$/;

        if ($scope.amount == undefined || $scope.amount === null || $scope.amount === '') {
            return;
        }
        if ($scope.amount === undefined || $scope.amount === null || isNaN($scope.amount)) {
            swal('请输入合法的额度', '', 'error');
            return;
        }

        if (!amountReg.test($scope.amount)) {
            swal('请输入合法的额度,小数位数不能超过两位', '', 'error');
            return;
        }

        $scope.amount = parseFloat($scope.amount);
        var amount = angular.copy($scope.amount);
        $scope.fee = parseFloat(amount) * 0.005;
        $scope.fee = $scope.fee > 1 ? $scope.fee : 1;
        $scope.fee = $scope.fee > 25 ? 25 : $scope.fee;
        $scope.realAmount = amount - $scope.fee;
        $scope.realAmount = $scope.realAmount < 0 ? 0 : $scope.realAmount;
    };

    $scope.init();
}]);

app.controller('selfAccountModifyCtrl', ['$scope', 'autoaskService', '$location', function ($scope, autoaskService, $location) {

    $scope.init = function () {
        $scope.account = {};
    };

    // 提交
    var submit = function () {
        if (($scope.preAliPayAccount != $scope.nextAliPayAccount) || ($scope.preAliPayUserName != $scope.nextAliPayUserName)) {
            swal('两次账号信息不一致', '', 'error');
            return;
        }
        $scope.loadingPromise = autoaskService.updateAccountInfo({
            aliPayAccount: $scope.preAliPayAccount,
            aliPayUserName: $scope.preAliPayUserName
        }, function () {
            swal('更新账号成功', '', 'success');
            $location.path('app/share/selfAccountDetail');
        });
    };

    $scope.form = {
        submit: function (form) {
            var firstError = null;
            if (form.$invalid) {
                var field = null, firstError = null;
                for (field in form) {
                    if (field[0] != '$') {
                        if (firstError === null && !form[field].$valid) {
                            firstError = form[field].$name;
                        }

                        if (form[field].$pristine) {
                            form[field].$dirty = true;
                        }
                    }
                }

                angular.element('.ng-invalid[name=' + firstError + ']').focus();
            } else {
                submit();
            }

        }
    };

    $scope.init();
}]);