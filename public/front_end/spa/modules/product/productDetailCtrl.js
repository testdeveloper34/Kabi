"use strict";   
angular.module('kabi').controller('productDetailCtrl', ['$scope','commonServices','$linq','notificationService','$stateParams',function ($scope,commonServices,$linq,notificationService,$stateParams) {
$scope.productVm={
        item:{}
}
$scope.$on('$viewContentLoaded', function (a) {
    $scope.getProduct($stateParams.id);
 });
    $scope.getProduct=function(id=null)
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
                    $scope.productVm.item=response.data.data[0];
                    console.log($scope.productVm.item);
                    // // $scope.productVm.sub_category_id=response.data.data[0].sub_category_id;
                    // $scope.productVm.item_images=response.data.data[0].item_images;
                    // angular.forEach(response.data.data[0].item_images,function(image){
                    //     var obj = {
                    //         blobUrl:image.image_path,
                    //         file :image,
                    //         isThumbnail:false,
                    //         _id :image._id,
                    //         item_id:image.item_id
                    //                 }
                    //     $scope.prodImage.push(obj)
                    // });
                    
                    // // $scope.prodImage=response.data.data[0].item_images;;
                    // $scope.productVm.item.category_type_id=response.data.data[0].category_type[0]._id;
                    // $scope.getFilterCategory();
                    // $scope.productVm.item.category_id=response.data.data[0].category_id;
                    // $scope.getFilterSubCategory();
                    // $scope.productVm.item.sub_category_id=response.data.data[0].sub_category_id;
                    // angular.element('#modalAddProduct').modal('show');
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