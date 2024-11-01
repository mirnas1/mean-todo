var app = angular.module('todoApp', ['ngRoute', 'dndLists']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'auth.html',
            controller: 'AuthController'
        })
        .when('/todos', {
            templateUrl: 'todos.html',
            controller: 'TodoController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
