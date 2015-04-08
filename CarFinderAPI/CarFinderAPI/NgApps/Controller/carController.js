angular.module('carFinderApp')
    .controller('carFinderController', ['$scope', 'carSvc', function ($scope, carSvc) {
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

        $scope.getYears = function () {
            carSvc.getYears().then(function (data) {
                $scope.years = data;
            });
        };

        $scope.getMakes = function () {
            carSvc.getMakes($scope.selectedYear).then(function (data) {
                $scope.makes = data;
                $scope.getCars();
            });
        };


        $scope.getModels = function () {
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

    }]);