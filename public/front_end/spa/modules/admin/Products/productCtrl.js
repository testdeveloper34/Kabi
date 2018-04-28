"use strict";   
angular.module('kabi').controller('productCtrl', ['$scope','commonServices',function ($scope,commonServices) {

$scope.productList=[];
$scope.addProduct = function(){
    angular.element('#modalAddProduct').modal('show');
}
    }]);