"use strict";   
angular.module('kabi').controller('productCtrl', ['$scope','commonServices',function ($scope,commonServices) {

    $scope.prodImage=[];
$scope.productList=[];
$scope.productVm={
    product:{}
};
$scope.addProduct = function(){
    angular.element('#modalAddProduct').modal('show');
};
//////////////////////////////////
$scope.addImages = function(){
    // $scope.prodImage=[];
    // console.log($scope.files);
    var files = document.getElementById("prod_image").files;
    angular.forEach(files,function(image) {
        $scope.prodImage.push({
            blobUrl:window.URL.createObjectURL(image),
            file :image,
            isThumbnail:false
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
    angular.forEach($scope.prodImage,function(image) {
        commonServices.getBase64(image.file).then(function(data){
            $scope.productVm.item.images.push({
                isThumbnail:image.isThumbnail,
                imageString : data
            });
        });
        
    });
    console.log($scope.productVm.item);
    
}

    }]);