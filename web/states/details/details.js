/* global angular, _, Modernizr, $ */
angular.module('ua5App.details', ['ngFileUpload', 'color.picker'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('projects.details', {
            name: 'Details',
            url: '/{projectId}',
            templateUrl: 'states/details/details.html',
            controller: 'detailsCtrl',
            controllerAs: 'ctrl',
            data: {
                settings:{displayName:'First Project'}
            }
        });
    }])
    .controller('detailsCtrl', ['$scope', '$stateParams', 'screenFactory', 'ModalService', function($scope, $stateParams, screenFactory, ModalService) {
        $scope.screens = [];
        $scope.currentSceneScreens = [];
        $scope.currentScene = 1;
        $scope.scenes = 1;
        $scope.emptyScene = false;
        $scope.hasTouch = Modernizr.touch;
        $scope.showSceneList = false;
        $scope.$watch('files', function() {
            if (
                typeof $scope.files === 'object' &&
                $scope.files.length > 0 &&
                typeof $scope.files[0] === 'object'
            ) {
                uploadScreens($scope.files);
            }
        });
        $scope.$watch('file', function() {
            if ($scope.file !== null) {
                $scope.files = [$scope.file];
            }
        });
        $scope.log = '';
        $scope.projectId = $stateParams.projectId;
        $scope.colorOptions = {
            format: 'hex',
            alpha: false,
            swatchPos: 'right'
        };

        $scope.deleteScreen = function(screenId) {
            ModalService.showModal({
                templateUrl: 'modals/deleteModal.html',
                controller: 'deleteModalController',
                inputs: {
                    fields:{
                        title: 'Delete Screen',
                        confirmText: 'Are you sure you would like to delete this screen?',
                        submitButtonText: 'Delete'
                    }
                }
            }).then(function(modal) {
                modal.close.then(function(result) {
                    if (result) {
                        screenFactory.deleteScreen(screenId)

                        .then(function(response) {
                                getScreens();
                            }, function(error) {
                                $scope.status = 'Unable to delete screen: ' + error.message;
                            });
                    }
                });
            });
        };

        $scope.linkContent = function(content) {
            ModalService.showModal({
                templateUrl: 'modals/linkModal.html',
                controller: 'linkModalController',
                inputs: {
                    fields:{
                        title: 'Link Panel',
                        formLabels:[{name: 'name', title: 'Name'}, {name:'description', title: 'Description'}],
                        showFileUpload: false,
                        submitButtonTextLink: 'Link',
                        submitButtonTextCancel: 'Cancel',
                        scenes: $scope.scenes,
                        content: content,
                        allScreens: $scope.screens
                    }
                }
            }).then(function(modal) {
            });
        };

        function uploadScreens(files) {
            var lastItemOrder = 0;
            if ($scope.currentSceneScreens.length > 0) {
                lastItemOrder = _.last($scope.currentSceneScreens).order + 1;
            }
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    screenFactory.insertScreen(
                        file,
                        $stateParams.projectId,
                        $scope.currentScene,
                        lastItemOrder + i
                    )
                        .then(function(response) {
                                $scope.status = 'Success';
                                getScreens();
                            }, function(error) {
                                $scope.status = 'Unable to insert screen: ' + error.message;
                            });
                }
            }
        }

        window.addEventListener('dragover', function(e) {
            e = e || event;
            e.preventDefault();
        }, false);

        window.addEventListener('drop', function(e) {
            e = e || event;
            e.preventDefault();
        }, false);

        function getScreens() {
            screenFactory.getScreens($stateParams.projectId)

                .then(function(response) {
                    $scope.screens = response.data.content;
                    $scope.screens = _.sortBy($scope.screens, 'order');
                    $scope.currentSceneScreens = _.where($scope.screens, {tag: $scope.currentScene.toString()});
                    _.each($scope.screens, function(screen) {
                        screen.screenName = screen.url.split('https://verygd.imgix.net/images/').join('');
                        if (parseInt(screen.tag, 10) > $scope.scenes) {
                            $scope.scenes = parseInt(screen.tag, 10);
                        }
                    });
                    $scope.emptyScene = $scope.currentSceneScreens.length > 0 ? false : true;
                }, function(error) {
                    $scope.status = 'Unable to load screen data: ' + error.message;
                });
        }

        $scope.changeScene = function(scenekey, sceneName) {
            var scenes;
            $scope.currentScene = scenekey;
            scenes = _.where($scope.screens, {tag: scenekey.toString()});
            $scope.currentSceneScreens = _.sortBy(scenes, 'order');
            $scope.showSceneList = false;
            $scope.emptyScene = $scope.currentSceneScreens.length > 0 ? false : true;

        };

        $scope.addScene = function() {
            ModalService.showModal({
                templateUrl: 'modals/addSceneModal.html',
                controller: 'addSceneModalController',
                inputs: {
                    fields:{
                        title: 'Add New Scene',
                        formLabels:[{name: 'name', title: 'Name'}],
                        showFileUpload: false,
                        submitButtonTextLink: 'Save',
                        submitButtonTextCancel: 'Cancel',
                        scenes: $scope.scenes
                    }
                }
            }).then(function(modal) {

            });
        };

        $scope.toggleSceneList = function() {
            $scope.showSceneList = !$scope.showSceneList;
        };

        $scope.getScene = function(num) {
            return new Array(num);
        };

        $scope.$on('modal:add-scene', function(event, args) {
            $scope.sceneName = args.name;
            $scope.scenes++;
            $scope.changeScene($scope.scenes, $scope.sceneName);
        });

        $scope.$on('nav:add-scene', function() {
            $scope.addScene();
        });

        $scope.dragControlListeners = {
            orderChanged: function(event) {
                _.each($scope.currentSceneScreens, function(screen, key) {
                    screenFactory.editScreen(screen.id, {order: key + 1});
                    //update the order in the view also:
                    screen.order = key + 1;
                });
            }
        };

        $scope.$on('nav:add-screen', function() {
            //Todo make this more angular friendly
            $('#uploadInput').click();
        });

        getScreens();
    }])
;
