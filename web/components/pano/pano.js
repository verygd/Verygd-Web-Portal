/* global angular, THREE, $ */
angular.module('ua5App')
    .directive('pano', ['$rootScope', 'BaseThreeScene', function($rootScope, BaseThreeScene) {
        return {
            restrict: 'A',
            templateUrl: 'components/pano/pano.html',
            scope: {
                useVr: '='
            },
            link: function($scope, element, attrs) {
                var scene = new BaseThreeScene();
                var $$el = $('.my-canvas');
                var panels = [
                    //front
                    {
                        rotation: {
                            x: 0,
                            y: -Math.PI / 2,
                            z: 0
                        },
                        position: {
                            x: 45,
                            y: 15,
                            z: 0
                        },
                        file: 0
                    },
                    //back
                    {
                        rotation: {
                            x: 0,
                            y: 100,
                            z: 0
                        },
                        position: {
                            x: -50,
                            y: 15,
                            z: 25
                        },
                        file: 2
                    },
                    //right
                    {
                        rotation: {
                            x: 0,
                            y: 60,
                            z: 0
                        },
                        position: {
                            x: 0,
                            y: 15,
                            z: 45
                        },
                        file: 1
                    },
                    //left
                    {
                        rotation: {
                            x: 0,
                            y: 50,
                            z: 0
                        },
                        position: {
                            x: 0,
                            y: 15,
                            z: -45
                        },
                        file: 3
                    },
                    {
                        rotation: {
                            x: 0,
                            y: 70,
                            z: 0
                        },
                        position: {
                            x: -54,
                            y: 15,
                            z: -20
                        },
                        file: 4
                    }
                ];
                var useVr = $scope.useVr;

                $scope.$watch(function() {
                    return $scope.useVr;
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scene.destroy();
                        useVr = newValue;
                        scene = new BaseThreeScene();
                        init();
                        scene.resize();
                    }
                });

                function init() {
                    var geometry;
                    var material;
                    var i;
                    var floor;
                    $$el.click(clickHandler);

                    scene.init($$el, $rootScope.renderer, onRender, mouseOverHandler, mouseOutHandler, useVr);
                    $rootScope.renderer.setClearColor(0x000000);

                    i = panels.length;
                    while (i--) {
                        var texture = THREE.ImageUtils.loadTexture('/assets/img/demo/demo-' + panels[i].file + '.jpg');
                        material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
                        geometry = new THREE.PlaneBufferGeometry(50, 30);
                        floor = new THREE.Mesh(geometry, material);
                        floor.rotation.x = panels[i].rotation.x;
                        floor.rotation.y = panels[i].rotation.y;
                        floor.rotation.z = panels[i].rotation.z;

                        floor.position.x = panels[i].position.x;
                        floor.position.y = panels[i].position.y;
                        floor.position.z = panels[i].position.z;
                        scene.addItem(floor);
                    }
                }

                function onRender() {
                }

                function clickHandler(item) {
                    console.log('Clicked: ', scene.activeObject());
                }

                function mouseOverHandler(item) {
                    // console.log('Mouse Hovering: ', item);
                }

                function mouseOutHandler(item) {
                    // console.log('Mouse Out: ', item);
                }
                init();

                $rootScope.$on('app:resized', function() {
                    $$el.width($(window).width());
                    $$el.height($(window).height());
                    scene.resize();
                });

                $scope.$on('$destroy', function() {
                    scene.destroy();
                });
            }
        };
    }])
;
