"use strict";

neoApp.controller("dailiesController", ['$scope', '$rootScope', '$localStorage', 'ngTableParams', '$routeParams', '$route', '$location', 'logger', 'ngTableParamsService', '$state', '$stateParams', 'CommonService', '$uibModal', '$filter', 'UserService', 'DailiesService', '$q', 'JobService',
	function ($scope, $rootScope, $localStorage, ngTableParams, $routeParams, $route, $location, logger, ngTableParamsService, $state, $stateParams, CommonService, $uibModal, $filter, UserService, DailiesService, $q, JobService) {

		$scope.incident = {};
		$scope.searchObj = {};
		$scope.disabled = false;
		$scope.showDiv = false;
		$scope.loader = false;
		ngTableParamsService.set('', '', '', '');
		var pageLoaded = false;
		$(document).ready(function () {
			$(".fancybox").fancybox();
			
		});

		$scope.getDailiesList = function (filterFlag) {
			console.log(filterFlag, 'sdfdsfdsf')

			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting(), filterFlag);
					$scope.paramUrl = params.url();
					$scope.paramUrl.filterFlag = filterFlag;
					
					$scope.paramUrl.parent_id = CommonService.getUser()._id;
					$scope.tableLoader = true;
					$scope.dailiesList = [];
					DailiesService.getDailiesList().save($scope.paramUrl, function (response) {
						//$scope.paramUrlActive = paramUrl;
						$scope.tableLoader = false;
						$scope.dailiesList = response.data;
						$scope.simpleList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						params.total(response.totalLength);
						$defer.resolve(data);
						$scope.checkboxes = {
							checked: false,
							items: {}
						};
					});

				}

			});
		};

		$scope.switchHtml = function (val) {
			//console.log(val);
			(val) ? $state.go('dashboard') : $state.go('dailies')
			// if (val == false)
			// 	$state.go('dailies')
			// if (val == true)
			// 	$state.go('dashboard')
		}

		$scope.clear = function () {
			$scope.dailies.from_date = null;
			$scope.dailies.to_date = null;

		}
		$scope.searchDate = function () {
			if(!pageLoaded){
				$('.range_inputs .cancelBtn').on('click', function() {
				$('input[name="searchQuery"]').val("")
				// $scope.getDailiesList();
				// $scope.tableParams.getData();
				// ngTableParamsService.get();
$scope.getDailiesList();
 $scope.getdailiesdetails();
			});
				pageLoaded = true;
			}
			
		}


		$scope.options = {
			locale: { cancelLabel: 'Clear' },
			showDropdowns: true
		};
		$scope.$watch("searchObj.dateRange", function (newValue, oldValue) {
			console.log("I've changed : ", newValue, "newvalue", oldValue, "oldvalue");
			$scope.tableLoader = true;

			if (newValue == oldValue) {
				console.log("oldvalue")
			} else {
				 newValue.parent_id = CommonService.getUser()._id;
				 console.log('newValue>>>>>>',newValue)
				DailiesService.getDailiesList().save(newValue, function (response) {
					console.log(response, "resposne is here")
					if (response.code == 200) {
						$scope.tableLoader = false;
						// $scope.simpleList = response.data;

						$scope.dailiesList = response.data;

					}

				})
			}
		});








		$scope.fromDate = function () {
			console.log("inside from date")
			$scope.from_date.opened = true;
		};

		$scope.toDate = function () {
			$scope.to_date.opened = true;
		};


		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.altInputFormats = ['M!/d!/yyyy'];

		$scope.from_date = {
			opened: false
		};

		$scope.to_date = {
			opened: false
		};



		$scope.deletedailies = function (id) {
			bootbox.confirm('Are you sure you want to delete this dailies', function (r) {
				if (r) {
					DailiesService.deleteDailies().delete({
						id: id
					}, function (response) {
						if (response.code == 200) {
							$scope.getDailiesList();
							logger.logSuccess(response.message);
						} else {
							logger.logError(response.message);
						}
					});
				}
			})
		}



		/**Delete All Dailies */

		$scope.noDataFlag = false;
		//Toggle multilpe checkbox selection
		$scope.selection = [];
		$scope.selectionAll;
		$scope.toggleSelection = function toggleSelection(dailies) {
			console.log(dailies, "dailies is here")
			$scope.dailies = dailies;
			//Check for single checkbox selection
			if (dailies) {
				console.log("if dailies", dailies);
				var idx = $scope.selection.indexOf(dailies._id);
				// is currently selected
				if (idx > -1) {

					$scope.selection.splice(idx, 1);
				}
				// is newly selected
				else {
					console.log("inside else")
					$scope.selection.push({
						id: dailies._id,
						dalily_number: dailies.dalily_number,
						// job_id: dailies.job_detail.job_id,
						// job_name: dailies.job_detail.client

					});
					// $scope.selection.push(user._id);
				}
			}
			//Check for all checkbox selection
			else {
				//Check for all checked checkbox for uncheck
				if ($scope.selection.length > 0 && $scope.selectionAll) {
					$scope.selection = [];
					$scope.checkboxes = {
						checked: false,
						items: {}
					};
					$scope.selectionAll = false;
				}
				//Check for all un checked checkbox for check
				else {
					$scope.selectionAll = true
					$scope.selection = [];
					angular.forEach($scope.simpleList, function (item) {
						console.log(item, "what is item");
						$scope.checkboxes.items[item._id] = $scope.checkboxes.checked;
						$scope.selection.push({
							id: item._id
						});
					});
				}
			}
			console.log($scope.selection, 'zxcfvccxvx')
		};


		/**Perform action */
		$scope.performAction = function () {
			console.log()
			var roleLength = $scope.selection.length;
			console.log(roleLength, "rolelength");
			var updatedData = [];
			$scope.selectedAction = selectedAction.value;
			console.log($scope.selectedAction, "$scope.selectedAction")
			var actionValue = '';
			// switch ($scope.selectedAction) {
			// 	case '1':
			// 		actionValue = 'activate';
			// 		break;
			// 	case '2':
			// 		actionValue = 'deactivate';
			// 		break;
			// 	case '3':
			// 		actionValue = 'delete';
			// 		break;
			// 	case '4':
			// 		actionValue = 'turn on membership fee of';
			// 		break;
			// 	case '5':
			// 		actionValue = 'turn off membership fee of';
			// 		break;
			// }
			if ($scope.selectedAction == 0 || $scope.selection.length == 0)
				console.log("inside if")
			else {
				console.log("inside else")
				swal({
					title: "Are you sure?",
					text: "Are you sure you want to Delete the selected user?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true

				}, function () {

					for (var i = 0; i < roleLength; i++) {
						// var id = $scope.selection[i].id;
						// var email = $scope.selection[i].email;
						// var first_name = $scope.selection[i].first_name;
						// var last_name = $scope.selection[i].last_name;
						// var kids = $scope.selection[i].kids;	

						var id = $scope.selection[i].id;
						var firstname = $scope.selection[i].firstname;
						var lastname = $scope.selection[i].lastname;
						var email = $scope.selection[i].email

						if ($scope.selectedAction == 3) {
							updatedData.push({
								id: id,
								deleted: true
							});
						} else if ($scope.selectedAction == 1) {
							updatedData.push({
								id: id,
								email: email,
								firstName: firstname,
								lastName: lastname,
							});
						} else if ($scope.selectedAction == 2) {
							updatedData.push({
								id: id,
								// is_active: false
							});
						} else if ($scope.selectedAction == 4) {
							updatedData.push({
								id: id,
								// is_membership: true
							});
						} else if ($scope.selectedAction == 5) {
							updatedData.push({
								id: id,
								// is_membership: false
							});
						}


						// firstname: user.firstname,
						// lastname: user.lastname,
						// email: user.email,





					}
					var inputJson = {
						data: updatedData
					}
					console.log(inputJson, 'dsasadasdMMMMMMMMMMMMMMMMMM')
					//  UserService.updateUserStatus(inputJson, function (response) {
					//             logger.logSuccess(response.message);
					//             $rootScope.message = messagesConstants.updateStatus;
					//             $route.reload();
					//         });
					DailiesService.updateDailyStatus().save(inputJson, function (response) {
						if (response.code == 200) {
							//$route.reload();
							$scope.getDailiesList();
							logger.logSuccess(response.message);

						} else {

							logger.logError('Failed');
						}
						// $rootScope.message = messagesConstants.updateStatus;


					});

				});



			}
		}





		$scope.noDataFlag = false;
		//Toggle multilpe checkbox selection
		$scope.selection = [];
		$scope.selectionAll;
		$scope.toggleSelection = function toggleSelection(dailies) {
			console.log(dailies, "dailies is here")
			$scope.dailies = dailies;
			//Check for single checkbox selection
			if (dailies) {
				console.log("if dailies", dailies);
				var idx = $scope.selection.indexOf(dailies._id);
				// is currently selected
				if (idx > -1) {

					$scope.selection.splice(idx, 1);
				}
				// is newly selected
				else {
					console.log("inside else")
					$scope.selection.push({
						id: dailies._id,
						dalily_number: dailies.dalily_number,
						// job_id: dailies.job_detail.job_id,
						// job_name: dailies.job_detail.client

					});
					// $scope.selection.push(user._id);
				}
			}
			//Check for all checkbox selection
			else {
				//Check for all checked checkbox for uncheck
				if ($scope.selection.length > 0 && $scope.selectionAll) {
					$scope.selection = [];
					$scope.checkboxes = {
						checked: false,
						items: {}
					};
					$scope.selectionAll = false;
				}
				//Check for all un checked checkbox for check
				else {
					$scope.selectionAll = true
					$scope.selection = [];
					angular.forEach($scope.simpleList, function (item) {
						console.log(item, "what is item");
						$scope.checkboxes.items[item._id] = $scope.checkboxes.checked;
						$scope.selection.push({
							id: item._id
						});
					});
				}
			}
			console.log($scope.selection, 'zxcfvccxvx')
		};






		// $scope.downloadsinglepdf = function (daily) {

		// 	$scope.users = {};
		// 	$scope.users._id = daily._id;
		// 	$scope.users.parent_id = daily.contractor_details._id;
		// 	console.log('User---------->>',$scope.users)
		// 	DailiesService.downloadpdf().save($scope.users, function (response) {
		// 		if (response.code == 200) {
		// 			$scope.myDailysinglePdfLink = response.data[0];
		// 			var path = '/' + $scope.myDailysinglePdfLink;
		// 			setTimeout(function () {
		// 				window.open(path)
		// 			}, 1000);


		// 		}
		// 	});
		// }










		// MAP CODE START HERE


		$scope.clearsearch = function () {
			document.getElementById('pac-input').value = "";
			$scope.getdailiesdetails();
			$scope.data_length = 0
		}

		$scope.dynamicbtn = function (keys) {
			console.log(keys, "keys")
			$scope.data_length = keys.length;


		}




		$scope.getdailiesdetails = function () {

			console.log('map calleddddddddddddddddd................');
			$scope.parent_id = {}
			$scope.parent_id = CommonService.getUser()._id;
			DailiesService.getDailiesList().save({
				parent_id: $scope.parent_id
			}, function (response) {
				if (response.code == 200 && response.data.length > 0) {
					console.log(response.data)
					$scope.data = response.data;
					$scope.location = [];
					for (var i = 0; i < $scope.data.length; i++) {
						$scope.location.push({
							"lng": parseFloat($scope.data[i].longitude),
							"lat": parseFloat($scope.data[i].latitude),
							"foreman": $scope.data[i].foremen_details.firstname + " " + $scope.data[i].foremen_details.lastname,
							"from_date": moment($scope.data[i].from_date).format('MMMM Do YYYY, h:mm:ss a'),
							"daily_number": $scope.data[i].daily_number,
							"job_map": $scope.data[i].job_map,
							"billable_items": $scope.data[i].billable_items,
							"id": $scope.data[i]._id
						})

					}

					$scope.markerfeed = [];
					var myLatLng = {
						lat: $scope.location[0].lat,
						lng: $scope.location[0].lng
					};
					var map = new google.maps.Map(document.getElementById('map'), {
						zoom: 12,
						center: myLatLng
					})
					$scope.infowindow = new google.maps.InfoWindow({
						content: '',
						maxWidth: 260
					});
					var oms = new OverlappingMarkerSpiderfier(map, {
						markersWontMove: true,
						markersWontHide: true,
						basicFormatEvents: true
					});

					for (var i = 0; i < $scope.location.length; i++) {

						//var labels = '#' + $scope.location[i].daily_number;
						var markers = new google.maps.Marker({
							position: $scope.location[i],
							map: map,
							animation: google.maps.Animation.DROP,
							icon: '/assets/images/gps.png'
						})
						$scope.markerfeed.push(markers);
						oms.addMarker(markers);
						var content = '<div id="iw-container">' +
							'<div class="iw-content">' +
							'<div class="list-group col col-sm-6">' +
							'<a class="list-group-item"><span>#' + $scope.location[i].daily_number + '</span></a>' +
							'<a class="list-group-item"><span>' + $scope.location[i].from_date + '</span></a>' +
							'<a class="list-group-item"><span>' + $scope.location[i].foreman + '</span></a>' +
							'</div>' +
							'<div class="list-group col col-sm-6">';
						if ($scope.location[i].billable_items.length > 0) {
							content += '<a class="list-group-item"><span>' + $scope.location[i].billable_items[0].name + '</span></a>' +
								'<a class="list-group-item"><span>' + $scope.location[i].billable_items[0].quantity + '</span></a>';
						}
						content += '<a class="list-group-item" ng-click="viewDailiesDetail(' + $scope.location[i].daily_number + ')"><span>more...</span></a>' +
							'<a class="list-group-item"><span>' + $scope.location[i].job_map + '</span></a>' +
							'</div>' +
							'</div>' +
							'</div>';
						var compiledContent = $compile(content)($scope)
						google.maps.event.addListener(markers, 'spider_click', (function (markers, content, scope) {
							return function () {
								scope.infowindow.setContent(content);
								scope.infowindow.open(scope.map, markers);
							};

						})(markers, compiledContent[0], $scope));
					} //FOR LOOP END,

					var markerCluster = new MarkerClusterer(map, $scope.markerfeed, {
						maxZoom: 15,
						imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
					});
				} else {
					var uluru = {
						lat: 30.6972563,
						lng: -88.1910169
					};
					var map = new google.maps.Map(document.getElementById('map'), {
						zoom: 12,
						center: uluru
					})
				}
			}) //Dailies marker on map


			//Google Map Dailies Searching 
			var input = document.getElementById('pac-input');
			var searchBox = new google.maps.places.SearchBox(input);
			var autocomplete = new google.maps.places.Autocomplete(input);
			google.maps.event.addListener(autocomplete, 'place_changed', function () {

				console.log('map calleddddddddddddddddd................');

				$scope.dailies = {};
				var geoComponents = autocomplete.getPlace();
				var location = geoComponents.formatted_address
				var latitude = geoComponents.geometry.location.lat();
				var longitude = geoComponents.geometry.location.lng();
				$scope.dailies.long = longitude;
				$scope.dailies.lat = latitude;
				$scope.dailies.location = location;
				$scope.dailies.parent_id = CommonService.getUser()._id;
				DailiesService.getDailiesList().save($scope.dailies, function (response) {
					if (response.code == 200 && response.data.length > 0) {
						$scope.dailiesData = response.data
						$scope.locations = [];
						for (var i = 0; i < $scope.dailiesData.length; i++) {
							$scope.locations.push({
								"lng": parseFloat($scope.dailiesData[i].longitude),
								"lat": parseFloat($scope.dailiesData[i].latitude),
								"foreman": $scope.dailiesData[i].user_id.firstname + " " + $scope.dailiesData[i].user_id.lastname,
								"from_date": new Date($scope.dailiesData[i].from_date).toString("yyyy MMM dd"),
								"daily_number": $scope.dailiesData[i].daily_number,
								"job_map": $scope.dailiesData[i].job_map,
								"billable_items": $scope.dailiesData[i].billable_items,
								"id": $scope.dailiesData[i]._id
							})

						}

						var map = new google.maps.Map(document.getElementById('map'), {
							zoom: 12,
							center: $scope.locations[0]
						})

						$scope.infowindow = new google.maps.InfoWindow({
							content: '',
							maxWidth: 260
						});


						for (var i = 0; i < $scope.locations.length; i++) {

							//var labels = '#' + $scope.locations[i].daily_number;
							var markers = new google.maps.Marker({
								position: $scope.locations[i],
								map: map,
								animation: google.maps.Animation.DROP,
								icon: '/assets/images/pin.png'
							})
							var content = '<div id="iw-container">' +
								'<div class="iw-content">' +
								'<div class="list-group col col-sm-6">' +
								'<a class="list-group-item"><span>#' + $scope.location[i].daily_number + '</span></a>' +
								'<a class="list-group-item"><span>' + $scope.location[i].from_date + '</span></a>' +
								'<a class="list-group-item"><span>' + $scope.location[i].foreman + '</span></a>' +
								'</div>' +
								'<div class="list-group col col-sm-6">';
							if ($scope.location[i].billable_items.length > 0) {
								content += '<a class="list-group-item"><span>' + $scope.location[i].billable_items[0].name + '</span></a>' +
									'<a class="list-group-item"><span>' + $scope.location[i].billable_items[0].quantity + '</span></a>';
							}
							content += '<a class="list-group-item" ng-click="viewDailiesDetail(' + $scope.location[i].daily_number + ')"><span>more...</span></a>' +
								'<a class="list-group-item"><span>' + $scope.location[i].job_map + '</span></a>' +
								'</div>' +
								'</div>' +
								'</div>';
							var compiledContent = $compile(content)($scope)
							google.maps.event.addListener(markers, 'click', (function (markers, content, scope) {
								return function () {
									scope.infowindow.setContent(content);
									scope.infowindow.open(scope.map, markers);
								};
							})(markers, compiledContent[0], $scope));

						}
					} else {
						// logger.logError("No search found");
						var map = new google.maps.Map(document.getElementById('map'), {
							zoom: 12,
							center: {
								lat: latitude,
								lng: longitude
							}
						})
						var myLatLng = {
							lat: latitude,
							lng: longitude
						};
						var marker = new google.maps.Marker({
							position: myLatLng,
							map: map

						});
					}
				});
			})
		}




		//   MAP CODE ENDS HERE















		$scope.downloadMultiplePdf = function (dailies) {
			console.log("inside downloadMultiplePdf", dailies);
			var roleLength = $scope.selection.length;
			console.log(roleLength, "rolelength");
			var updatedData = [];
			$scope.selectedActionn = selectedActionn.value;
			console.log($scope.selectedActionn, "$scope.selectedAction")
			var actionValue = '';

			// $scope.users.parent_id = CommonService.getUser()._id;



			if ($scope.selectedActionn == 0 || $scope.selection.length == 0)
				console.log("inside if")
			else {
				console.log("inside else")
				// swal({
				// 	title: "Are you sure?",
				// 	text: "Are you sure you want to " + actionValue + " selected user?",
				// 	type: "warning",
				// 	showCancelButton: true,
				// 	confirmButtonColor: "#DD6B55",
				// 	confirmButtonText: "Yes",
				// 	cancelButtonText: "No",
				// 	closeOnConfirm: true

				// },

				//  function () {

				for (var i = 0; i < roleLength; i++) {
					var id = $scope.selection[i].id;
					var firstname = $scope.selection[i].firstname;
					var lastname = $scope.selection[i].lastname;
					var email = $scope.selection[i].email

					if ($scope.selectedAction == 3) {
						updatedData.push({
							_id: id,
							deleted: true,
							parent_id: CommonService.getUser()._id
						});
					} else if ($scope.selectedAction == 1) {
						updatedData.push({
							_id: id,
							email: email,
							firstName: firstname,
							lastName: lastname,
							parent_id: CommonService.getUser()._id
						});
					} else if ($scope.selectedActionn == 2) {
						console.log($scope.selectedAction, "$scope.selectedAction>>>>>>>>>>>")
						updatedData.push({
							_id: id,
							// is_active: false
							parent_id: CommonService.getUser()._id
						});
					} else if ($scope.selectedAction == 4) {
						updatedData.push({
							_id: id,
							parent_id: CommonService.getUser()._id
							// is_membership: true
						});
					} else if ($scope.selectedAction == 5) {
						updatedData.push({
							_id: id,
							// is_membership: false
							parent_id: CommonService.getUser()._id
						});
					}


					// firstname: user.firstname,
					// lastname: user.lastname,
					// email: user.email,





				}
				var inputJson = {
					data: updatedData
				}

				inputJson.data.forEach(function (element) {
					DailiesService.downloadpdf().save(element, function (response) {
						if (response.code == 200) {
							// console.log("response",response.data)
							$scope.myDailysinglePdfLink = response.data[0];
							var path = '/' + $scope.myDailysinglePdfLink;
							setTimeout(function () {
								window.open(path)
							}, 1000);
						}
					});
				});

				//  UserService.updateUserStatus(inputJson, function (response) {
				//             logger.logSuccess(response.message);
				//             $rootScope.message = messagesConstants.updateStatus;
				//             $route.reload();
				//         });
				// DailiesService.downloadMultiplePdf().save(inputJson, function (response) {
				// 	if (response.code == 200) {
				// 		//$route.reload();
				// 		// $scope.getDailiesList();
				// 		console.log()
				// 		$scope.myDailysinglePdfLink = response.data[0];
				// 		var path = '/' + $scope.myDailysinglePdfLink;
				// 		setTimeout(function () {
				// 			window.open(path)
				// 		}, 1000);
				// 		// $scope.getDailiesList();

				// 		// logger.logSuccess(response.message);

				// 	} else {

				// 		logger.logError('Failed');
				// 	}
				// 	// $rootScope.message = messagesConstants.updateStatus;


				// });

				// });



			}

		}










		$scope.filterUser = function (filter) {

			console.log(filter, "filter is here")
			$scope.filterFlag = {};

			if (filter.daily_number) {
				$scope.filterFlag['daily_number'] = filter.daily_number;
			}
			if (filter.customer_id) {
				$scope.filterFlag['customer_id'] = filter.customer_id;
			}
			if (filter.job_id) {
				$scope.filterFlag['job_id'] = filter.job_id;
			}

			if (filter.client) {
				$scope.filterFlag['client'] = filter.client;
			}
			if (filter.foremen) {
				$scope.filterFlag['foremen'] = filter.foremen;
			}


			$scope.getDailiesList($scope.filterFlag);




		}











		$scope.checkAuditSameDate = function (type) {

			if ($scope.searchObj.dateRange && $scope.sameDate) {
				if (Object.keys($scope.searchObj.dateRange).length > 0) {
					if ($scope.sameDate.startDate && $scope.searchObj.dateRange.endDate) {
						if ($scope.sameDate.startDate != $scope.searchObj.dateRange.startDate && $scope.sameDate.endDate != $scope.searchObj.dateRange.endDate) {
							$scope.getDailiesList(type);
						}
					}
				}
			}
		}


































		$scope.downloadsinglepdf = function (daily) {

			$scope.users = {};
			$scope.users._id = daily._id;
			$scope.users.parent_id = daily.contractor_details._id;
			console.log($scope.users)
			DailiesService.downloadpdf().save($scope.users, function (response) {
				if (response.code == 200) {
					$scope.myDailysinglePdfLink = response.data[0];
					var path = '/' + $scope.myDailysinglePdfLink;
					setTimeout(function () {
						window.open(path)
					}, 1000);


				}
			});
		}

		$scope.downloadPdf = function () {

			$scope.userv = {};
			$scope.userv.parent_id = CommonService.getUser()._id;
			$scope.userv.firstname = CommonService.getUser().firstname;
			$scope.userv.lastname = CommonService.getUser().lastname;
			$scope.userv.email = CommonService.getUser().email;

			if ($scope.dailies) {
				$scope.userv.from_date = $scope.dailies.from_date;
				$scope.userv.to_date = $scope.dailies.to_date;
			}

			DailiesService.downloadpdf().save($scope.userv, function (response) {
				if (response.code == 200) {
					$scope.myDailyPdfLink = response.data[0];
					setTimeout(function () {
						window.open($scope.myDailyPdfLink)
					}, 3000);

				}
			});

		}


		$scope.downloadXls = function () {
			$scope.user = {};
			$scope.user.parent_id = CommonService.getUser()._id;
			$scope.user.firstname = CommonService.getUser().firstname;
			$scope.user.lastname = CommonService.getUser().lastname;
			$scope.user.email = CommonService.getUser().email;

			if ($scope.dailies) {
				$scope.user.from_date = $scope.dailies.from_date;
				$scope.user.to_date = $scope.dailies.to_date;
			}
			DailiesService.downloadxls().save($scope.user, function (response) {
				if (response.code == 200) {
					$scope.filePath = response.data;
					window.open('/' + $scope.filePath);
				}
				//logger.logSuccess(response.message);
			});
		}

		$scope.viewDailiesDetail = function (dailies) {

			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/admin/modules/my_dailies/views/dailies_view.html',
				controller: 'dailies_detail',
				windowClass: 'zindex',
				// size: size,
				resolve: {
					dailies: dailies
				}
			});


		}



		/**Modal Popup * Edit Modal*/


		$scope.viewEditDailiesDetail = function (dailies) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/admin/modules/my_dailies/views/dailies_viewedit.html',
				controller: 'dailies_detail',
				windowClass: 'zindex',
				// size: size,
				resolve: {
					dailies: dailies
				}
			});


		}

















		var getData = ngTableParamsService.get();
		$scope.searchTextField = getData.searchText;
		$scope.searchingDailies = function () {
			ngTableParamsService.set('', '', $scope.searchTextField, '');
			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {

					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.parent_id = CommonService.getUser()._id;
					$scope.tableLoader = true;
					$scope.dailiesList = [];

					DailiesService.getDailiesList().save($scope.paramUrl, function (response) {
						//$scope.paramUrlActive = paramUrl;
						$scope.tableLoader = false;
						$scope.dailiesList = response.data;
						$scope.simpleList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						params.total(response.totalLength);
						$defer.resolve(data);
					});
				}
			});
		}

	}

]);

neoApp.controller('dailies_detail', function ($scope, $rootScope, DailiesService, $uibModalInstance, $location, logger, dailies, ngTableParams, ngTableParamsService,CommonService) {
	// console.log(dailies.supervisor_details, "fsadfsahdfsoadfhadlkjhsadilsahdlkjhsa")
	$scope.dailies = dailies;
	$scope.dailies.foremen_details.name = (dailies.foremen_details.firstname && dailies.foremen_details.lastname) ? dailies.foremen_details.firstname.concat(' ', dailies.foremen_details.lastname) : (dailies.foremen_details.firstname) ? dailies.foremen_details.firstname : (dailies.foremen_details.lastname) ? dailies.foremen_details.lastname : null;
	(dailies.supervisor_details) ? $scope.dailies.supervisor_details.name = (dailies.supervisor_details.firstname && dailies.supervisor_details.lastname) ? dailies.supervisor_details.firstname.concat(' ', dailies.supervisor_details.lastname) : (dailies.supervisor_details.firstname) ? dailies.supervisor_details.firstname : (dailies.supervisor_details.lastname) ? dailies.supervisor_details.lastname : null : null;
	(dailies.crews_details) ? $scope.dailies.crews_details.name = (dailies.crews_details.firstname && dailies.crews_details.lastname) ? dailies.crews_details.firstname.concat(' ', dailies.crews_details.lastname) : (dailies.crews_details.firstname) ? dailies.crews_details.firstname : (dailies.crews_details.lastname) ? dailies.crews_details.lastname : null : null;

	// console.log($scope.dailies.supervisor_details.name, "dfdsaffffdsfsfdsfsdfsfsfsf")
	// $scope.dailies.foremen_details.name = (dailies.foremen_details.firstname) ? dailies.foremen_details.firstname : '';
	// console.log($scope.dailies.foremen_details.name.concat('str2'));
	// (dailies.foremen_details.lastname) ? $scope.dailies.foremen_details.name.concat('str2'): null;
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.ok = function () {
		$uibModalInstance.dismiss('cancel');
	};


	$(document).ready(function () {
		$(".fancybox").fancybox();
	});

	$scope.$on('mapInitialized', function (event, map) {
		window.setTimeout(function () {
			window.google.maps.event.trigger(map, 'resize');
			map.setCenter(new google.maps.LatLng(dailies.latitude, dailies.longitude));
		}, 100)
	});
	// $scope.ginit = function () {
	// 	var location = { lat: 30.6972563, lng: -88.1910169 };
	// 	var map = new google.maps.Map(document.getElementById('googleMap'), {
	// 		center: location,
	// 		zoom: 9
	// 	});
	// 	var marker = new google.maps.Marker({
	// 		position: location,
	// 		map: map
	// 	});

	// }();





















	$scope.saveViewEdit = function (dailies) {
		console.log('dailies>>>>>>>>', dailies)
		$scope.dailies = dailies;
		$scope.dailies.foremen_details.firstname = $scope.dailies.foremen_details.name.split(' ')[0]
		$scope.dailies.foremen_details.lastname = $scope.dailies.foremen_details.name.split(' ')[1]

		if (dailies.supervisor_details) {
			$scope.dailies.supervisor_details.firstname = $scope.dailies.supervisor_details.name.split(' ')[0]
			$scope.dailies.supervisor_details.lastname = $scope.dailies.supervisor_details.name.split(' ')[1]
		}

		if (dailies.crews_details) {
			$scope.dailies.crews_details.firstname = $scope.dailies.crews_details.name.split(' ')[0]
			$scope.dailies.crews_details.lastname = $scope.dailies.crews_details.name.split(' ')[1]
		}



		console.log($scope.dailies, "dailiesbillableItems")
		DailiesService.saveViewEdit().save($scope.dailies, function (response) {

			if (response.code == 200) {
				$scope.getDailiesList2()
				$scope.cancel()
				logger.logSuccess(response.message);
			} else {
				logger.logError(response.message);
			}
		});
	}




	$scope.deletedailies = function (id) {
		bootbox.confirm('Are you sure you want to delete this dailies', function (r) {

			if (r) {
				DailiesService.deleteDailies().delete({
					id: id

				}, function (response) {
					if (response.code == 200) {
						$scope.getDailiesList2()
						$scope.cancel()
						logger.logSuccess(response.message);
					} else {
						logger.logError(response.message);
					}
				});
			}
		})
	}


	$scope.downloadsinglepdf = function (id) {

			$scope.users = {};
			$scope.users._id = id;
			$scope.users.parent_id = CommonService.getUser()._id;
			DailiesService.downloadpdf().save($scope.users, function (response) {
				if (response.code == 200) {
					$scope.myDailysinglePdfLink = response.data[0];
					var path = '/' + $scope.myDailysinglePdfLink;
					setTimeout(function () {
						window.open(path)
					}, 1000);
	$scope.getDailiesList2()
				$scope.cancel()

				}
			});
		}






	$scope.getDailiesList2 = function (filterFlag) {
		console.log(filterFlag, 'sdfdsfdsf')

		$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
			counts: [],
			getData: function ($defer, params) {
				// send an ajax request to your server. in my case MyResource is a $resource.
				ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting(), filterFlag);
				$scope.paramUrl = params.url();
				$scope.paramUrl.filterFlag = filterFlag;
				console.log($scope.paramUrl)
				$scope.paramUrl.parent_id = CommonService.getUser()._id;
				$scope.tableLoader = true;
				$scope.dailiesList = [];

				DailiesService.getDailiesList().save($scope.paramUrl, function (response) {
					//$scope.paramUrlActive = paramUrl;
					$scope.tableLoader = false;
					$scope.dailiesList = response.data;
					$scope.simpleList = response.data;
					var data = response.data;
					$scope.totalLength = response.totalLength;
					params.total(response.totalLength);
					$defer.resolve(data);
					$scope.checkboxes = {
						checked: false,
						items: {}
					};
				});

			}
		});
	};






})	