"use strict";   
angular.module('kabi').controller('categoryCtrl', ['$scope','commonServices',function ($scope,commonServices) {

    $scope.category={};
    $scope.category.subcategory=[ {
        'SubcategoryName':''
    }];

    $scope.categoryList = [
        {category_id:"1",category_name:"Clothing",category_types:"Men",deleted:false,sub_category:[
            {subCategory_id:"1",subCategory_name:"Jeans"},
            {subCategory_id:"2",subCategory_name:"T-shirts"},
            {subCategory_id:"3",subCategory_name:"Jeans"}
        ]},
        {category_id:"2",category_name:"Accessories",category_types:"Men",deleted:false,sub_category:[
            {subCategory_id:"4",subCategory_name:"Watches"},
            {subCategory_id:"5",subCategory_name:"Sunglasses"}
        ]},
        {category_id:"3",category_name:"Clothing",category_types:"Women",deleted:false,sub_category:[
            {subCategory_id:"6",subCategory_name:"Kurti"},
            {subCategory_id:"7",subCategory_name:"Tops"}
        ]},
        {category_id:"4",category_name:"Accessories",category_types:"Women",deleted:false,sub_category:[
            {subCategory_id:"8",subCategory_name:"Watches"},
            {subCategory_id:"9",subCategory_name:"Sunglasses"}
        ]},
    ];
    $scope.addnew=function()
    {
        $scope.category.subcategory.push({
            'SubcategoryName':''
        });
    }
    $scope.remove=function(index){
        $scope.category.subcategory.splice(index,1);
    }
    $scope.save=function()
    {
        // call save method of the service to save category.
        $scope.categoryList.push($scope.category);
        $scope.category ={
            category_name:"",
            category_types:"Men",
            subcategory: [ {
                'SubcategoryName':''
            }]
        }
    }
    // alert('home');
    }]);