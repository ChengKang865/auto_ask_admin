'use strict';
/**
 * controller for Messages
 */
app.controller('ChatCtrl', ["$scope", function ($scope) {

    $scope.selfIdUser = 50223456;
    $scope.otherIdUser = 50223457;
    $scope.setOtherId = function (value) {

        $scope.otherIdUser = value;
    };

    $scope.chat = [];

    $scope.sendMessage = function () {
        var newMessage = {
            "user": "Peter Clark",
            "avatar": "../common/images/avatar-1.jpg",
            "date": new Date(),
            "content": $scope.chatMessage,
            "idUser": $scope.selfIdUser,
            "idOther": $scope.otherIdUser
        };
        $scope.chat.push(newMessage);
        $scope.chatMessage = '';

    };
}]);
