function numbersCtrl() {
    var scope = this;

    scope.numbers = [1, 2, 3, 4, 5];
    scope.current = 0;

    scope.pickRandom = function () {
        scope.current = Math.floor((Math.random() * 5) + 1);
    }
}

angular.module('app').controller('numbersCtrl', numbersCtrl);
