"use strict";

angular.module('kabi', ['ui.router','LocalStorageModule','datatables','ngFileUpload']);

    angular.module("kabi").config(function ($stateProvider, $urlRouterProvider, $locationProvider, $sceProvider,$httpProvider) {
        // $sceProvider.enabled(false);
        // $httpProvider.interceptors.push(function ($q, $location, $localStorage) {
        //     return {
        //         request: function (config) {
        //             config.headers = config.headers || {};
        //             // config.headers['Authorization'] = 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
        //             config.headers['authorization'] = 'admin_bearer ' + $localStorage.token;
        //             config.headers['client-type'] = 'browser'; // this is used to detect the request is from the browser
        //             return config;
        //         },
        //         response: function (response) {
        //             if (response.data.code == 401) {
        //                 delete $localStorage.token;
        //                 // handle the case where the user is not authenticated
        //                 $location.path('/login');
        //             }
        //             return response || $q.when(response);
        //         }
        //     };
        // });
        //$locationProvider.hashPrefix('');
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('Dashboard.Home', {
                url: '/',
                templateUrl:  '/spa/modules/home/views/home.html',
                controller:'homeCtrl'
            })
         .state('Dashboard.Test', {
                url: '/',
                templateUrl:  '/spa/modules/product/addupdateCategory.html',
                // controller:'homeCtrl'
            })
            .state('Dashboard', {
                abstract: true,
                views: {
                    '@': {
                        templateUrl:  '/spa/modules/Layout/layout.html',
                        controller:'layoutCtrl'
                    },
                    'body@Dashboard': {
                        templateUrl:  '/spa/modules/Layout/content.html'
                    }
                    //,
                    //'footer@Dashboard': {
                    //    templateUrl: baseUrl + 'scripts/spa/shedEstimator/shed/shed.html',
                    //}
                },
            })
            .state('Admin', {
                abstract: true,
                views: {
                    '@': {
                        templateUrl:  '/spa/modules/Layout/adminlayout.html',
                    },
                    'body@Admin': {
                        templateUrl:  '/spa/modules/Layout/content.html'
                    }
                    //,
                    //'footer@Dashboard': {
                    //    templateUrl: baseUrl + 'scripts/spa/shedEstimator/shed/shed.html',
                    //}
                },
            })
            .state('Admin.Category', {
                url: '/admin/category',
                templateUrl:  '/spa/modules/admin/Category/views/category.html',
                controller:'categoryCtrl'
            })
            .state('Admin.ProductList', {
                url: '/admin/productlist',
                templateUrl:  '/spa/modules/admin/Products/views/productsList.html',
                controller:'productCtrl'
            })
        //  $locationProvider.html5Mode({
        //      enabled:true,
        //      requireBase:false
        //  })
    });
