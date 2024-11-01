// public/js/services/AuthService.js

app.factory('AuthService', ['$http', '$window', function($http, $window) {
    var auth = {};

    auth.register = function(user) {
        return $http.post('/users/register', user);
    };

    auth.authenticate = function(user) {
        return $http.post('/users/authenticate', user);
    };

    auth.setToken = function(token) {
        $window.localStorage['jwtToken'] = token;
    };

    auth.getToken = function() {
        return $window.localStorage['jwtToken'];
    };

    auth.setUser = function(user) {
        $window.localStorage['user'] = JSON.stringify(user);
    };

    auth.getUser = function() {
        return JSON.parse($window.localStorage['user'] || '{}');
    };

    auth.isLoggedIn = function() {
        return !!auth.getToken();
    };

    auth.logout = function() {
        $window.localStorage.removeItem('jwtToken');
        $window.localStorage.removeItem('user');
    };

    return auth;
}]);
