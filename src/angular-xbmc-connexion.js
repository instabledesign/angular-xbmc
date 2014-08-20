'use strict';

/**
 * Service queue
 *
 * It allows to :
 * - manage multiple request to xbmc
 * - validate request's parameter
 */
angular.module('xbmc')
    .service('xbmcConnexion', ['$rootScope', '$websocket',
        function ($rootScope, $websocket) {

            var _this = this;

            _this.onConnect = null;
            _this.onOpen = null;
            _this.onClose = null;
            _this.onMessage = null;
            _this.onError = null;

            _this.exec = function (request) {
                $websocket.send(request);
            }

            // When the websocket is connected, we launch the method introspection to xbmc
            $rootScope.$on('websocket.open', function () {
                $rootScope.$emit('xbmc.connected');
                if (angular.isFunction(_this.onConnect)) {
                    _this.onConnect.call();
                }
            });

            // When the websocket get a message
            $rootScope.$on('websocket.message', function (event, wsEvent) {
                $rootScope.$emit('xbmc.message', wsEvent);
                if (angular.isFunction(_this.onMessage)) {
                    _this.onMessage.call(null, wsEvent);
                }
            });
        }
    ]);
