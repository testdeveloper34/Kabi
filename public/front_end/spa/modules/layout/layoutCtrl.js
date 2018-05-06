 "use strict";   
angular.module('kabi').controller('layoutCtrl', ['$scope','$http','commonServices',function ($scope,$http,commonServices) {
$scope.currentCategory=[];
$scope.$on('$viewContentLoaded', function (a) {
           $scope.getCategoryTypes();
           $scope.getAllCategory();
        });
        $scope.test=function(id)
        {
            $scope.currentCategory=[];
        angular.forEach($scope.categoryList,function(element) {
            if(element.category_type[0]._id==id){
                $scope.currentCategory.push(element);
            }
        })

        
        }
        
    $scope.getAllCategory=function()
    {
        var object={
            "page":0,
            "limit":0,
        }
         commonServices.postService("/api/getCategory",object).then(function(response){
            // console.log(response);
            if(response.data.code == 200){
                
                $scope.categoryList=response.data.data;
                }
                // call toaster 
                // call get list here
            
        });
    } 
        $scope.getCategoryTypes=function()
    {
        var object={
            "page":0,
            "limit":0
        }
           commonServices.postService("/api/getCategoryTypes",object).then(function(response){
            // console.log(response);
            if(response.data.code == 200){
                $scope.allTypes=response.data.data;
               
                // call toaster 
                // call get list here
            }
            
        });
    }
    }]);