"use strict";   
angular.module('kabi').controller('productCtrl', ['$scope','commonServices','$linq','notificationService',function ($scope,commonServices,$linq,notificationService) {

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
    angular.element('#modalAddProduct').modal('hide');
    $scope.getProduct();
    $scope.getCategoryTypes();
    $scope.getCategory();
    getSizes();
    $("#sizeGroup").select2();
    
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
                    $scope.productVm.category_type_id=response.data.data[0].category_type[0]._id;
                    //$scope.productVm.category_id=response.data.data[0].category_id;
                    $scope.productVm.item.category_type_id=response.data.data[0].category_id;
                    $scope.productVm.item.sub_category_id=response.data.data[0].sub_category_id;
                    // $scope.productVm.sub_category_id=response.data.data[0].sub_category_id;
                    $scope.productVm.item_images=response.data.data[0].item_images;
                    $scope.prodImage=response.data.data[0].item_images;;
                    $scope.getFilterCategory();
                    $scope.getFilterSubCategory();
                     angular.element('#modalAddProduct').modal('show');
                }
                else{
                $scope.productList=response.data.data;
                }
                // call toaster 
                // call get list here
            }
            
        });
    }    

$scope.addProduct = function(){
    $scope.productVm={
    item:{
        category_type_id:"",
        category_id:"",
        selectedSizes:[],
        item_images:[]
    }  
};
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

var saveItemImageUrls =function(imageUrls,itemId){
    // commonServices.postMultipartService("/api/addItemImages",$scope.productVm.item).then(function(itemResponse){
    // });

}


$scope.saveProduct = function() {
    $scope.productVm.item.quantity=[];
    $scope.productVm.item.item_images=[];
    angular.forEach($scope.productVm.item.selectedSizes,function(sizeObj){
        $scope.productVm.item.quantity.push({
            quantity:sizeObj.quantity,
            size_id:sizeObj._id
        });
    });  
    commonServices.postService("/api/additem",$scope.productVm.item).then(function(itemResponse){
        if(itemResponse.data.code == 200)
        {
             var imagesUrls=[];
                angular.forEach($scope.prodImage,function(image,key){
                    var fd=new FormData();
                    fd.append('files',image.file);
                    commonServices.postMultipartService("/api/addItemImages/"+itemResponse.data.data._id+"/"+image.isThumbnail,fd).then(function(imageResponse){
                        if(imageResponse.data.code == 200){
                            console.log(imageResponse.data);
                        // imagesUrls.push(response.data.url);
                            if(key === $scope.prodImage.length-1){
                               notificationService.displaySuccess("Item added successfully");
                               angular.element('#modalAddProduct').modal('hide');
                               $scope.getProduct();
                            }
                        }
                    });
                });
        }
            else{
                notificationService.displaySuccess(response.data.message);
            }
    });    
   
// files.push($scope.prodImage[0].file)
// test.append('files',$scope.prodImage[0].file)
    // console.log($scope.productVm.item);
    
    
    
}
    // $scope.uploadFiles = function (files) {
    //     console.log("uploadfirl")
    //     $scope.files = files;
    //     if (files && files.length) {
    //         Upload.upload({
    //             url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //             data: {
    //                 files: files
    //             }
    //         }).then(function (response) {
    //             $timeout(function () {
    //                 $scope.result = response.data;
    //             });
    //         }, function (response) {
    //             if (response.status > 0) {
    //                 $scope.errorMsg = response.status + ': ' + response.data;
    //             }
    //         }, function (evt) {
    //             $scope.progress = 
    //                 Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    //         });
    //     }
    // };












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




     $scope.deleteProduct=function(id){
         console.log("id is here",id)
        swal({
            title: "Are you sure?",
             text: "Are you sure you want to delete this Product ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Yes",
             cancelButtonText: "No",
             closeOnConfirm: true

         }, function () {
            commonServices.deleteServiceparam("/api/deleteitem/"+id).then(function(response){
                // console.log(response);
                if(response.data.code == 200){
                    notificationService.displaySuccess("Product deleted successfully");
                    $scope.product={};
                    // $scope.category.sub_categories=[ {
                    //     'subCategory_name':''
                    // }];
                    $scope.IsAdd=true;                    
                    $scope.getProduct();
                    // call toaster 
                    // call get list here
                }
                else{
                    notificationService.displayError(response.data.message)
                }
                
             });
         });      
    }
    
    }]);