"use strict";   
angular.module('kabi').controller('productCtrl', ['$scope','commonServices','$linq',function ($scope,commonServices,$linq) {

    $scope.prodImage=[];
$scope.productList=[];
$scope.productVm={
    item:{
        category_type_id:"",
        category_id:"",
        selectedSizes:[],
        item_images:[]
    }
    
};
// $scope.selectedSizes=[];
$scope.$on('$viewContentLoaded', function (a) {
    $scope.getCategoryTypes();
    $scope.getCategory();
    getSizes();
    $("#sizeGroup").select2();
    
 });
$scope.addProduct = function(){
    angular.element('#modalAddProduct').modal('show');
};
//////////////////////////////////
$scope.addImages = function(){
    // $scope.prodImage=[];
    // console.log($scope.files);
    var files = document.getElementById("prod_image").files;
    // angular.forEach($scope.prodImage,function(image) {
    //     commonServices.getBase64(image.file).then(function(data){
    //         $scope.productVm.item.images.push({
    //             isThumbnail:image.isThumbnail,
    //             imageString : data
    //         });
    //     });
    angular.forEach(files,function(image) {
        var imageData ={
            blobUrl:window.URL.createObjectURL(image),
            file :image,
            isThumbnail:false
        };
        $scope.prodImage.push(imageData);
        commonServices.getBase64(imageData.file).then(function(data){
            imageData.imageBase64 = data;
        });
    });
    if($scope.prodImage.length === 1)
        $scope.prodImage[0].isThumbnail=true;
    $scope.$apply();
};
////////////////////////////////////
$scope.selectThumbnail =function(imageUrl){
    angular.forEach($scope.prodImage,function(image) {
       if(image.blobUrl ===imageUrl)
        image.isThumbnail=true;
       else
        image.isThumbnail=false;
    });
}

$scope.saveProduct = function() {
    // angular.forEach($scope.prodImage,function(image) {
    //         var imageBase64 = commonServices.getBase64(image.file)
    //         $scope.productVm.item.item_images.push({
    //             isThumbnail:image.isThumbnail,
    //             imageString : imageBase64
    //         });
    //     });
    $scope.productVm.item.quantity=[];
    $scope.productVm.item.item_images=[];
    angular.forEach($scope.productVm.item.selectedSizes,function(sizeObj){
        $scope.productVm.item.quantity.push({
            quantity:sizeObj.quantity,
            size_id:sizeObj._id
        });
    });
    // angular.forEach($scope.prodImage,function(image){
    //     $scope.productVm.item.item_images.push({
    //         base64:image.imageBase64,
    //         is_thumbnail:image.isThumbnail,
    //         mimeType:image.file.type
    //     });
    // });   
var test=new FormData();
angular.forEach($scope.prodImage,function(image){
    test.append('files',image.file);
});
var object = {
    files:test
    // item_id:'1'
}
    console.log($scope.productVm.item);
    commonServices.postMultipartService("/api/addItemImages",object).then(function(response){
        // console.log(response);
        if(response.data.code == 200){
            console.log(response.data);
           
        }
        
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
               
            }
            
        });
    }

    $scope.getCategory=function(id=null)
    {
        var object={
            "page":0,
            "limit":0,
            "_id":id
        }
         commonServices.postService("/api/getCategory",object).then(function(response){
            // console.log(response);
            if(response.data.code == 200){
                if(id!=null && id!="" && id!=undefined){
                    $scope.category=response.data.data[0];
                    $scope.category.category_type=response.data.data[0].category_type[0]._id;
                    $scope.IsAdd=false;                                    
                }
                else{
                    $scope.categoryList=response.data.data;
                    angular.forEach($scope.categoryList,function(category){
                        category.type_id = category.category_type[0]._id;
                    });
                }
                // call toaster 
                // call get list here
            }
            
        });
    }

    var getSizes=function(id=null)
    {
        var object={
            "page":0,
            "limit":0,
            "_id":id
        }
         commonServices.getService("/api/getsizes").then(function(response){
            // console.log(response);
            if(response.data.code == 200){
                $scope.allSizes=response.data.data;
            }
            
        });
    }


    $scope.getFilterCategory = function(){
        $scope.filteredCategory = $linq.Enumerable().From($scope.categoryList)
                                .Where(function (x) {
                                    return x.type_id === $scope.productVm.item.category_type_id;
                                }).Select(function (x) { return x }).ToArray();
    }    
    $scope.getFilterSubCategory = function(){
        $scope.filteredSubCategory =angular.copy($linq.Enumerable().From($scope.categoryList)
                                .Where(function (x) {
                                    return x._id === $scope.productVm.item.category_id;
                                }).Select(function (x) { return x.sub_categories }).FirstOrDefault());
    }    
    $scope.getSelectedSizes = function(){
        var tempSelected = angular.copy($scope.productVm.item.selectedSizes);
        $scope.productVm.item.selectedSizes=[];
        angular.forEach($scope.productVm.item.sizeIds,function(id){
            var alreadyExistSize = $linq.Enumerable().From(tempSelected)
                        .Where(function (x) {
                            return x._id === id;
                        }).Select(function (x) { return x }).FirstOrDefault();
            if(alreadyExistSize===undefined){
                var temp = $linq.Enumerable().From($scope.allSizes)
                .Where(function (x) {
                    return x._id === id;
                }).Select(function (x) { return x }).FirstOrDefault();
                $scope.productVm.item.selectedSizes.push(angular.copy(temp));      
            }else{
                $scope.productVm.item.selectedSizes.push(angular.copy(alreadyExistSize));
            }            
        });
       
    }
    
    }]);