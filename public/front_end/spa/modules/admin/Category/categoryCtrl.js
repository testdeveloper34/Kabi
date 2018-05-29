"use strict";   
angular.module('kabi').controller('categoryCtrl', ['$scope','commonServices','notificationService',function ($scope,commonServices,notificationService) {

    $scope.category={};
    $scope.category.sub_categories=[ {
        'subCategory_name':''
    }];
$scope.IsAdd=true;
    $scope.categoryList = [];
$scope.allTypes=[];
    $scope.$on('$viewContentLoaded', function (a) {
           $scope.getCategoryTypes();
           $scope.getCategory();
        });

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
                }
                // call toaster 
                // call get list here
            }
            
        });
    }    
  
    $scope.addnew=function()
    {
        $scope.category.sub_categories.push({
            'subCategory_name':''
        });
    }
    $scope.remove=function(index,id){
        swal({
            title: "Are you sure?",
             text: "Are you sure you want to delete this Sub Category ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Yes",
             cancelButtonText: "No",
             closeOnConfirm: true

         }, function () {
            if(id!=null && id!=undefined && id!=""){
                commonServices.deleteServiceparam("/api/deleteSubCategory/"+id).then(function(response){
                    // console.log(response);
                    if(response.data.code == 200){
                       $scope.category.sub_categories.splice(index,1);
                       notificationService.displaySuccess("Sub category deleted successfully");
                        // call toaster 
                        // call get list here
                    }
                    else{
                        notificationService.displaySuccess(response.data.message);
                    }
                    
                 });
            }
         else{
            $scope.category.sub_categories.splice(index,1);
            notificationService.displaySuccess("Sub category deleted successfully");                              
            try{
                $scope.$apply();           
            }
            catch(ex){
            }
         }
         })
        //alert(index+" "+id)
      
        
    }
    $scope.save=function()
    {
        commonServices.postService("/api/addCategory",$scope.category).then(function(response){
            console.log(response);
            if(response.data.code == 200){
                // call toaster 
                $scope.reset();
//$scope.category.category_type="5adc4f7b76ce5f35d8df9687";
$scope.getCategory();
                // call get list here
            }
            
            
        });
        // call save method of the service to save category.
        
    }
    $scope.deleteCategory=function(id)
    {
        swal({
            title: "Are you sure?",
             text: "Are you sure you want to delete this Category ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Yes",
             cancelButtonText: "No",
             closeOnConfirm: true

         }, function () {
            commonServices.deleteServiceparam("/api/deleteCategory/"+id).then(function(response){
                // console.log(response);
                if(response.data.code == 200){
                    notificationService.displaySuccess("category deleted successfully");
                    $scope.reset();
                    $scope.IsAdd=true;                    
                    $scope.getCategory();
                    // call toaster 
                    // call get list here
                }
                else{
                    notificationService.displayError(response.data.message)
                }
                
             });
         });      
    }
        $scope.reset=function()
        {
             $scope.category={};
    $scope.category.sub_categories=[ {
        'subCategory_name':''
    }];
    $scope.form.$setPristine();
    $scope.form.$setUntouched();
    $scope.IsAdd=true;
        }
    // alert('home');
    }]);