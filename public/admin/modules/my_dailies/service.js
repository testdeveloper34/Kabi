"use strict"

// angular.module("Product")

neoApp.factory('DailiesService', ['$http', 'communicationService', '$resource', function ($http, communicationService, $resource) {

    var getDailiesList = function () {
        return $resource('/api/listMyDailiesByAdmin', null, {
            save: {
                method: 'Post'
            }
        });
    }
    var getDailiesByID = function () {
        return $resource('/api/getDailiesByID', null, {
            save: {
                method: 'Post'
            }
        });
    }
    var deleteDailies = function () {
        return $resource('/api/deleteDailiesByID/:id', null, {
            delete: {
                method: 'DELETE',
                id: '@id'
            }
        });
    }

    var downloadpdf = function () {
        return $resource('/api/downloadPdf', null, {
            save: {
                method: 'Post'
            }
        });
    }

    var downloadxls = function () {
        return $resource('/api/downloadXls', null, {
            save: {
                method: 'Post'
            }
        });
    }
    var updateDailyStatus = function () {
        console.log("inside updateDailyStatus")
        return $resource('/api/updateDailyStatus', null, {
            save: {
                method: 'Post'
            }
        });
    }
    var saveViewEdit = function () {
        console.log("inside saveViewEdit")
        return $resource('/api/saveViewEdit', null, {
            save: {
                method: 'Post'
            }
        });
    }
    var downloadMultiplePdf = function () {
        console.log("inside downloadMultiplePdf")
        return $resource('/api/downloadMultiplePdf', null, {
            save: {
                method: 'Post'
            }
        });
    }
    var getDailiesDate = function () {
        console.log("inside getDailiesDate")
        return $resource('/api/getDailiesDate', null, {
            save: {
                method: 'Post'
            }
        });
    }
    // var getDailiesListByDate = function () {
    //     console.log("inside downloadMultiplePdf")
    //     return $resource('/api/getDailiesListByDate', null, {
    //         save: {
    //             method: 'Post'
    //         }
    //     });
    // }

    return {
        getDailiesList: getDailiesList,
        getDailiesByID: getDailiesByID,
        deleteDailies: deleteDailies,
        downloadpdf: downloadpdf,
        downloadxls: downloadxls,
        updateDailyStatus: updateDailyStatus,
        saveViewEdit: saveViewEdit,
        downloadMultiplePdf: downloadMultiplePdf,
        getDailiesDate: getDailiesDate,
        // getDailiesListByDate: getDailiesListByDate,

    }

}]);