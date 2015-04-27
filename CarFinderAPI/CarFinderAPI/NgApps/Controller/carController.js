﻿angular.module('carFinderApp')
    .controller('carFinderController', ['$scope', 'carSvc', '$modal', 'uiGridConstants', function ($scope, carSvc, $modal, uiGridConstants, $log) {
        //var $scope = this;
        $scope.selectedYear = '';
        $scope.years = [];
        $scope.selectedMake = '';
        $scope.makes = [];
        $scope.selectedModel = '';
        $scope.models = [];
        $scope.selectedTrim = '';
        $scope.trims = [];
        $scope.selectedCar = '';
        $scope.cars = [];


        $scope.myData = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enablesorting: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,

            columnDefs: [
                { field: 'year' },
                { field: 'make' },
                { field: 'model' },
                { field: 'trim' },
                {
                    name: 'Action',
                    cellTemplate: '<button class="btn btn-xs btn primary" ng-click="getExternalScopes().open(row.entity.id)">Veiw</button>'
                }

            ],
            data: 'cars',
            externalScope: 'cars.gridFunctions'
        };


        $scope.gridFunctions = {
            open: function (id) {
                var modalInstace = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    resolve: {
                        car: function () {
                            return carSvc.getCar(id);
                        }
                    }
                })
            }
        }

        $scope.getYears = function () {

            carSvc.getYears().then(function (data) {
                $scope.years = data;
             

            });

           
        };


        $scope.getMakes = function () {
            $scope.selectedMake = '';
            $scope.makes = [];
            $scope.selectedModel = '';
            $scope.models = [];
            $scope.selectedTrim = '';
            $scope.trims = [];

            carSvc.getMakes($scope.selectedYear).then(function (data) {
                $scope.makes = data;
                $scope.getCars();
            });
        };


        $scope.getModels = function () {
            $scope.selectedModel = '';
            $scope.models = [];
            $scope.selectedTrim = '';
            $scope.trims = [];
 
            carSvc.getModels($scope.selectedYear, $scope.selectedMake).then(function (data) {
                $scope.models = data;
                $scope.getCars();
            });
        };

        $scope.getTrims = function () {
   
            carSvc.getTrims($scope.selectedYear, $scope.selectedMake, $scope.selectedModel).then(function (data) {
                $scope.trims = data;
                $scope.getCars();
            });
        };

        $scope.getCars = function () {
            carSvc.getCars($scope.selectedYear, $scope.selectedMake, $scope.selectedModel, $scope.selectedTrim).then(function (data) { $scope.cars = data; });
        };

        //get rolling
        $scope.getYears();

       

        $scope.open = function (id) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    car: function () {
                        return carSvc.getCar(id);
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }

    }]);


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('carFinderApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, car) {

    $scope.car = car;

    $scope.arrayRecall = car.RecallData.Results;

    $scope.current = 0;

    $scope.count = car.RecallData.Count;

    $scope.previous = function () {
        if ($scope.current && $scope.count > 1) {
            $scope.current = $scope.current - 1;
        }
    }

    $scope.next = function () {
        if ($scope.current < $scope.count - 1) {
            $scope.current = $scope.current + 1;
        }
    }


    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


});

