// public/js/controllers/AuthController.js

app.controller('AuthController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.user = {};
    $scope.message = '';
    $scope.isLogin = true;

    $scope.toggleForm = function() {
        $scope.isLogin = !$scope.isLogin;
        $scope.message = '';
    };

    $scope.login = function() {
        AuthService.authenticate($scope.user)
            .then(function(response) {
                AuthService.setToken(response.data.token);
                AuthService.setUser(response.data.user);
                $location.path('/todos');
            })
            .catch(function(err) {
                $scope.message = err.data.msg || 'Login failed';
            });
    };

    $scope.register = function() {
        AuthService.register($scope.user)
            .then(function(response) {
                $scope.message = 'Registration successful. Please log in.';
                $scope.toggleForm();
            })
            .catch(function(err) {
                $scope.message = err.data.msg || 'Registration failed';
            });
    };
}]);
