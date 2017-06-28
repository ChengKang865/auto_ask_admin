/**
 * Created by sun on 2017/6/21.
 */
app.controller("massListCtrl", ["$scope", "autoaskService", "ngTableParams", function ($scope, autoaskService, ngTableParams) {
    //模态框

    $scope.mass=false;
    $scope.currentCount = 5;//初始加载数量
    $scope.pageNum = 0;
    $scope.pageList = [];
    $scope.material = {
        type: 'image',
        count: 5,
        offset: 0
    };
    $scope.massMessage='';
    $scope.valueForMaterial={name:"autoAsk"};


    $scope.toggleModel = function () {
        $scope.mass = !$scope.mass;
    }
    $scope.loadingPromise = autoaskService.getMassList($scope.parms, function (resp) {
        console.log('请求成功');
        $scope.tagsInfoList = resp.data.result;
        // console.log(resp)
        $scope.allTags = 0;//计算全部
        angular.forEach($scope.tagsInfoList, function (tags, indexs) {
            $scope.allTags += tags.count;
        })
        $scope.tagsInfoList[0].count = $scope.allTags || 0;//给全部赋值
        // $defer.resolve([$scope.data]);
    });
    //默认加载的类型为；‘图片’
    $scope.loadingPromise = autoaskService.getMaterialList($scope.material, function (resp) {
        // console.log(resp.data)
        $scope.MeterialResult = resp.data.result;
        $scope.total = resp.data.total;
        getPageList('image');

    })

//  选择按钮

    //实现tab切换功能---------BEGIN
    $scope.showTab = 'image';
    $scope.changeTab = function (v) {


        $scope.showTab = v;
        $scope.materialList($scope.showTab);
        // console.log($scope.showTab);
        if(v==='text'){
            $scope.textarea='';
            $scope.valueForMaterial={name:"autoAsk"};

        }
    }
    //实现tab切换功能 ----------END
    $scope.materialList = function (material) {
        $scope.material = {
            type: material,
            count: $scope.currentCount,
            offset: 0
        }

        // console.log($scope.material)
        if (material !== 'text') {
            $scope.ajaxForGetMaterialList($scope.material)
        }
    }

    //ajax 获取信息列表
    $scope.ajaxForGetMaterialList = function (param) {
        $scope.loadingPromise = autoaskService.getMaterialList($scope.material, function (resp) {
            // console.log(resp.data)
            $scope.MeterialResult = resp.data.result;
            $scope.total = resp.data.total;
            // console.log($scope.total);
            getPageList($scope.material.type);
        })
    }
//分页-----------BEGIN
    function getPageList(type) {
        if ($scope.total > $scope.currentCount) {
            // console.log(type)

            $scope.pageNum = Math.ceil($scope.total / $scope.currentCount);
            if ($scope.pageNum > 1) {
                $scope.pageList.length = 0;//清空$scope.pageList
                $scope.pageList[0] = type;
                for (var i = 0; i < $scope.pageNum; i++) {
                    $scope.pageList.push(i + 1)
                }
                // console.log($scope.pageList)
            }

        } else {
            $scope.pageNum = 0;
        }
    }

    //分页-----------END

    //按钮点击更新页数
    $scope.currentClickPage = 1;
    $scope.changePage = function (t, p) {
        $scope.currentClickPage = p;

        $scope.offsetNum = p * $scope.material.count - $scope.currentCount;//$scope.currentCount
        $scope.material = {
            type: t,
            count: 5,
            offset: $scope.offsetNum
        }
        $scope.ajaxForGetMaterialList($scope.material);
        // console.log($scope.material)
    }

//    时间转换
    $scope.getLocalTime = function (time) {
        var aa=new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        if( aa==='Invalid Date') { return '创建时间'} else {
            return  aa;

        }
    }

//    时间转换-------------END

    $scope.makeSure = function () {



        // console.log($scope.textarea    $scope.massId);
        if($scope.showTab==='text' && $scope.textarea===''){
            swal('请输入文本','error');
            return false;
        }

        $scope.mass = !$scope.mass;

    }


    $scope.materialName = function (tp) {
        if (tp === 'image') {
            return '图片';
        } else if (tp === 'news') {
            return '图文';

        } else if (tp === 'text') {
            return '文本';

        }
    }

    $scope.cancel = function () {
        $scope.valueForMaterial={name:"autoAsk"};

        $scope.params = {
            isToAll: true,
            tagId: null,
            mediaId: '',
            type: 'image',
            content: null
        };
        return  $scope.params;
    }
    // 发送

    $scope.massId = 9999999999;
    //选择群发类型
    $scope.toggleMassType = function (masstype) {
        if(masstype===''||masstype===null){
            $scope.massId = 9999999999;
            swal('请选择群发类型','','error');
            return false;
        }

        $scope.massId = JSON.parse(masstype).id;

        return $scope.massId;


    }

    //全部


    $scope.submit=function(){
        // console.log($scope.valueForMaterial.name)
        // console.log( $scope.textarea);

        if($scope.massId===9999999999){
            swal('请选择群发类型','','error');
            return false;
        };


        if($scope.showTab!=='text'&& $scope.valueForMaterial.name==='autoAsk'){
            swal('请选择群发内容','error');
            return false;
        }


        $scope.params = {
            isToAll: true,
            tagId: null,
            mediaId: '',
            type: 'image',
            content: null
        };
        var type=$scope.showTab;
        if(type==='news')
        {
            type='mpnews';
        }

        if($scope.massId===0){
            if($scope.showTab==='text'){
                $scope.params = {
                    isToAll: true,
                    tagId: null,
                    mediaId: null,
                    type: type,
                    content: $scope.textarea}
            }else{
                $scope.params = {
                    isToAll: true,
                    tagId: null,
                    mediaId: $scope.valueForMaterial.name.mediaId,
                    type: type,
                    content: null}
            }
        }else if($scope.massId!==0){
            $scope.params.isToAll=false;
            $scope.params.tagId=$scope.massId;
            $scope.params.type=type;
            if( $scope.showTab==='text'){
                $scope.params.content=$scope.textarea;
                $scope.params.mediaId=null;
            }else{
                $scope.params.content=null;
                $scope.params.mediaId=$scope.valueForMaterial.name.mediaId;
            }
        }


        console.log( $scope.valueForMaterial.name.mediaId)

        console.log( $scope.params);
        //
        $scope.loadingPromise = autoaskService.submitForMass($scope.params, function (resp) {
            if(resp.errCode===0){
                swal('发送成功','success');
            }else{
                swal('发送失败','请检查发送类型和发送内容','error');
            }
        })

    }


}])
































