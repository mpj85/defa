'use strict';

angular.module('roadModule', [])
.factory('roadFactory', ['$rootScope', function($rootScope) {

    const roads = [
          "Alice's House-Bob's House",   "Alice's House-Cabin",
          "Alice's House-Post Office",   "Bob's House-Town Hall",
          "Daria's House-Ernie's House", "Daria's House-Town Hall",
          "Ernie's House-Grete's House", "Grete's House-Farm",
          "Grete's House-Shop",          "Marketplace-Farm",
          "Marketplace-Post Office",     "Marketplace-Shop",
          "Marketplace-Town Hall",       "Shop-Town Hall"];

    var service = {
        calculatedPath: [],
        toLocation: null,
        destinationFound: false
    };

    service.calculateRoad = function(fromLocation, toLocation){
        service.resetData();
        service.addToNextMoveCalculatedPath(fromLocation);
        service.toLocation = toLocation;
        service.moveOneForward(fromLocation);

    }

    service.moveOneForward = function(){
        if(service.destinationFound){
            return;
        }
        var movefrom = service.calculatedPath[service.calculatedPath.length - 1];
        var nextSteps = service.findAllPossibleNextStep(movefrom);
        var indexOfFinalLocation = nextSteps.findIndex(function(element) {
                                                            return element == service.toLocation;
                                                        });

        if(indexOfFinalLocation > 0 ){
            service.checkIfNextIsFinalLocation(nextSteps[indexOfFinalLocation]);
        } else {
            for(var i = 0; i < nextSteps.length; i++){
                service.addToPathIfValidMoveAndMoveForward(nextSteps[i]);
            }
        }
    }

    service.findAllPossibleNextStep = function(currentLocation){
        var possibleWays = [];
        for(var i = 0; i < roads.length; i++){
            if(roads[i].indexOf(currentLocation) >= 0){
                var nextMove = service.findPossibleNextMove(currentLocation, roads[i]);;
                if(nextMove != null && service.nextMoveIsCabin(nextMove)){ //Dont add cabin, otherwise it will cause a deadlock
                    service.checkIfNextIsFinalLocation(nextMove);
                } else if(nextMove != null){
                    possibleWays.push(nextMove);
                }
            }
        }
        return possibleWays;
    }

    service.findPossibleNextMove = function(currentLocation, roadCross){
        if(!currentLocation || !roadCross){
            return null;
        }
        var nextMove = null;
        var splittedString = roadCross.split('-');
        if(currentLocation === splittedString[0]){
            nextMove = splittedString[1];
        } else if(currentLocation === splittedString[1]){
            nextMove = splittedString[0];
        }
        var locationIsVisited = service.isLocationVisited(nextMove);
        if(locationIsVisited){
            nextMove = null;
        }
        return nextMove
    }

    service.nextMoveIsCabin = function(nextMove){
        return nextMove == 'Cabin';
    }

    service.checkIfNextIsFinalLocation = function(nextMove){
        if(service.toLocation === nextMove){
            service.addToNextMoveCalculatedPath(nextMove);
            service.destinationFound = true;
            $rootScope.$broadcast("PATH_CALCULATED");
        }
    }

    service.addToPathIfValidMoveAndMoveForward = function(nextMove){
        service.checkIfNextIsFinalLocation(nextMove);
        if(!service.destinationFound){
            var locationIsVisited = service.isLocationVisited(nextMove);
            if(!locationIsVisited){
                service.addToNextMoveCalculatedPath(nextMove);
                service.moveOneForward();
            }
        }
    }

    service.isLocationVisited = function(nextMove){
        var locationVisited = false;
        for(var i = 0; i < service.calculatedPath.length; i++){
            if(service.calculatedPath[i] === nextMove){
                locationVisited = true;
                break;
            }
        }
        return locationVisited;
    }

    service.addToNextMoveCalculatedPath = function(nextMove){
        if(nextMove && nextMove != null){
            service.calculatedPath.push(nextMove);
        }
    }

    service.resetData = function(){
        service.calculatedPath = [];
        service.toLocation = "";
        service.destinationFound = false;
    }
    return service


}]);

