 "use strict";   
angular.module('kabi').controller('homeCtrl', ['$scope','$http','commonServices',function ($scope,$http,commonServices) {
    
    $scope.$on('$viewContentLoaded', function (a) {
    $scope.getProducts();
 });

 $scope.getProducts=function(id=null)
    {
        var object={
            "page":0,
            "limit":0,
            "_id":id
        }
         commonServices.postService("/api/getAllItems",object).then(function(response){
            // console.log(response);
            if(response.data.code == 200){
                if(id!=null && id!="" && id!=undefined){
                    $scope.category=response.data.data[0];
                    $scope.category.category_type=response.data.data[0].category_type[0]._id;
                    $scope.IsAdd=false;                                    
                }
                else{
                $scope.productList=response.data.data;
                }
                // call toaster 
                // call get list here
            }
            
        });
    }    

    }]);