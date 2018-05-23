 "use strict";   
angular.module('kabi').controller('homeCtrl', ['$scope','$http','commonServices','$linq',function ($scope,$http,commonServices,$linq) {
    
    $scope.$on('$viewContentLoaded', function (a) {
    $scope.getProducts();
 });
$scope.productList=[];
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
                    angular.forEach(response.data.data,function(prod){
                        if(prod.item_images.length!=0){
                            prod.item_images[0].image_path = prod.item_images[0].image_path.replace('43.65','43.215');
                            $scope.productList.push(prod);

                        }
                    });
                    // $scope.productList=response.data.data;
                    $scope.featuredProduct = groupProduct($scope.productList);
                    $scope.latestProduct = groupProduct($linq.Enumerable().From($scope.productList)
					.OrderBy(function (x) {
						return new Date(x.createdAt)
					}).ToArray());
                     
                    console.log($scope.featuredProduct);
                }
                // call toaster 
                // call get list here
            }
            
        });
    }    

// START Group product function
    var groupProduct = function (list) {
            var count = 1;

            var listGroup = [{ child: [], isActive: true }];
            angular.forEach(list, function (obj, key) {
                if (count > 4) {
                    listGroup.push({ child: [], isActive: false });
                    count = 1;
                }
                if (count <= 4) {
                    listGroup[listGroup.length - 1].child.push(obj);
                    count++;
                }
            });
            // angular.forEach(listGroup, function (list) {
            //     var activeInterestTab = $linq.Enumerable().From(list.child)
            //         .Where(function (x) {
            //             return x.isActive === true;
            //         }).Select(function (x) { return x }).FirstOrDefault();
            //     if (activeInterestTab != undefined)
            //         list.isActive = true;
            //     else
            //         list.isActive = false;
            // });
            return listGroup;
            //$scope.interestListGroup[$scope.interestListGroup.length - 1].isActive = true;
            //$scope.interestListGroup = [{ child: [{ id: 1, name: "Interval 1", geom: "", grossAcres: 0, depthCount: 0, isActive: true }, { id: 1, name: "Interval 2", geom: "", grossAcres: 0, depthCount: 0, isActive: true }], isActive: true }];
        }
        // END Group product function
    }]);