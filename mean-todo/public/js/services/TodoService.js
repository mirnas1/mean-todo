// public/js/services/TodoService.js

app.factory('TodoService', ['$http', 'AuthService', function($http, AuthService) {
    var service = {};

    service.getTodos = function() {
        return $http.get('/todos', {
            headers: { 'Authorization': AuthService.getToken() }
        });
    };

    service.addTodo = function(todo) {
        return $http.post('/todos', todo, {
            headers: { 'Authorization': AuthService.getToken() }
        });
    };

    service.updateTodo = function(todo) {
        return $http.put('/todos/' + todo._id, todo, {
            headers: { 'Authorization': AuthService.getToken() }
        });
    };

    service.deleteTodo = function(id) {
        return $http.delete('/todos/' + id, {
            headers: { 'Authorization': AuthService.getToken() }
        });
    };

    // Batch update function
    service.updateTodosOrder = function(todos) {
        return $http.put('/todos/order', { todos: todos }, {
            headers: { 'Authorization': AuthService.getToken() }
        });
    };

    return service;
}]);
