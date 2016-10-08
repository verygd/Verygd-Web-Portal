/* global angular */
angular.module('ua5App.home')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'states/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'ctrl',
            resolve: {
                page: ['$http', function($http) {
                    return $http.get('data/login.json');
                }],
                user: ['APICONSTANTS', '$cookies', function(APICONSTANTS, $cookies) {
                    var userId = $cookies.get(APICONSTANTS.authCookie.user_id),
                    token = $cookies.get(APICONSTANTS.authCookie.user_id);

                    if (userId && token) {
                        return true;
                    } else {
                        return false;
                    }
                }]
            }
        });
    }])
    .controller('HomeCtrl', ['$scope', 'user', 'page', 'AuthResource', '$state', 'APICONSTANTS', '$cookies', 'ModalService', '$rootScope', '$http', function($scope, user, page, AuthResource, $state, APICONSTANTS, $cookies, ModalService, $rootScope, $http) {
        $scope.page = page.data;
        if (user) {
            $state.go('projects');
        }

        $scope.login = function(data) {
            if (!data && (!data.email || !data.password)) {
                return false;
            }

            AuthResource.token().retrieve({username: data.email, password: data.password}).$promise.then(
                function(response) {
                    //base expiration of cookies based on whether 'remember me' option was checked
                    var todayDate = new Date();
                    var expireDate = new Date();

                    //set cookies
                    if ($scope.cookieExpireDate) {
                        expireDate.setDate(todayDate.getDate() + 365);
                        $cookies.put(APICONSTANTS.authCookie.token, response.token, {expires: expireDate});
                        $cookies.put(APICONSTANTS.authCookie.user_id, response.member_id, {expires: expireDate});
                    } else {
                        expireDate.setDate(todayDate.getDate() + 1);
                        $cookies.put(APICONSTANTS.authCookie.token, response.token, {expires: expireDate});
                        $cookies.put(APICONSTANTS.authCookie.user_id, response.member_id, {expires: expireDate});
                    }

                    $http.defaults.headers.common['Authorization'] = 'Token ' + APICONSTANTS.authCookie.token; // jshint ignore:line

                    $state.go('projects');
                },
                function(error) {
                    $scope.loginError = true;
                }
            );
        };

        $scope.showModal = function() {
            ModalService.showModal({
                templateUrl: 'modals/signInModal.html',
                controller: 'signInModalController',
                inputs: {
                    fields:{
                        title: 'sduhk'
                    }
                }}).then(function(modal) {
                modal.close.then(function(result) {
                    if (result.input) {
                        $scope.$emit('addProject', result.input);
                        $scope.menuToggle = false;
                    }
                });
            });
        };
    }])
;
