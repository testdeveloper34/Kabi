    "use strict";

    angular.module('kabi').factory("commonServices", commonServices);

    commonServices.$inject = ["$http", "$state",  "$q","Upload"];

    function commonServices($http, $state, $q,Upload) {
            var commonService = {};
            var baseUrl="";
            //var baseUrl="http://192.168.43.215:5001";
            var getService = function (getUrl,ignoreLoader=false) {             
                var deferred = $q.defer();
                var requestOption = {
                    headers: { 'Content-Type': 'application/json' }
                };
                // if (ignoreLoader === true)
                //     requestOption.ignoreLoadingBar = true;
                $http.get(baseUrl+getUrl, requestOption ).then(function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var getServiceparam = function (getUrl, params, ignoreLoader = false) {
                var deferred = $q.defer();
                var requestOption = {
                    params: params,
                    headers: { 'Content-Type': 'application/json' }
                };
                // if (ignoreLoader === true)
                //     requestOption.ignoreLoadingBar = true;
                $http.get(getUrl, requestOption ).then(function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var deleteServiceparam = function (getUrl, params) {
                var deferred = $q.defer();
                $http.delete(baseUrl+getUrl, {
                    //params: params,
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var putService = function (postUrl, postInfo) {

                var deferred = $q.defer();
                $http.put(postUrl, postInfo, {
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (response) {
                    deferred.resolve(response);
                }, function (err) {

                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var postService = function (postUrl, postInfo, ignoreLoader=false ) {
                var deferred = $q.defer();
                var requestOptions = {
                    headers: { 'Content-Type': 'application/json' }
                }
                // if (ignoreLoader === true)
                //     requestOptions.ignoreLoadingBar = true;
                $http.post(baseUrl+postUrl, postInfo, requestOptions).then(function (response) {
                    deferred.resolve(response);
                }, function (err) {

                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var postMultipartService = function (postUrl, postInfo, ignoreLoader=false ) {
                var deferred = $q.defer();
                var requestOptions = {
                    headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryp7MA4YWxkTrZu0gW' }
                }
                // if (ignoreLoader === true)
                //     requestOptions.ignoreLoadingBar = true;
                // $http.post(baseUrl+postUrl, postInfo, requestOptions)
                $http({
                    url:baseUrl+postUrl,
                    method:"POST",
                    data:postInfo ,
                    // params:postInfo,
                    headers: { 'Content-Type': undefined  }
                })
            //     Upload.upload({
            //     url: baseUrl+postUrl,
            //     data: {
            //         files: postInfo
            //     },
            //     headers: { 'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryp7MA4YWxkTrZu0gW' }
            // })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (err) {

                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var deleteService = function (postUrl, postInfo) {

                var deferred = $q.defer();
                $http.delete(postUrl, postInfo, {                   
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (response) {
                    deferred.resolve(response);
                }, function (err) {

                    deferred.reject(err);
                });

                return deferred.promise;
            }

            var getBase64 = function (file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
                // var reader = new FileReader();
                // reader.readAsDataURL(file);
                // reader.onload = function () {
                //     return reader.result;
                // };
                // reader.onerror = function (error) {
                //     console.log('Error: ', error);
                // };
            }

            commonService.getService = getService;
            commonService.getServiceparam = getServiceparam;
            commonService.postService = postService;
            commonService.postMultipartService = postMultipartService;
            commonService.putService = putService;
            commonService.deleteService = deleteService;
            commonService.deleteServiceparam = deleteServiceparam;
            commonService.getBase64 = getBase64;
            
            
            
return commonService;
    }