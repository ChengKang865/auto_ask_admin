"use strict"
// 合作商类型汉化
app.filter('merchantTypeZh', function () {
    return function (merchantType) {
        return {
                factory: "合作工厂",
                service_provider: "服务店",
                partner: "合作商",
                autoask: "AutoASK",
                system: '系统',
                user: '用户'
            }[merchantType] || "AutoASK";
    };
});

// 线下服务类型汉化
app.filter("serveTypeZh", function () {
    return function (serveType) {
        return {
            online: '线上',
            offline: '线下'
        }[serveType];
    };
});


// 订单状态汉化
app.filter("orderInfoStatusZh", function () {
    return function (orderInfoStatus) {
        return {
            to_pay: '待支付',
            payed: '已支付',
            confirm_sp: '服务店确认',
            confirmed: '发货中',
            refused: '退款中',
            received: '已收货',
            comment: '已评价',
            validated: '已验证',
            pay_failure: '付款失败',
            complete_s: '已服务',
            refunded: '已退款',
            expired: '超时未支付'
        }[orderInfoStatus];
    };
});


// 支付方式汉化
app.filter("payTypeZh", function () {
    return function (payType) {
        return {
            wx: '微信',
            ali: '支付宝',
            union_pay: '银联',
            cash: '现金'
        }[payType];
    };
});

// 申请状态汉化
app.filter("applyStatusZh", function () {
    return function (applyStatus) {
        return {
            'applying': '申请中',
            doing: '处理中',
            success: '处理成功',
            failure: '处理失败'
        }[applyStatus];
    };
});

app.filter("cardTypeStatusZh", function () {
    return function (cardType) {
        if (cardType.deleteFlag) {
            return '已作废';
        } else {
            return {
                to_check: '待激活',
                checked: '已激活'
            }[cardType.status];
        }
    };
});

app.filter("incomeTypeZh", function () {
    return function (incomeType) {
        return {
            ad_fee: '广告费',
            service_fee: '服务费',
            promote_fee: '引流费',
            handle_fee: '工时费',
            partner_fee: '合作费',
            factory_fee: '制造费'
        }[incomeType];
    };
});

app.filter("activeStatusZh", function () {
    return function (activeStatus) {
        if (activeStatus) {
            return '已激活';
        } else {
            return '未激活';
        }
    };
});

app.filter("workTypeZh", function () {
    return function (workType) {
        return {
                metal: '钣金',
                paint: '油漆',
                electrical: '机电'
            }[workType] || '';
    };
});

app.filter("readStatusZh", function () {
    return function (readFlag) {
        if (readFlag) {
            return '已读';
        } else {
            return '未读';
        }
    };
});

app.filter("shareStatusZh", function () {
    return function (status) {
        return {
            no_share: '未分成',
            shared: '已分成'
        }[status];
    };
});

app.filter("operateTypeZh", function () {
    return function (type) {
        return {
            insert: '下单',
            pay: '支付',
            pending: '无货',
            confirm: '确认',
            validate: '验证',
            refuse: '拒绝',
            refund: '退款',
            receive: '确认服务/收货',
            comment: '评价'
        }[type];
    };
});

app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.filter("actionZh", function () {
    return function (action) {
        return {
            edit: '修改',
            info: '详情',
            add: '添加',
            modify: '修改'
        }[action];
    };
});

app.filter("helpZh", function () {
    return function (action) {
        return {
            HOW_PAY: '如何支付',
            HOW_BUY: '如何购买',
            HOW_SELECT: '如何选择'
        }[action];
    };
});

app.filter("roleZh", function () {
    return function (role) {
        return {
            root: '管理员',
            edit: '客服',
            check: '财务'
        }[role];
    };
});
app.filter("cardItemStatusZh", function () {
    return function (status, deleteFlag) {
        if (deleteFlag === true || deleteFlag === '') {
            return '已删除';
        }
        if (status === 'to_check') {
            return '待激活';
        } else if (status === 'checked' || status === 'to_use') {
            return '已激活';
        } else if (status === 'used') {
            return '已使用';
        }
    };
});