// public/js/controllers/TodoController.js

app.controller('TodoController', ['$scope', '$location', 'AuthService', 'TodoService', function($scope, $location, AuthService, TodoService) {
    $scope.todos = [];
    $scope.todoText = '';
    $scope.completedCount = 0;
    $scope.username = AuthService.getUser().username || AuthService.getUser().email;

    // Redirect to login if not authenticated
    if (!AuthService.isLoggedIn()) {
        $location.path('/');
    } else {
        loadTodos();
    }

    function loadTodos() {
        TodoService.getTodos()
            .then(function(response) {
                $scope.todos = response.data;
                // Sort todos based on 'order' field
                $scope.todos.sort((a, b) => a.order - b.order);
                updateCompletedCount();
            })
            .catch(function(err) {
                console.error(err);
            });
    }

    $scope.addTodo = function() {
        if ($scope.todoText.trim() === '') return;
        var newTodo = {
            todo: $scope.todoText.trim(),
            priority: 'white',
            order: Date.now()
        };
        TodoService.addTodo(newTodo)
            .then(function(response) {
                $scope.todos.push(response.data);
                $scope.todoText = '';
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    $scope.toggleComplete = function(todo) {
        todo.is_completed = !todo.is_completed;
        TodoService.updateTodo(todo)
            .then(function(response) {
                updateCompletedCount();
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    $scope.deleteTodo = function(todo) {
        TodoService.deleteTodo(todo._id)
            .then(function(response) {
                var index = $scope.todos.indexOf(todo);
                if (index > -1) {
                    $scope.todos.splice(index, 1);
                }
                updateCompletedCount();
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    $scope.clearCompleted = function() {
        var completedTodos = $scope.todos.filter(function(todo) {
            return todo.is_completed;
        });
        completedTodos.forEach(function(todo) {
            $scope.deleteTodo(todo);
        });
    };

    $scope.logout = function() {
        AuthService.logout();
        $location.path('/');
    };

    // Toggle Options Menu
    $scope.toggleOptions = function(todo) {
        // Close other options menus
        $scope.todos.forEach(function(t) {
            if (t !== todo) {
                t.showOptions = false;
                t.showPriorityOptions = false;
            }
        });
        todo.showOptions = !todo.showOptions;
        console.log('Options for todo:', todo.todo, 'showOptions:', todo.showOptions);
    };

    // Set Priority
    $scope.setPriority = function(todo, color) {
        todo.priority = color;
        TodoService.updateTodo(todo)
            .then(function(response) {
                console.log('Priority updated successfully');
            })
            .catch(function(err) {
                console.error('Error updating priority:', err);
            });
        // Close both options and priority options menus
        todo.showOptions = false;
        todo.showPriorityOptions = false;
    };

    // Edit Todo
    $scope.editTodo = function(todo) {
        var newTodoText = prompt("Edit your task:", todo.todo);
        if (newTodoText !== null && newTodoText.trim() !== "") {
            todo.todo = newTodoText.trim();
            TodoService.updateTodo(todo)
                .then(function(response) {
                    // Update successful
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
        todo.showOptions = false;
    };

    function updateCompletedCount() {
        $scope.completedCount = $scope.todos.filter(function(todo) {
            return todo.is_completed;
        }).length;
    }

    // Watch for changes in todos to update the backend
    $scope.$watch('todos', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            // Extract todos with their new order
            var updatedTodos = newVal.map(function(todo, index) {
                return {
                    _id: todo._id,
                    order: index
                };
            });

            // Send batch update to backend
            TodoService.updateTodosOrder(updatedTodos)
                .then(function(response) {
                    console.log('Todos order updated successfully');
                })
                .catch(function(err) {
                    console.error('Error updating todos order:', err);
                });
        }
    }, true);
}]);
