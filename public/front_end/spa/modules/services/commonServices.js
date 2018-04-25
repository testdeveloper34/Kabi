    "use strict";

    angular.module('kabi').factory("commonServices", commonServices);

    commonServices.$inject = ["$http", "$state",  "$q"];

    function commonServices($http, $state, $q) {
            var commonService = {};
            var baseUrl="http://192.168.43.215:5001";
            var getService = function (getUrl,ignoreLoader=false) {             
                var deferred = $q.defer();
                var requestOption = {
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
                $http.delete(getUrl, {
                    params: params,
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

            commonService.getService = getService;
            commonService.getServiceparam = getServiceparam;
            commonService.postService = postService;
            commonService.putService = putService;
            commonService.deleteService = deleteService;
            commonService.deleteServiceparam = deleteServiceparam;
            
            
return commonService;
    }