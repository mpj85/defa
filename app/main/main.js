'use strict';

angular.module('mainModule', ['roadModule'])
.controller('mainController', ['$scope', '$timeout', 'roadFactory', function($scope, $timeout, roadFactory) {

    $scope.listplaces = [ "Alice's House", "Bob's House", "Cabin", "Daria's House",  "Ernie's House", "Farm",
                        "Grete's House", "Marketplace", "Post Office", "Shop", "Town Hall" ];

    $scope.selectedFrom = null;
    $scope.selectedTo = null;
    $scope.calculatedRoad = null;
    $scope.selectedFromText = null;
    $scope.selectedToText = null;

    $scope.$on("PATH_CALCULATED", function(){
        $scope.calculatedRoad = roadFactory.calculatedPath;
        $scope.selectedFrom = null;
        $scope.selectedTo = null;
    })

    $scope.resetData = function(){
        $scope.resetCalculatedRoad();
        $scope.selectedFrom = null;
        $scope.selectedTo = null;
        $scope.selectedFromText = null;
        $scope.selectedToText = null;
    }

    $scope.resetCalculatedRoad = function(){
        $scope.calculatedRoad = null;
    }

    $scope.setSelectedFrom = function(){
        var fromToIsEqual = $scope.locationFromToIsEqual();
        if(fromToIsEqual){
            $scope.selectedFrom = null;
            $scope.showErrorForFiveSeconds();
        } else {
            $scope.calculateRoadIfPossible();
        }
    }

    $scope.setSelectedTo = function(){
        var toFromIsEqual = $scope.locationFromToIsEqual();
        if(toFromIsEqual){
            $scope.selectedTo = null;
            $scope.showErrorForFiveSeconds();
        } else {
            $scope.calculateRoadIfPossible();
        }
    }

    $scope.calculateRoadIfPossible = function(){
        if($scope.selectedFrom && $scope.selectedFrom != null && $scope.selectedTo && $scope.selectedTo != null){
            $scope.showError = false;
            $scope.setRouteText();
            $scope.resetCalculatedRoad();
            roadFactory.calculateRoad($scope.selectedFrom, $scope.selectedTo);
        }
    }

    $scope.locationFromToIsEqual = function(){
        var isEqual = false;
        if($scope.selectedFrom && $scope.selectedFrom != null && $scope.selectedTo && $scope.selectedTo != null){
            if($scope.selectedFrom === $scope.selectedTo){
                isEqual = true;
           }
        }
        return isEqual;
    }

    $scope.setRouteText = function(){
        $scope.selectedFromText = $scope.selectedFrom;
        $scope.selectedToText = $scope.selectedTo;
    }

    $scope.showErrorForFiveSeconds = function(){
        $scope.showError = true;
        $timeout(function(){
            $scope.showError = false;
        }, 5000)
    }
}]);


