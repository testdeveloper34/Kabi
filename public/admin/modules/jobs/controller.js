"use strict";

neoApp.controller("jobController", ['$scope', '$rootScope', '$localStorage', 'ngTableParams', '$routeParams', '$route', '$location', 'logger', 'ngTableParamsService', '$state', '$stateParams', 'JobService', 'CommonService', '$uibModal', '$filter', 'UserService', 'InvitiesService',
	function ($scope, $rootScope, $localStorage, ngTableParams, $routeParams, $route, $location, logger, ngTableParamsService, $state, $stateParams, JobService, CommonService, $uibModal, $filter, UserService, InvitiesService) {

		$scope.job = {};
		$scope.disabled = false;
		$scope.loader = false;

		$scope.JobLocation = $location.path().split('/');
		$scope.locationPath = $scope.JobLocation[1];
		$rootScope.jobID = $stateParams.id;
		$rootScope.job_ID = $stateParams.job_id;

		if ($rootScope.jobID) {
			$scope.isLinkDisabled = true;
		} else {
			$scope.isLinkDisabled = false;
		}
		//console.log($scope.locationPath);

		//$rootScope.user_level = CommonService.getUser().role.code;

		ngTableParamsService.set('', '', '', '');

		$(document).ready(function () {
			$(".fancybox").fancybox();
		});
		$scope.example1model = [];
		$scope.example1data = [{
			id: 1,
			label: "David"
		}, {
			id: 2,
			label: "Jhon"
		}, {
			id: 3,
			label: "Danny"
		}];
		$scope.getJobListAdmin = function () {
			$scope.getSupervisor();
			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.users_id = CommonService.getUser()._id;
					$scope.tableLoader = true;
					$scope.jobList = [];
					JobService.getJobListAdmin().save($scope.paramUrl, function (response) {
						//$scope.paramUrlActive = paramUrl;
						$scope.tableLoader = false;
						$scope.jobList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						$scope.totalInvities = response.totalInvities;
						params.total(response.totalLength);
						$defer.resolve(data);
						delete $rootScope.jobID
					});

				}
			});
		};

		$scope.getforemanList = function () {
			$scope.ctrl = {};
			$scope.foremenList = [];
			$scope.ctrl.parent_id = CommonService.getUser()._id;
			UserService.getForemenList().get($scope.ctrl, function (response) {
				$scope.foremenList = response.data;


			});
			//console.log('Hello', $scope.foremenList);
		}

		$scope.getInviteList = function () {
			$scope.tableParam = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.users_id = CommonService.getUser()._id;
					$scope.paramUrl.job_id = $stateParams.id;

					$scope.tableLoader = true;
					$scope.jobList = [];
					InvitiesService.getInvitiesList().save($scope.paramUrl, function (response) {

						$scope.tableLoader = false;
						$scope.invitesList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						params.total(response.totalLength);
						$defer.resolve(data);
					});

				}
			});
		}

		$scope.invitesupervisor = function (user) {
			$scope.jobinvite = {}
			$scope.jobinvite.invite_assign_by = CommonService.getUser()._id;
			$scope.jobinvite.invite_assign_to = user._id;
			$scope.jobinvite.job_id = $stateParams.id;
			var msg = 'Are you sure you want to share job ' + $stateParams.job_id + ' with ' + user.company_name + '?';
			bootbox.confirm(msg, function (r) {
				if (r) {

					JobService.InviteJob().save($scope.jobinvite, function (response) {
						$scope.disabled = false;
						$scope.loader = false;
						if (response.code == 200) {
							logger.logSuccess(response.message);
						} else {
							logger.logError(response.message);
						}
					});
				}
			})
		}


		var getData = ngTableParamsService.get();
		$scope.searchTextField = getData.searchText;
		$scope.currentuser = CommonService.getUser()._id;
		$scope.searchingContractor = function () {
			$scope.isDataLoad = true;
			ngTableParamsService.set('', '', $scope.searchTextField, '');
			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.user = $scope.currentuser
					$scope.tableLoader = true;
					$scope.usersList = [];
					UserService.getUsersList().get($scope.paramUrl, function (response) {
						$scope.tableLoader = false;
						$scope.usersList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						params.total(response.totalLength);
						$defer.resolve(data);
					});
				}
			});
		}




		var getData = ngTableParamsService.get();
		$scope.searchTextField = getData.searchText;
		$scope.searchJob = function () {
			$scope.isDataLoad = true;
			ngTableParamsService.set('', '', $scope.searchTextField, '');
			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.users_id = CommonService.getUser()._id;
					$scope.tableLoader = true;
					$scope.jobList = [];
					JobService.getJobListAdmin().save($scope.paramUrl, function (response) {
						//$scope.paramUrlActive = paramUrl;
						$scope.tableLoader = false;
						$scope.jobList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						params.total(response.totalLength);
						$defer.resolve(data);
					});
				}
			});
		}

		$scope.addUpdateGeneralData = function (form) {
			console.log(form, "formdata")
			if (form.$valid) {
				$scope.disabled = true;
				$scope.loader = true;
				$scope.job.job_added_by = CommonService.getUser()._id;
				$scope.job.latitude = angular.element("#lat").val();
				$scope.job.longitude = angular.element("#long").val();
				$scope.job.address = angular.element("#address").val();
				JobService.addUpdateGeneralData().save($scope.job, function (response) {
					$scope.disabled = false;
					$scope.loader = false;
					if (response.code == 200) {
						// $location.path("/job");	
						$location.path("/billingInfo/" + response.data._id + '/' + response.data.job_id);
						logger.logSuccess(response.message);
					} else {
						logger.logError(response.message);
					}
				});
			}
		}

		/** Getting Billable Itemes **/
		$scope.getBillableList = function () {
			JobService.listAllBillableItem().get({
				id: CommonService.getUser()._id
			}, function (response) {
				$scope.billableItemList = response.data;
				$scope.billing_info.billable_items.push(response.data[response.data.length - 1])
			});
		}

		$scope.getSupervisor = function () {
			JobService.getAllSupervisor().get({
				id: CommonService.getUser()._id
			}, function (response) {
				if (response.code == 200) {
					$scope.superVisorList = response.data;

				}
			});
		}

		$scope.addUpdateBillingInfo = function (form) {
			if (form.$valid) {
				$scope.disabled = true;
				$scope.loader = true;
				$scope.billing_info.job_id = $stateParams.id;

				JobService.addUpdateBillingInfoData().save($scope.billing_info, function (response) {
					$scope.disabled = false;
					$scope.loader = false;
					if (response.code == 200) {
						$location.path("/daily-path/" + response.data._id + '/' + response.data.job_id);
						// $location.path("/job");	
						logger.logSuccess(response.message);
					} else {
						logger.logError(response.message);
					}
				});
			}
		}


		$scope.addUpdateDailyPath = function (form) {
			if (form.$valid) {
				$scope.disabled = true;
				$scope.loader = true;
				$scope.dailypath.job_id = $stateParams.id;
				JobService.addUpdateDailyPathData().save($scope.dailypath, function (response) {
					$scope.disabled = false;
					$scope.loader = false;
					if (response.code == 200) {
						$location.path("/job");
						logger.logSuccess(response.message);
					} else {
						logger.logError(response.message);
					}
				});
			}
		}

		$scope.findOneJobInfo = function () {
			$scope.isDisabled = false;
			if ($stateParams.id) {
				JobService.getJobInfoById().get({
					id: $stateParams.id
				}, function (response) {
					if (response.code == 200) {
						$scope.job = response.data.job_details;
						if (response.data.job_details.start_date) {
							$scope.job.start_date = new Date(response.data.job_details.start_date);
						}
						if (response.data.job_details.projected_end_date) {
							$scope.job.projected_end_date = new Date(response.data.job_details.projected_end_date);
						}
						if (response.data.job_details.actual_end_date) {
							$scope.job.actual_end_date = new Date(response.data.job_details.actual_end_date);
						}
						$scope.billing_info = response.data.job_details.billing_info;
						$scope.dailypath = response.data.job_details;
						$scope.isDisabled = true;

					}
				});
			}
		}
		$scope.findOneSupervisorJobInfo = function () {
			if ($stateParams.id) {
				var arr = [];
				JobService.getSupervisorJobInfoById().get({
					id: $stateParams.id
				}, function (response) {
					if (response.code == 200) {
						$scope.dailypath = response.data;
						//$scope.dailys = ["59b76427f16cb30edcd9d68e","59b7abc67e27dd111e71b37f"];
						//arr.push()

					}
				});
			}
		}


		if ($state.current.name == "daily-path") {

			$scope.findOneSupervisorJobInfo();
		}


		$scope.viewJob = function (job, status) {

			job.superDropOpt = status;
			job.supervisor = $scope.superVisorList;

			JobService.getInvite_Supervisor_Id().save({
				job_id: job._id
			}, function (response) {
				if (response.data) {
					job.assign_super = response.data.job_assign_to;
				}

				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: '/admin/modules/jobs/views/viewJob.html',
					controller: 'jobDetail',
					windowClass: 'zindex',
					// size: size,
					resolve: {
						job: job
					}
				});

			});
		}


		$scope.today = function () {
			// $scope.job.start_date = new Date();
			// $scope.job.projected_end_date = new Date();
			// $scope.job.actual_end_date = new Date();
		};
		$scope.today();

		$scope.clear = function () {
			$scope.job.start_date = null;
			$scope.job.projected_end_date = null;
			$scope.job.actual_end_date = null;
		};

		/*$scope.dateOptions = {
		  minDate: new Date()
		};*/

		// Disable weekend selection

		$scope.startDate = function () {
			$scope.start_date.opened = true;
		};

		$scope.projectedEndDate = function () {
			$scope.projected_end_date.opened = true;
		};
		$scope.actualEndDate = function () {
			$scope.actual_end_date.opened = true;
		};

		$scope.setDate = function (year, month, day) {
			//$scope.job.start_date = new Date(year, month, day);
			//$scope.job.projected_end_date = new Date(year, month, day);
			//$scope.job.actual_end_date = new Date(year, month, day);
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.altInputFormats = ['M!/d!/yyyy'];

		$scope.start_date = {
			opened: false
		};

		$scope.projected_end_date = {
			opened: false
		};

		$scope.actual_end_date = {
			opened: false
		};

		$scope.addNew = false;
		$scope.addNewbillable = function () {
			$scope.addNew = true;
		};

		$scope.addBillableItem = function (form) {
			if (form.$valid) {
				//console.log($scope.item); return false;
				if ($scope.item.popup_flag == true) {
					$scope.disabled = true;
					$scope.loader = true;
					$scope.item.user_id = CommonService.getUser()._id;

					JobService.addBillableItem().save($scope.item, function (response) {
						$scope.disabled = false;
						$scope.loader = false;
						if (response.code == 200) {
							$location.path("/billableItems");
							logger.logSuccess(response.message);
						} else {
							logger.logError(response.message);
						}
					});
				} else {
					bootbox.dialog({
						message: "Are you sure you want to update the billable item name? This will change the item name in every job and daily it's connected to.",
						buttons: {
							ok: {
								label: "Yes",
								className: 'btn-info',
								callback: function () {
									$scope.disabled = true;
									$scope.loader = true;
									$scope.item.user_id = CommonService.getUser()._id;

									JobService.addBillableItem().save($scope.item, function (response) {
										$scope.disabled = false;
										$scope.loader = false;
										if (response.code == 200) {
											$location.path("/billableItems");
											logger.logSuccess(response.message);
										} else {
											logger.logError(response.message);
										}
									});
								}
							},
							cancel: {
								label: "No",
								className: 'btn-danger',
								callback: function () {

								}
							},
							noclose: {
								label: "Don't ask me",
								className: 'btn-warning',
								callback: function () {
									$scope.disabled = true;
									$scope.loader = true;
									$scope.item.user_id = CommonService.getUser()._id;
									$scope.item.popup_flag = true;

									JobService.addBillableItem().save($scope.item, function (response) {
										$scope.disabled = false;
										$scope.loader = false;
										if (response.code == 200) {
											$location.path("/billableItems");
											logger.logSuccess(response.message);
										} else {
											logger.logError(response.message);
										}
									});
								}
							}

						}
					});
				}


			}
		}

			$scope.addItem = function (form) {
			console.log('IRM', form)
			if (form) {
				$scope.disabled = true;
				$scope.loader = true;
				form.user_id = CommonService.getUser()._id;
				JobService.addBillableItem().save(form, function (response) {
					$scope.disabled = false;
					$scope.loader = false;
					if (response.code == 200) {
						$scope.getBillableList();
						$scope.addNew = false;
						logger.logSuccess(response.message);


						$scope.billing_info.billable_items = [{"_id":response._id,"name":form.name}];
					
					
					} else {
						logger.logError(response.message);
					}
				});
				//$scope.billing_info.billable_items = form
			}
		}

		$scope.getBillableItemList = function () {
			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.users_id = CommonService.getUser()._id;
					$scope.tableLoader = true;
					$scope.billableList = [];
					JobService.getbillableList().save($scope.paramUrl, function (response) {
						// $scope.paramUrlActive = paramUrl;
						$scope.tableLoader = false;
						$scope.billableList = response.data;
						var data = response.data;
						$scope.totalLength = response.totalLength;
						params.total(response.totalLength);
						$defer.resolve(data);
					});

				}
			});
		}

		$scope.findOneItemInfo = function () {
			if ($stateParams.id) {
				JobService.getItemInfoById().get({
					id: $stateParams.id
				}, function (response) {
					if (response.code == 200) {
						$scope.item = response.data;
						$scope.item.old_name = response.data.name;
					}
				});
			}
		}

		$scope.deleteItem = function (id) {
			bootbox.confirm('Are you sure you want to delete this item', function (r) {
				if (r) {
					JobService.deleteItem().delete({
						id: id
					}, function (response) {
						if (response.code == 200) {
							$scope.getBillableItemList();
							logger.logSuccess(response.message);
						} else {
							logger.logError(response.message);
						}
					});
				}
			})
		}

		$scope.deleteJob = function (id) {
			bootbox.confirm('Are you sure you want to delete this item', function (r) {
				if (r) {
					JobService.deleteJob().delete({
						id: id
					}, function (response) {
						if (response.code == 200) {
							$scope.getJobListAdmin();
							logger.logSuccess(response.message);
						} else {
							logger.logError(response.message);
						}
					});
				}
			})
		}

		$scope.func = function (data) {
			// console.log('$event', data)
			// $scope.some = data[0].name
		}

		$scope.func2 = function (data) {
			console.log('$event', data)

			$scope.some = data
		}
		var getData = ngTableParamsService.get();
		$scope.searchTextField = getData.searchText;
		$scope.searchingItem = function () {
			ngTableParamsService.set('', '', $scope.searchTextField, '');
			$scope.tableParams = new ngTableParams(ngTableParamsService.get(), {
				counts: [],
				getData: function ($defer, params) {
					// send an ajax request to your server. in my case MyResource is a $resource.
					ngTableParamsService.set(params.page(), params.count(), $scope.searchTextField, params.sorting());
					$scope.paramUrl = params.url();
					$scope.paramUrl.users_id = CommonService.getUser()._id;
					$scope.tableLoader = true;
					$scope.usersList = [];
					JobService.getbillableList().save($scope.paramUrl, function (response) {
						$scope.tableLoader = false;
						// $scope.paramUrlActive = paramUrl;
						$scope.billableList = response.data;
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

neoApp.controller('jobDetail', function ($scope, $uibModalInstance, $location, logger, job, JobService) {

	$scope.job = job;


	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.ok = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.accept = function (jobID, assignID) {
		$scope.params = {}
		$scope.params.job_id = jobID;
		$scope.params.job_assign_to = assignID;

		JobService.shareJobAcceptence().save($scope.params, function (response) {
			if (response.code == 200) {
				logger.logSuccess(response.message);
				$location.path("/job");
				$uibModalInstance.dismiss('cancel');

			} else {
				logger.logError(response.message);
				$uibModalInstance.dismiss('cancel');
			}
		});

	}

	$(document).ready(function () {
		$(".fancybox").fancybox();
	});

})