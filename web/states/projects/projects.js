/* global angular, _ */
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
    .controller('projectsCtrl', ['$scope', '$state', 'projectFactory', 'ModalService', function($scope, $state, projectFactory, ModalService) {
        var addProject = function(project) {
            projectFactory.addProject(project)

            .then(function(response) {
                var id = response.data.id;
                $state.go('projects.details', {projectId:id});
                getProjects();
            }, function(error) {

            });
        };
        $scope.title = 'projects';

        $scope.newProject = {};

        $scope.$on('addProject', function(event, args) {
            addProject(args);
        });

        $scope.deleteProject = function(projectId) {
            ModalService.showModal({
                templateUrl: 'modals/deleteModal.html',
                controller: 'deleteModalController',
                inputs: {
                    fields:{
                        title: 'Delete Project',
                        confirmText: 'Are you sure you would like to delete this project? Deleting will remove all content and scenes.',
                        submitButtonText: 'Delete'
                    }
                }
            }).then(function(modal) {
                modal.close.then(function(result) {
                    if (result) {
                        projectFactory.deleteScreen(projectId)

                            .then(function(response) {
                                    getProjects();
                                }, function(error) {
                                    $scope.status = 'Unable to delete project: ' + error.message;
                                });
                    }

                });
            });

        };

        function getProjects() {
            projectFactory.getProjects()

                .then(function(response) {
                    $scope.projects = response.data;
                    _.each($scope.projects, function(project) {
                        var scenes = project.content;
                        var sceneImage = '';

                        scenes = _.sortBy(scenes, 'order');
                        sceneImage = scenes[0].content.length > 0 ? scenes[0].content[0].url : '/assets/img/image-placeholder.jpg';

                        project.cover_image = sceneImage + '?fm=jpg&q=60&h=800&w=800&fit=max&bg=000000';
                    });
                }, function(error) {

                });
        }

        getProjects();
    }]);
