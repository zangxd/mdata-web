/**
 * @Author:      xd.zang
 * @DateTime:    2016-03-21
 * @description: ng test js
 */

'use strict';

console.info('====> index_ng.js');

require("../../css/lib/reset.css");
require("../../css/common/global.css");
require("../../css/common/grid.css");
require("../../css/page/index.less");
require("../../css/page/index_ng.less");

let angular=require('angular');
let myApp = angular.module('myApp',[]);

myApp.controller('myCtrl', ['$scope', function ($scope) {
    $scope.user = {
      name: 'zangxd',
      github: 'https://github.com/zangxd'
    };
  }
]);
