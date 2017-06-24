'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
//var AUTOASK_HOST = '127.0.0.1:8087/autoask';
var AUTOASK_HOST = 'www.autoask.com/autoask';

var ACTIVE_URL = "oizq85p8q.bkt.clouddn.com/active.png";
app.constant('ACTIVE_URL', 'http://' + ACTIVE_URL);

app.constant('autoaskProvider', 'http://' + AUTOASK_HOST);

app.constant('PAY_TYPES', {
    'ali': '支付宝',
    'weixin': '微信',
    'union_pay': '银联'
});
app.constant('loginType', 'autoask');

app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        'modernizr': ['../bower_components/components-modernizr/modernizr.js'],
        'moment': ['../bower_components/moment/min/moment.min.js'],
        'spin': '../bower_components/spin.js/spin.js',
        //md5


        //*** jQuery Plugins
        'perfect-scrollbar-plugin': ['../bower_components/perfect-scrollbar/js/min/perfect-scrollbar.jquery.min.js', '../bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css'],
        'ladda': ['../bower_components/ladda/dist/ladda.min.js', '../bower_components/ladda/dist/ladda-themeless.min.css'],
        'chartjs': '../bower_components/chartjs/Chart.min.js',
        'jquery-sparkline': '../bower_components/jquery.sparkline.build/dist/jquery.sparkline.min.js',
        'ckeditor-plugin': '../bower_components/ckeditor/ckeditor.js',
        'jquery-nestable-plugin': ['../bower_components/jquery-nestable/jquery.nestable.js'],
        'touchspin-plugin': ['../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', '../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],

        //*** Filters
        'htmlToPlaintext': '../common/js/filters/htmlToPlaintext.js',
        'autoaskFilter': 'assets/js/filters/autoaskFilters.js',

        // ***************** autoask START ********************

        //*** Controllers
        'chatCtrl': 'assets/js/controllers/chatCtrl.js',
        'loginCtrl': 'assets/js/controllers/loginCtrl.js',

        'faceCtrl': 'assets/js/controllers/faceCtrl.js',

        'partnerCtrl': 'assets/js/controllers/merchant/partnerCtrl.js',
        'serviceProviderCtrl': 'assets/js/controllers/merchant/serviceProviderCtrl.js',
        'mechanicCtrl': 'assets/js/controllers/merchant/mechanicCtrl.js',
        'factoryCtrl': 'assets/js/controllers/merchant/factoryCtrl.js',
        'outletsCtrl': 'assets/js/controllers/merchant/outletsCtrl.js',

        'productCategoryCtrl': 'assets/js/controllers/product/productCategoryCtrl.js',
        'productCtrl': 'assets/js/controllers/product/productCtrl.js',
        'goodsCtrl': 'assets/js/controllers/product/goodsCtrl.js',

        'bannerCtrl': 'assets/js/controllers/config/bannerCtrl.js',
        'indexProductCtrl': 'assets/js/controllers/config/indexProductCtrl.js',

        'activityListCtrl': 'assets/js/controllers/config/activityListCtrl.js',
        'activityAddCtrl': 'assets/js/controllers/config/activityAddCtrl.js',
        'activityModifyCtrl': 'assets/js/controllers/config/activityModifyCtrl.js',
        'activityDetailCtrl': 'assets/js/controllers/config/activityDetailCtrl.js',


        'serviceAddCtrl': 'assets/js/controllers/config/serviceAddCtrl.js',
        'serviceListCtrl': 'assets/js/controllers/config/serviceListCtrl.js',
        'serviceModifyCtrl': 'assets/js/controllers/config/serviceModifyCtrl.js',
        'serviceDetailCtrl': 'assets/js/controllers/config/serviceDetailCtrl.js',
        'exploreListCtrl': 'assets/js/controllers/config/exploreListCtrl.js',
        'exploreAddCtrl': 'assets/js/controllers/config/exploreAddCtrl.js',
        'exploreModifyCtrl': 'assets/js/controllers/config/exploreModifyCtrl.js',
        'exploreDetailCtrl': 'assets/js/controllers/config/exploreDetailCtrl.js',

        'helpRichTextListCtrl': 'assets/js/controllers/config/helpRichTextListCtrl.js',
        'helpRichTextEditCtrl': 'assets/js/controllers/config/helpRichTextEditCtrl.js',
        'helpRichTextDetailCtrl': 'assets/js/controllers/config/helpRichTextDetailCtrl.js',
        'aboutUsListCtrl': 'assets/js/controllers/config/aboutUsListCtrl.js',
        'aboutUsEditCtrl': 'assets/js/controllers/config/aboutUsEditCtrl.js',
        'deliveryFeeCtrl': 'assets/js/controllers/config/deliveryFeeCtrl.js',

        'ueditorEditCtrl': 'assets/js/controllers/ueditorEditCtrl.js',

        // 'goodsNumSubListCtrl': 'assets/js/controllers/goods_num/goodsNumSubListCtrl.js',
        // 'goodsNumAddListCtrl': 'assets/js/controllers/goods_num/goodsNumAddListCtrl.js',
        // 'goodsNumAddCtrl': 'assets/js/controllers/goods_num/goodsNumAddCtrl.js',
        // 'goodsNumSubCtrl': 'assets/js/controllers/goods_num/goodsNumSubCtrl.js',
        'goodsNumListCtrl': 'assets/js/controllers/goods_num/goodsNumListCtrl.js',
        'goodsNumRecordCtrl': 'assets/js/controllers/goods_num/goodsNumRecordCtrl.js',


        'usersCtrl': 'assets/js/controllers/users/usersCtrl.js',

        'cardListCtrl': 'assets/js/controllers/card/cardListCtrl.js',
        'cardAddCtrl': 'assets/js/controllers/card/cardAddCtrl.js',
        'cardDetailCtrl': 'assets/js/controllers/card/cardDetailCtrl.js',
        'cardItemListCtrl':'assets/js/controllers/card/cardItemListCtrl.js',

        //订单相关
        'orderListCtrl': 'assets/js/controllers/order/orderListCtrl.js',
        'onlineListCtrl': 'assets/js/controllers/order/onlineListCtrl.js',
        'offlineListCtrl': 'assets/js/controllers/order/offlineListCtrl.js',
        'orderDetailCtrl': 'assets/js/controllers/order/orderDetailCtrl.js',

        //分成相关
        'aliTransferCtrl': 'assets/js/controllers/share/aliTransferCtrl.js',
        'shareCtrl': 'assets/js/controllers/share/shareCtrl.js',
        'extraCtrl': 'assets/js/controllers/share/extraCtrl.js',
        'applyCtrl': 'assets/js/controllers/share/applyCtrl.js',
        'shareCheckListCtrl': 'assets/js/controllers/share/shareCheckListCtrl.js',
        'assetsCtrl': 'assets/js/controllers/share/assetsCtrl.js',


        'noticeListCtrl': 'assets/js/controllers/notice/noticeListCtrl.js',
        'noticeDetailCtrl': 'assets/js/controllers/notice/noticeDetailCtrl.js',
        'noticeAddCtrl': 'assets/js/controllers/notice/noticeAddCtrl.js',

        'modifyPasswordCtrl': 'assets/js/controllers/account/modifyPasswordCtrl.js',
        'commentListCtrl': 'assets/js/controllers/comment/commentListCtrl.js',

        'roleListCtrl': 'assets/js/controllers/system/roleListCtrl.js',
        'roleAddCtrl': 'assets/js/controllers/system/roleAddCtrl.js',
        'roleModifyCtrl': 'assets/js/controllers/system/roleModifyCtrl.js',
        'roleDetailCtrl': 'assets/js/controllers/system/roleDetailCtrl.js',
        'operationHistoryListCtrl': 'assets/js/controllers/system/operationHistoryListCtrl.js',

        //快递模板
        'expressTemplateListCtrl': 'assets/js/controllers/express/templateListCtrl.js',
        'expressTemplateAddCtrl': 'assets/js/controllers/express/templateAddCtrl.js',
        'expressTemplateModifyCtrl': 'assets/js/controllers/express/templateModifyCtrl.js',
        'expressTemplateDetailCtrl': 'assets/js/controllers/express/templateDetailCtrl.js',
        //快递类型
        'expressTypeListCtrl': 'assets/js/controllers/express/typeListCtrl.js',
        'expressTypeAddCtrl': 'assets/js/controllers/express/typeAddCtrl.js',
        'expressTypeModifyCtrl': 'assets/js/controllers/express/typeModifyCtrl.js',
        'expressTypeDetailCtrl': 'assets/js/controllers/express/typeDetailCtrl.js',
        //微信管理
        'qrCodeInfoListCtrl': 'assets/js/controllers/wx/qrCodeInfoListCtrl.js',
        'userInfoListCtrl': 'assets/js/controllers/wx/userInfoListCtrl.js',


        //*** Services
        'restProxyService': 'assets/js/services/common/restProxyService.js',
        'autoaskService': 'assets/js/services/autoask/autoaskService.js',
        'authService': 'assets/js/services/autoask/authService.js',
        'commonService': 'assets/js/services/common/commonService.js',
        'areaService': 'assets/js/services/autoask/areaService.js',
        'ueditorService': 'assets/js/services/autoask/ueditorService.js',


    },
    //*** angularJS Modules
    modules: [{
        name: 'angularMoment',
        files: ['../bower_components/angular-moment/angular-moment.min.js']
    }, {
        name: 'toaster',
        files: ['../bower_components/AngularJS-Toaster/toaster.js', '../bower_components/AngularJS-Toaster/toaster.css']
    }, {
        name: 'angularBootstrapNavTree',
        files: ['../bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css']
    }, {
        name: 'angular-ladda',
        files: ['../bower_components/angular-ladda/dist/angular-ladda.min.js']
    }, {
        name: 'ngTable',
        files: ['../bower_components/ng-table/dist/ng-table.min.js', '../bower_components/ng-table/dist/ng-table.min.css']
    }, {
        name: 'ui.select',
        files: ['../bower_components/angular-ui-select/dist/select.min.js', '../bower_components/angular-ui-select/dist/select.min.css', '../bower_components/select2/dist/css/select2.min.css', '../bower_components/select2-bootstrap-css/select2-bootstrap.min.css', '../bower_components/selectize/dist/css/selectize.bootstrap3.css']
    }, {
        name: 'ui.mask',
        files: ['../bower_components/angular-ui-utils/mask.min.js']
    }, {
        name: 'ngImgCrop',
        files: ['../bower_components/ngImgCrop/compile/minified/ng-img-crop.js', '../bower_components/ngImgCrop/compile/minified/ng-img-crop.css']
    }, {
        name: 'angularFileUpload',
        files: ['../bower_components/angular-file-upload/angular-file-upload.min.js']
    }, {
        name: 'ngAside',
        files: ['../bower_components/angular-aside/dist/js/angular-aside.min.js', '../bower_components/angular-aside/dist/css/angular-aside.min.css']
    }, {
        name: 'truncate',
        files: ['../bower_components/angular-truncate/src/truncate.js']
    }, {
        name: 'monospaced.elastic',
        files: ['../bower_components/angular-elastic/elastic.js']
    }, {
        name: 'ngMap',
        files: ['../bower_components/ngmap/build/scripts/ng-map.min.js']
    }, {
        name: 'tc.chartjs',
        files: ['../bower_components/tc-angular-chartjs/dist/tc-angular-chartjs.min.js']
    }, {
        name: 'flow',
        files: ['../bower_components/ng-flow/dist/ng-flow-standalone.min.js']
    }, {
        name: 'uiSwitch',
        files: ['../bower_components/angular-ui-switch/angular-ui-switch.min.js', '../bower_components/angular-ui-switch/angular-ui-switch.min.css']
    }, {
        name: 'ckeditor',
        files: ['../bower_components/angular-ckeditor/angular-ckeditor.min.js']
    }, {
        name: 'mwl.calendar',
        files: ['../bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar.js', '../bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js', '../bower_components/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css']
    }, {
        name: 'ng-nestable',
        files: ['../bower_components/ng-nestable/src/angular-nestable.js']
    }, {
        name: 'vAccordion',
        files: ['../bower_components/v-accordion/dist/v-accordion.min.js', '../bower_components/v-accordion/dist/v-accordion.min.css']
    }, {
        name: 'xeditable',
        files: ['../bower_components/angular-xeditable/dist/js/xeditable.min.js', '../bower_components/angular-xeditable/dist/css/xeditable.css', '../common/js/config/config-xeditable.js']
    }, {
        name: 'checklist-model',
        files: ['../bower_components/checklist-model/checklist-model.js']
    }, {
        name: 'ngTagsInput',
        files: ['../common/js/directives/ng-tags-input.js', '../common/css/ng-tags/ng-tags-input.bootstrap.min.css', '../common/css/ng-tags/ng-tags-input.min.css']
    }, {
        name: 'angularBusy',
        files: ['../bower_components/angular-busy/angular-busy.min.css', '../bower_components/angular-busy/angular-busy.min.js']
    }, {
        name: 'ng.ueditor',
        files: ['../bower_components/angular-ueditor/dist/angular-ueditor.js']
    }, {
        name: 'ngCsv',
        files: ['../bower_components/angular-csv/ng-csv.min.js']
    }, {
        name: 'angular-md5',
        files: [' ../bower_components/angular-md5/angular-md5.min.js']
    }
    ]
});
