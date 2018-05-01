"use strict";   
angular.module('kabi').controller('categoryCtrl', ['$scope','commonServices',function ($scope,commonServices) {

    $scope.category={};
    $scope.category.sub_categories=[ {
        'subCategory_name':''
    }];

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
    // alert('home');
    }]);