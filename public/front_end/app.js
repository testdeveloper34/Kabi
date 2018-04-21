"use strict";

angular.module('kabi', ['ui.router','LocalStorageModule']);

    angular.module("kabi").config(function ($stateProvider, $urlRouterProvider, $locationProvider, $sceProvider) {
        // $sceProvider.enabled(false);
        //$locationProvider.hashPrefix('');
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('Dashboard.Home', {
                url: '/',
                templateUrl:  '/spa/modules/home/home.html',
                controller:'homeCtrl'
            })
         .state('Dashboard.Test', {
                url: '/',
                templateUrl:  '/spa/modules/home/test.html',
                // controller:'homeCtrl'
            })
            .state('Dashboard', {
                abstract: true,
                views: {
                    '@': {
                        templateUrl:  '/spa/modules/Layout/layout.html',
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
            .state('Admin.AddCategory', {
                url: '/admin/addcategory',
                templateUrl:  '/spa/modules/admin/addCategory.html',
                // controller:'homeCtrl'
            })
         //$locationProvider.html5Mode(true).hashPrefix('');
    });
