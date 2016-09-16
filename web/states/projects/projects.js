/* global angular */
angular.module('ua5App.projects')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('projects', {
            name:'Projects',
            url: '/projects',
            templateUrl: 'states/projects/projects.html',
            controller: 'projectsCtrl',
            controllerAs: 'ctrl',
            data: {
                settings:{displayName:'My Projects'}
            }
        });
    }])
    .controller('projectsCtrl', ['$scope', 'projectFactory', function($scope, projectFactory) {
        $scope.newProject = {};

        $scope.addProject = function() {
            projectFactory.addProject($scope.newProject)

            .then(function(response) {
                getProjects();
            }, function(error) {
                  
            });
        };

        function getProjects() {
            projectFactory.getProjects()

                .then(function(response) {
                    $scope.projects = response.data;
                    
                }, function(error) {
                    
                });
        }

        getProjects();
    }]);
