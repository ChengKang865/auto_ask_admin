'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        // APPLICATION ROUTES
        // -----------------------------------
        // For any unmatched url, redirect to /app/dashboard
        $urlRouterProvider.otherwise("/app/face");
        //
        // Set up the states
        $stateProvider.state('app', {
            url: "/app",
            templateUrl: "assets/views/app.html",
            resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster',
                'ngAside', 'vAccordion', 'chartjs', 'tc.chartjs', 'chatCtrl',
                'commonService', 'autoaskService', 'authService', 'restProxyService', 'ngTagsInput', 'ngTable',
                'angularBusy', 'areaService', 'autoaskFilter', 'ngCsv', 'angular-md5'
            ),
            abstract: true
        }).state('app.face', {
            url: '/face',
            templateUrl: "assets/views/face.html",
            title: '数据概览',
            ncyBreadcrumb: {
                label: '数据概览'
            },
            resolve: loadSequence('faceCtrl'),
            data: {
                roles: ['root']
            }
        }).state('app.merchant', {
            url: '/merchant',
            template: '<div ui-view class="fade-in-up"></div>',
            title: '合作伙伴',
            ncyBreadcrumb: {
                label: '合作伙伴'
            },
            resolve: loadSequence('partnerCtrl', 'serviceProviderCtrl', 'mechanicCtrl', 'factoryCtrl', 'outletsCtrl'),
            data: {
                roles: ['root', 'create']
            }
        }).state('app.merchant.partner', {
            url: '/partner',
            templateUrl: "assets/views/merchant/partner.html",
            title: '合作商',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '合作商'
            }
        }).state('app.merchant.partnerDetail', {
            url: '/partnerDetail/:id/:action',
            templateUrl: "assets/views/merchant/partner_modify.html",
            title: '合作商信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '合作商信息'
            }
        }).state('app.merchant.serviceProvider', {
            url: '/serviceProvider',
            templateUrl: "assets/views/merchant/serviceProvider.html",
            title: '服务店',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '服务店'
            }
        }).state('app.merchant.serviceProviderDetail', {
            url: '/serviceProviderDetail/:id/:action',
            templateUrl: "assets/views/merchant/service_provider_modify.html",
            title: '服务店信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '服务店信息'
            }
        }).state('app.merchant.mechanic', {
            url: '/mechanic',
            templateUrl: "assets/views/merchant/mechanic.html",
            title: '维修工',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '维修工'
            }
        }).state('app.merchant.mechanicDetail', {
            url: '/mechanicDetail/:id/:action',
            templateUrl: "assets/views/merchant/mechanic_modify.html",
            title: '维修工信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '维修工信息'
            }
        }).state('app.merchant.factory', {
            url: '/factory',
            templateUrl: "assets/views/merchant/factory.html",
            title: '合作工厂',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '合作工厂'
            }
        }).state('app.merchant.factoryDetail', {
            url: '/factoryDetail/:id/:action',
            templateUrl: "assets/views/merchant/factory_modify.html",
            title: '合作工厂信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '合作工厂信息'
            }
        }).state('app.merchant.outlets', {
            url: '/outlets',
            templateUrl: "assets/views/merchant/outlets.html",
            title: '分销点',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '分销点'
            }
        }).state('app.merchant.outletsDetail', {
            url: '/outletsDetail/:id/:action',
            templateUrl: "assets/views/merchant/outlets_modify.html",
            title: '分销点信息',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: '分销点信息'
            }
        })


        //  -------------------  产品  --------------------------
            .state('app.product', {
                url: '/product',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '商品/产品管理',
                ncyBreadcrumb: {
                    label: '商品/产品管理'
                },
                resolve: loadSequence('productCategoryCtrl', 'productCtrl', 'goodsCtrl', 'touchspin-plugin')
            }).state('app.product.productCategory', {
            url: '/productCategory',
            templateUrl: 'assets/views/product/product_category.html',
            title: '产品类别管理',
            ncyBreadcrumb: {
                label: '产品类别管理'
            }
        }).state('app.product.productCategoryDetail', {
            url: '/productCategoryDetail/:id/:action',
            templateUrl: "assets/views/product/product_category_detail.html",
            title: '产品类别详情',
            ncyBreadcrumb: {
                label: '产品类别详情'
            }
        }).state('app.product.product', {
            url: '/product',
            templateUrl: 'assets/views/product/product.html',
            title: '产品管理',
            ncyBreadcrumb: {
                label: '产品管理'
            }
        }).state('app.product.productDetail', {
            url: '/productDetail/:id/:action',
            templateUrl: "assets/views/product/product_detail.html",
            title: '产品详情',
            ncyBreadcrumb: {
                label: '产品详情'
            }
        }).state('app.product.goods', {
            url: '/goods',
            templateUrl: "assets/views/product/goods.html",
            title: '商品管理',
            ncyBreadcrumb: {
                label: '商品管理'
            }
        }).state('app.product.goodsDetail', {
            url: '/goodsDetail/:id/:action/:status',
            templateUrl: 'assets/views/product/goods_detail.html',
            title: '商品详情',
            ncyBreadcrumb: {
                label: '商品详情'
            }
        })


        //  -------------------  订单  --------------------------
            .state('app.order', {
                url: '/order',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '订单管理',
                ncyBreadcrumb: {
                    label: '订单管理'
                },
                resolve: loadSequence('orderListCtrl', 'onlineListCtrl', 'offlineListCtrl', 'orderDetailCtrl')
            }).state('app.order.orderList', {
            url: '/all',
            templateUrl: 'assets/views/order/order_list.html',
            title: '全部订单',
            ncyBreadcrumb: {
                label: '全部订单'
            }
        }).state('app.order.onlineList', {
            url: '/onlineList',
            templateUrl: 'assets/views/order/online_list.html',
            title: '线上订单',
            ncyBreadcrumb: {
                label: '线上订单'
            }
        }).state('app.order.offlineList', {
            url: '/offlineList',
            templateUrl: 'assets/views/order/offline_list.html',
            title: '线下订单',
            ncyBreadcrumb: {
                label: '线下订单'
            }
        }).state('app.order.partnerPendingList', {
            url: '/partnerPendingList',
            templateUrl: 'assets/views/order/partner_pending_list.html',
            title: '合作商无货订单',
            ncyBreadcrumb: {
                label: '合作商无货订单'
            }
        }).state('app.order.serviceProviderPendingList', {
            url: '/serviceProviderPendingList',
            templateUrl: 'assets/views/order/service_provider_pending_list.html',
            title: '合作商无货订单',
            ncyBreadcrumb: {
                label: '合作商无货订单'
            }
        }).state('app.order.detail', {
            url: '/detail/:id',
            templateUrl: 'assets/views/order/order_detail.html',
            title: '订单详情',
            ncyBreadcrumb: {
                label: '订单详情'
            }
        })

        //----------- 退款管理 -------------------
            .state('app.refund', {
                url: '/refund',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '退款管理',
                ncyBreadcrumb: {
                    label: '退款管理'
                },
                resolve: loadSequence('orderListCtrl')
            }).state('app.refund.orderList', {
            url: '/orderList',
            templateUrl: 'assets/views/refund/refund_order_list.html',
            title: '退款管理',
            ncyBreadcrumb: {
                label: '退款管理'
            }
        })


        //  -------------------  分成  --------------------------
            .state('app.share', {
                url: '/share',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '分成管理',
                ncyBreadcrumb: {
                    label: '分成管理'
                },
                resolve: loadSequence('shareCtrl', 'extraCtrl', 'applyCtrl', 'aliTransferCtrl', 'shareCheckListCtrl', 'assetsCtrl')
            }).state('app.share.factoryList', {
            url: '/factoryList',
            templateUrl: 'assets/views/share/factory_share_list.html',
            title: '工厂分成',
            ncyBreadcrumb: {
                label: '工厂分成'
            }
        }).state('app.share.partnerList', {
            url: '/partnerList',
            templateUrl: 'assets/views/share/partner_share_list.html',
            title: '合作商分成',
            ncyBreadcrumb: {
                label: '合作商分成'
            }
        }).state('app.share.serviceProviderList', {
            url: '/serviceProviderList',
            templateUrl: 'assets/views/share/service_provider_share_list.html',
            title: '服务店分成',
            ncyBreadcrumb: {
                label: '服务店分成'
            }
        }).state('app.share.outletsList', {
            url: '/outletsList',
            templateUrl: 'assets/views/share/outlets_share_list.html',
            title: '分销点分成',
            ncyBreadcrumb: {
                label: '分销店分成'
            }
        }).state('app.share.mechanicList', {
            url: '/mechanicList',
            templateUrl: 'assets/views/share/mechanic_share_list.html',
            title: '维修工分成',
            ncyBreadcrumb: {
                label: '维修工分成'
            }
        }).state('app.share.assetsList', {
            url: '/assetsList',
            templateUrl: 'assets/views/share/assets_list.html',
            title: '商户资产',
            ncyBreadcrumb: {
                label: '商户资产'
            }
        }).state('app.share.extraApply', {
            url: '/extraApply',
            templateUrl: 'assets/views/share/extra_apply_list.html',
            title: '提现申请中',
            ncyBreadcrumb: {
                label: '提现申请中'
            }
        }).state('app.share.extra', {
            url: '/extra',
            templateUrl: 'assets/views/share/extra_list.html',
            title: '提现记录',
            ncyBreadcrumb: {
                label: '提现记录'
            }
        }).state('app.share.applyHTML', {
            url: '/applyHTML',
            templateUrl: 'assets/views/share/alipay_transfer.html',
            title: '确认提现',
            ncyBreadcrumb: {
                label: '确认提现'
            }
        }).state('app.share.checkList', {
            url: '/checkList',
            templateUrl: 'assets/views/share/share_check_list.html',
            title: '分成审核',
            ncyBreadcrumb: {
                label: '分成审核'
            }
        })

        //  -------------------  用户  --------------------------
            .state('app.users', {
                url: '/users',
                templateUrl: 'assets/views/users/users.html',
                title: '用户列表',
                ncyBreadcrumb: {
                    label: '用户列表'
                },
                resolve: loadSequence('usersCtrl')
            })

            //  -------------------  配置  --------------------------
            .state('app.config', {
                url: '/config',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '配置管理',
                ncyBreadcrumb: {
                    label: '配置管理'
                },
                resolve: loadSequence('ng.ueditor', 'ueditorService', 'bannerCtrl', 'indexProductCtrl', 'deliveryFeeCtrl')
            }).state('app.config.deliveryFee', {
            url: '/deliveryFee',
            templateUrl: 'assets/views/config/delivery_fee.html',
            title: '免邮费设置',
            ncyBreadcrumb: {
                label: '免邮费设置'
            }
        }).state('app.config.banner', {
            url: '/banner',
            templateUrl: 'assets/views/config/banner.html',
            title: 'banner管理',
            ncyBreadcrumb: {
                label: 'banner管理'
            }
        }).state('app.config.indexProduct', {
            url: '/indexProduct',
            templateUrl: 'assets/views/config/indexProduct.html',
            title: '首页产品管理',
            ncyBreadcrumb: {
                label: '首页产品管理'
            }
        }).state('app.config.activity', {
            url: '/activity',
            templateUrl: 'assets/views/config/activity_list.html',
            title: '活动管理',
            ncyBreadcrumb: {
                label: '活动管理'
            },
            resolve: loadSequence('activityListCtrl')
        }).state('app.config.activityAdd', {
            url: '/activity/add',
            templateUrl: 'assets/views/config/activity_add.html',
            title: '添加活动管理',
            ncyBreadcrumb: {
                label: '添加活动管理'
            },
            resolve: loadSequence('activityAddCtrl')
        }).state('app.config.activityMofidy', {
            url: '/activity/modify/:id',
            templateUrl: 'assets/views/config/activity_modify.html',
            title: '修改活动管理',
            ncyBreadcrumb: {
                label: '修改活动管理'
            },
            resolve: loadSequence('activityModifyCtrl')
        }).state('app.config.activityDetail', {
            url: '/activity/detail/:id',
            templateUrl: 'assets/views/config/activity_detail.html',
            title: '活动详情',
            ncyBreadcrumb: {
                label: '活动详情'
            },
            resolve: loadSequence('activityDetailCtrl')
        }).state('app.config.serviceList', {
            url: '/service/list',
            templateUrl: 'assets/views/config/service_list.html',
            title: '首页服务管理',
            ncyBreadcrumb: {
                label: '首页服务管理'
            },
            resolve: loadSequence('serviceListCtrl')
        }).state('app.config.serviceAdd', {
            url: '/service/add',
            templateUrl: 'assets/views/config/service_add.html',
            title: '添加首页服务',
            ncyBreadcrumb: {
                label: '添加首页服务'
            },
            resolve: loadSequence('serviceAddCtrl')
        }).state('app.config.serviceModify', {
            url: '/service/modify/:id',
            templateUrl: 'assets/views/config/service_modify.html',
            title: '编辑首页服务',
            ncyBreadcrumb: {
                label: '编辑首页服务'
            },
            resolve: loadSequence('serviceModifyCtrl')
        }).state('app.config.serviceDetail', {
            url: '/service/detail/:id',
            templateUrl: 'assets/views/config/service_detail.html',
            title: '首页服务详情',
            ncyBreadcrumb: {
                label: '首页服务详情'
            },
            resolve: loadSequence('serviceDetailCtrl')
        }).state('app.config.exploreList', {
            url: '/explore/list',
            templateUrl: 'assets/views/config/explore_list.html',
            title: '首页探索列表',
            ncyBreadcrumb: {
                label: '首页探索列表'
            },
            resolve: loadSequence('exploreListCtrl')
        }).state('app.config.exploreAdd', {
            url: '/explore/add',
            templateUrl: 'assets/views/config/explore_add.html',
            title: '添加首页探索',
            ncyBreadcrumb: {
                label: '添加首页探索'
            },
            resolve: loadSequence('exploreAddCtrl')
        }).state('app.config.exploreModify', {
            url: '/explore/modify/:id',
            templateUrl: 'assets/views/config/explore_modify.html',
            title: '修改首页探索',
            ncyBreadcrumb: {
                label: '修改首页探索'
            },
            resolve: loadSequence('exploreModifyCtrl')
        }).state('app.config.exploreDetail', {
            url: '/explore/detail/:id',
            templateUrl: 'assets/views/config/explore_detail.html',
            title: '修改首页探索',
            ncyBreadcrumb: {
                label: '修改首页探索'
            },
            resolve: loadSequence('exploreDetailCtrl')
        }).state('app.config.howSelectList', {
            url: '/helpRichText/howSelectList',
            templateUrl: 'assets/views/config/how_select_list.html',
            title: '如何选择',
            ncyBreadcrumb: {
                label: '如何选择'
            },
            resolve: loadSequence('helpRichTextListCtrl')
        }).state('app.config.howBuyList', {
            url: '/helpRichText/howBuyList',
            templateUrl: 'assets/views/config/how_buy_list.html',
            title: '如何购买',
            ncyBreadcrumb: {
                label: '如何购买'
            },
            resolve: loadSequence('helpRichTextListCtrl')
        }).state('app.config.howPayList', {
            url: '/helpRichText/howPayList',
            templateUrl: 'assets/views/config/how_pay_list.html',
            title: '如何支付',
            ncyBreadcrumb: {
                label: '如何支付'
            },
            resolve: loadSequence('helpRichTextListCtrl')
        }).state('app.config.helpRichTextAdd', {
            url: '/helpRichTextEdit/:type/:mode',
            templateUrl: 'assets/views/config/helpRichTextEdit.html',
            title: '编辑',
            ncyBreadcrumb: {
                label: '编辑'
            },
            resolve: loadSequence('helpRichTextEditCtrl')
        }).state('app.config.helpRichTextMode', {
            url: '/helpRichTextEdit/:type/:mode/:id',
            templateUrl: 'assets/views/config/helpRichTextEdit.html',
            title: '编辑',
            ncyBreadcrumb: {
                label: '编辑'
            },
            resolve: loadSequence('helpRichTextEditCtrl')
        }).state('app.config.helpRichTextDetial', {
            url: '/helpRichText/detail/:id',
            templateUrl: 'assets/views/config/helpRichTextDetail.html',
            title: '详情',
            ncyBreadcrumb: {
                label: '详情'
            },
            resolve: loadSequence('helpRichTextDetailCtrl')
        }).state('app.config.aboutUsList', {
            url: '/aboutUsList',
            templateUrl: 'assets/views/config/about_us_list.html',
            title: '关于我们',
            ncyBreadcrumb: {
                label: '关于我们'
            },
            resolve: loadSequence('aboutUsListCtrl')
        }).state('app.config.aboutUsAdd', {
            url: '/aboutUsEdit/:mode',
            templateUrl: 'assets/views/config/about_us_edit.html',
            title: '添加关于我们',
            ncyBreadcrumb: {
                label: '添加关于我们'
            },
            resolve: loadSequence('aboutUsEditCtrl')
        }).state('app.config.aboutUsModify', {
            url: '/aboutUsEdit/:mode/:id',
            templateUrl: 'assets/views/config/about_us_edit.html',
            title: '编辑关于我们',
            ncyBreadcrumb: {
                label: '编辑关于我们'
            },
            resolve: loadSequence('aboutUsEditCtrl')
        })

        //  -------------------  ueditor编辑器  --------------------------
            .state('app.ueditor', {
                url: '/ueditor',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '富文本编辑器',
                ncyBreadcrumb: {
                    label: '配置管理'
                },
                resolve: loadSequence('ng.ueditor', 'ngCsv', 'ueditorEditCtrl')
            }).state('app.ueditor.edit', {
            url: '/ueditor/edit',
            templateUrl: 'assets/views/ueditor_edit.html',
            title: '富文编辑器',
            ncyBreadcrumb: {
                label: '富文本编辑器'
            }
        })

        //  -------------------  库存管理  --------------------------
            .state('app.goodsNum', {
                url: '/goodsNum',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '库存管理',
                ncyBreadcrumb: {
                    label: '库存管理'
                },
                resolve: loadSequence('goodsNumRecordCtrl', 'goodsNumListCtrl')
            }).state('app.goodsNum.addList', {
            url: '/addList',
            templateUrl: 'assets/views/goods_num/goods_num_add_list.html',
            title: '发货管理',
            ncyBreadcrumb: {
                label: '发货管理'
            }
        }).state('app.goodsNum.add', {
            url: '/add',
            templateUrl: 'assets/views/goods_num/goods_num_add.html',
            title: '添加发货管理',
            ncyBreadcrumb: {
                label: '添加发货管理'
            }
        }).state('app.goodsNum.subList', {
            url: '/subList',
            templateUrl: 'assets/views/goods_num/goods_num_sub_list.html',
            title: '退货管理',
            ncyBreadcrumb: {
                label: '退货管理'
            }
        }).state('app.goodsNum.sub', {
            url: '/sub',
            templateUrl: 'assets/views/goods_num/goods_num_sub.html',
            title: '添加退货管理',
            ncyBreadcrumb: {
                label: '添加退货管理'
            }
        }).state('app.goodsNum.addDetail', {
            url: '/add/detail/:id',
            templateUrl: 'assets/views/goods_num/goods_num_add_detail.html',
            title: '添加退货管理',
            ncyBreadcrumb: {
                label: '添加退货管理'
            }
        }).state('app.goodsNum.subDetail', {
            url: '/sub/detail/:id',
            templateUrl: 'assets/views/goods_num/goods_num_sub_detail.html',
            title: '添加退货管理',
            ncyBreadcrumb: {
                label: '添加退货管理'
            }
        }).state('app.goodsNum.factoryList', {
            url: '/factoryList',
            templateUrl: 'assets/views/goods_num/factory_goods_num_list.html',
            title: '合作工厂库存',
            ncyBreadcrumb: {
                label: '合作工厂库存'
            }
        }).state('app.goodsNum.partnerList', {
            url: '/partnerList',
            templateUrl: 'assets/views/goods_num/partner_goods_num_list.html',
            title: '合作商库存',
            ncyBreadcrumb: {
                label: '合作商库存'
            }
        }).state('app.goodsNum.serviceProviderList', {
            url: '/serviceProviderList',
            templateUrl: 'assets/views/goods_num/service_provider_goods_num_list.html',
            title: '合作商库存',
            ncyBreadcrumb: {
                label: '合作商库存'
            }
        })

        //  -------------------  账户管理  --------------------------
            .state('app.account', {
                url: '/account',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '账户管理',
                ncyBreadcrumb: {
                    label: '账户管理'
                }
            }).state('app.account.passwordModify', {
            url: '/passwordModify',
            templateUrl: 'assets/views/account/modify_password.html',
            title: '修改密码',
            ncyBreadcrumb: {
                label: '修改密码'
            },
            resolve: loadSequence('modifyPasswordCtrl')
        })
        //  -------------------  账户管理  --------------------------
            .state('app.system', {
                url: '/system',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '角色管理',
                ncyBreadcrumb: {
                    label: '角色管理'
                }
            }).state('app.system.roleList', {
            url: '/roleList',
            templateUrl: 'assets/views/system/role_list.html',
            title: '角色列表',
            ncyBreadcrumb: {
                label: '角色列表'
            },
            resolve: loadSequence('roleListCtrl')
        }).state('app.system.add', {
            url: '/roleAdd',
            templateUrl: 'assets/views/system/role_add.html',
            title: '添加角色',
            ncyBreadcrumb: {
                label: '添加角色'
            },
            resolve: loadSequence('roleAddCtrl')
        }).state('app.system.detail', {
            url: '/roleDetail/:id',
            templateUrl: 'assets/views/system/role_detail.html',
            title: '角色详情',
            ncyBreadcrumb: {
                label: '角色详情'
            },
            resolve: loadSequence('roleDetailCtrl')
        }).state('app.system.modify', {
            url: '/roleModify/:id',
            templateUrl: 'assets/views/system/role_modify.html',
            title: '修改角色',
            ncyBreadcrumb: {
                label: '修改角色'
            },
            resolve: loadSequence('roleModifyCtrl')
        }).state('app.system.operationHistoryList', {
            url: '/operationHistoryList',
            templateUrl: 'assets/views/system/operation_history_list.html',
            title: '操作历史',
            ncyBreadcrumb: {
                label: '操作历史'
            },
            resolve: loadSequence('operationHistoryListCtrl')
        })

        //  -------------------  公告管理  --------------------------
            .state('app.notice', {
                url: '/notice',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '公告管理',
                ncyBreadcrumb: {
                    label: '公告管理'
                }
            }).state('app.notice.list', {
            url: '/list',
            templateUrl: 'assets/views/notice/notice_list.html',
            title: '公告列表',
            ncyBreadcrumb: {
                label: '公告列表'
            },
            resolve: loadSequence('noticeListCtrl')
        }).state('app.notice.detail', {
            url: '/detail/:id',
            templateUrl: 'assets/views/notice/notice_detail.html',
            title: '公告详情',
            ncyBreadcrumb: {
                label: '公告详情'
            },
            resolve: loadSequence('noticeDetailCtrl')
        }).state('app.notice.add', {
            url: '/add',
            templateUrl: 'assets/views/notice/notice_add.html',
            title: '发公告',
            ncyBreadcrumb: {
                label: '发公告'
            },
            resolve: loadSequence('noticeAddCtrl')
        })

        //  -------------------  卡券  --------------------------
            .state('app.card', {
                url: '/card',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '卡片管理',
                ncyBreadcrumb: {
                    label: '卡片管理'
                }
            }).state('app.cardList', {
            url: '/card/list',
            templateUrl: 'assets/views/card/card_list.html',
            title: '卡片列表',
            ncyBreadcrumb: {
                label: '卡片列表'
            },
            resolve: loadSequence('cardListCtrl')
        }).state('app.cardAdd', {
            url: '/card/add',
            templateUrl: 'assets/views/card/card_add.html',
            title: '添加卡片',
            ncyBreadcrumb: {
                label: '添加卡片'
            },
            resolve: loadSequence('cardAddCtrl')
        }).state('app.cardDetail', {
            url: '/card/detail/:id',
            templateUrl: 'assets/views/card/card_detail.html',
            title: '卡片详情',
            ncyBreadcrumb: {
                label: '卡片详情'
            },
            resolve: loadSequence('cardDetailCtrl')
        }).state('app.cardItem', {
            url: '/card/item/:cardTypeId',
            templateUrl: 'assets/views/card/card-item-list.html',
            title: '单卡管理',
            ncyBreadcrumb: {
                label: '单卡管理'
            },
            resolve: loadSequence('cardItemListCtrl')
        })

        //  -------------------  评价  --------------------------
            .state('app.comment', {
                url: '/comment',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '评价管理',
                ncyBreadcrumb: {
                    label: '评价管理'
                }
            }).state('app.comment.list', {
            url: '/comment/list',
            templateUrl: 'assets/views/comment/comment_list.html',
            title: '评价列表',
            ncyBreadcrumb: {
                label: '评价列表'
            },
            resolve: loadSequence('commentListCtrl')
        })

        //  -------------------  快递类型管理  --------------------------
            .state('app.express', {
                url: '/express',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '快递管理',
                ncyBreadcrumb: {
                    label: '快递管理'
                }
            }).state('app.express.typeList', {
            url: '/typeList',
            templateUrl: 'assets/views/express/type_list.html',
            title: '快递类型列表',
            ncyBreadcrumb: {
                label: '快递类型列表'
            },
            resolve: loadSequence('expressTypeListCtrl')
        }).state('app.express.typeAdd', {
            url: '/typeAdd',
            templateUrl: 'assets/views/express/type_add.html',
            title: '添加快递类型',
            ncyBreadcrumb: {
                label: '添加快递类型'
            },
            resolve: loadSequence('expressTypeAddCtrl')
        }).state('app.express.typeDetail', {
            url: '/typeDetail/:id',
            templateUrl: 'assets/views/express/type_detail.html',
            title: '快递详情',
            ncyBreadcrumb: {
                label: '快递详情'
            },
            resolve: loadSequence('expressTypeDetailCtrl')
        }).state('app.express.typeModify', {
            url: '/typeModify/:id',
            templateUrl: 'assets/views/express/type_modify.html',
            title: '修改快递类型',
            ncyBreadcrumb: {
                label: '修改快递类型'
            },
            resolve: loadSequence('expressTypeModifyCtrl')
        })
        //-----------------------快递模板管理 ------------------
            .state('app.express.templateList', {
                url: '/templateList',
                templateUrl: 'assets/views/express/template_list.html',
                title: '快递模板列表',
                ncyBreadcrumb: {
                    label: '快递类型列表'
                },
                resolve: loadSequence('expressTemplateListCtrl')
            }).state('app.express.templateAdd', {
            url: '/templateAdd',
            templateUrl: 'assets/views/express/template_add.html',
            title: '添加快递模板',
            ncyBreadcrumb: {
                label: '添加快递模板'
            },
            resolve: loadSequence('expressTemplateAddCtrl')
        }).state('app.express.templateDetail', {
            url: '/templateDetail/:id',
            templateUrl: 'assets/views/express/template_detail.html',
            title: '快递模板详情',
            ncyBreadcrumb: {
                label: '快递模板详情'
            },
            resolve: loadSequence('expressTemplateDetailCtrl')
        }).state('app.express.templateModify', {
            url: '/templateModify/:id',
            templateUrl: 'assets/views/express/template_modify.html',
            title: '修改快递模板',
            ncyBreadcrumb: {
                label: '修改快递模板'
            },
            resolve: loadSequence('expressTemplateModifyCtrl')
        })
            //--------------------------微信管理----------------------
            .state('app.wx', {
                url: '/wx',
                template: '<div ui-view class="fade-in-up"></div>',
                title: '微信管理',
                ncyBreadcrumb: {
                    label: '微信管理'
                }
            }).state('app.wx.qrCodeInfoList', {
            url: '/qrCodeInfoList/',
            templateUrl: 'assets/views/wx/qrCode_info__list.html',
            title: '微信二维码列表',
            ncyBreadcrumb: {
                label: '微信二维码列表'
            },
            resolve: loadSequence('qrCodeInfoListCtrl')
        }).state('app.wx.userInfoList', {
            url: '/userInfoList/',
            templateUrl: 'assets/views/wx/userInfo_info__list.html',
            title: '微信用户列表',
            ncyBreadcrumb: {
                label: '微信用户列表'
            },
            resolve: loadSequence('userInfoListCtrl')
        }).state('app.wx.massList', {
            url: '/massList/',
            templateUrl: 'assets/views/wx/mass_list.html',
            title: '微信群发列表',
            ncyBreadcrumb: {
                label: '微信群发列表'
            },
            resolve: loadSequence('massListCtrl')
        })


        //  -------------------  错误  --------------------------
            .state('error', {
                url: '/error',
                template: '<div ui-view class="fade-in-up"></div>'
            }).state('error.404', {
            url: '/404',
            templateUrl: "assets/views/utility_404.html"
        }).state('error.500', {
            url: '/500',
            templateUrl: "assets/views/utility_500.html"
        }).state('login', {
            url: '/login',
            template: '<div ui-view class="fade-in-right-big smooth"></div>',
            abstract: true,
            resolve: loadSequence('moment', 'angularMoment',
                'commonService', 'autoaskService', 'authService', 'restProxyService', 'angularBusy', 'angular-md5', 'loginCtrl'),
            title: '登录'
        }).state('login.sign', {
            url: '/sign',
            templateUrl: 'assets/views/login/login.html',
            title: '密码登录'
        });

        // Login routes

        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }
    }]);
