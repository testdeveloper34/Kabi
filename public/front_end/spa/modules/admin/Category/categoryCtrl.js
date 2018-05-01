"use strict";   
angular.module('kabi').controller('categoryCtrl', ['$scope','commonServices',function ($scope,commonServices) {

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
<<<<<<< HEAD
    $scope.remove=function(index,id){
        //alert(index+" "+id)
        if(id!=null && id!=undefined && id!=""){
            commonServices.deleteServiceparam("/api/deleteSubCategory/"+id).then(function(response){
                // console.log(response);
                if(response.data.code == 200){
                   $scope.category.sub_categories.splice(index,1);
                    // call toaster 
                    // call get list here
                }
                else{
                    alert(response.data.message);
                }
                
             });
        }
     else{
        $scope.category.sub_categories.splice(index,1);
     }
        
=======
    $scope.remove=function(index){
        if (!index){
            console.log("sdwds")
        }    
        else{
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

					
 $scope.category.sub_categories.splice(index,1);
                });
        }
       
>>>>>>> b325eef8f08db1fe520943535256e3664eccbd83
    }
    $scope.save=function()
    {
        commonServices.postService("/api/addCategory",$scope.category).then(function(response){
            console.log(response);
            if(response.data.code == 200){
                // call toaster 
                $scope.category={};
                 $scope.category.sub_categories=[ {
        'subCategory_name':''
    }];
$scope.category.category_type="5adc4f7b76ce5f35d8df9687";
$scope.getCategory();
                // call get list here
            }
            
            
        });
        // call save method of the service to save category.
        
    }
    $scope.deleteCategory=function(id){
        commonServices.deleteServiceparam("/api/deleteCategory/"+id).then(function(response){
            // console.log(response);
            if(response.data.code == 200){
                alert("category delete successfully");
                $scope.category={};
                $scope.category.category_type="5adc4f7b76ce5f35d8df9687";
                $scope.getCategory();
                // call toaster 
                // call get list here
            }
            else{
                alert(response.data.message);
            }
            
         });
        
    }
    // alert('home');
    }]);