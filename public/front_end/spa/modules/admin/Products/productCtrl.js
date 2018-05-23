"use strict";   
angular.module('kabi').controller('productCtrl', ['$scope','commonServices','$linq','notificationService','$interval',
function ($scope,commonServices,$linq,notificationService,$interval) {

$scope.prodImage=[];
$scope.productList=[];
$scope.productVm={
    item:{
        category_type_id:"",
        category_id:"",
        selectedSizes:[],
        item_images:[],
        sizeIds:[]
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
    angular.element('#modalAddProduct').css('display','none');
    
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
                    // console.log($scope.$$phase);
                    $scope.prodImage=[];
                    $scope.productVm.item=response.data.data[0];

                    // $scope.productVm.sub_category_id=response.data.data[0].sub_category_id;
                    $scope.productVm.item_images=response.data.data[0].item_images;
                    angular.forEach(response.data.data[0].item_images,function(image){
                        var obj = {
                            blobUrl:image.image_path,
                            file :image,
                            isThumbnail:image.is_thumbnail,
                            _id :image._id,
                            item_id:image.item_id
                                    }
                        $scope.prodImage.push(obj)
                    });
                    
                    // $scope.prodImage=response.data.data[0].item_images;;
                    $scope.productVm.item.category_type_id=response.data.data[0].category_type[0]._id;
                    $scope.getFilterCategory();
                    $scope.productVm.item.category_id=response.data.data[0].category_id;
                    $scope.getFilterSubCategory();
                    $scope.productVm.item.sub_category_id=response.data.data[0].sub_category_id;
                    $scope.productVm.item.selectedSizes = $linq.Enumerable().From($scope.productVm.item.quantity)
                                .Select(function (x) { return x.size_id && x.quantity }).ToArray();
                    $scope.productVm.item.sizeIds = $linq.Enumerable().From($scope.productVm.item.quantity)
                                .Select(function (x) { return x.size_id.toString() }).ToArray();
                    // $scope.productVm.item.sizeIds =[];
                    angular.element('#modalAddProduct').modal('show');
                    //  $("#sizeGroup").select2(selectedSize.join());
                    $('#sizeGroup').trigger('change');
                    // if($scope.$$phase) {
                    //      var sizeAutoSelectPromise = $interval(function(){
                    //             if(!$scope.$$phase) {
                    //                 $('#sizeGroup').trigger('change');
                    //                 $interval.cancel(sizeAutoSelectPromise);
                    //             }
                    //     }, 1000);
                    // }
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
$scope.prodImage=[];
// $scope.productVm.item.selectedSizes=[];
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
        // commonServices.getBase64(imageData.file).then(function(data){
        //     imageData.imageBase64 = data;
        // });
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
    $scope.productVm.item.quantity=[];
    $scope.productVm.item.item_images=[];
    angular.forEach($scope.productVm.item.selectedSizes,function(sizeObj){
        $scope.productVm.item.quantity.push({
            quantity:sizeObj.quantity,
            size_id:sizeObj._id
        });
    });  
    $scope.productVm.item.item_price =$scope.productVm.item.item_price.toString(); 
    if($scope.productVm.item.sub_sub_category_id===null)
        $scope.productVm.item.sub_sub_category_id="";
    commonServices.postService("/api/additem",$scope.productVm.item).then(function(itemResponse){
        if(itemResponse.data.code == 200)
        {
             var imagesUrls=[];
                angular.forEach($scope.prodImage,function(image,key){
                    if(image._id===undefined){
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
                                $scope.prodImage=[];
                                $scope.productVm.item.selectedSizes=[];
                                   $scope.productVm.item.sizeIds=[];
                                }
                            }
                        });
                    }
                    
                });
        }
            else{
                notificationService.displaySuccess(response.data.message);
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
         commonServices.postService("/api/getsizes").then(function(response){
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