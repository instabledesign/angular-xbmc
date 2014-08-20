'use strict';

/**
 * XBMC Angular module
 *
 * This module provided some powerful utilities to interact with XBMC webserveur
 *
 * @require angular-websocket https://github.com/instabledesign/angular-websocket
 */
angular.module('xbmc', ['websocket', 'angular-md5'])
/**
 * Angular xbmc service
 *
 * provide a front tool to make all operation/request
 *
 * @require $rootscope Listen events
 * @require angular-xbmc-introspection Get all xbmc available method
 * @require angular-xbmc-request Send request to xbmc
 */
    .service('xbmc', ['$rootScope', 'xbmcConnexion', 'xbmcCache', 'xbmcRequestManager', '$xbmcRequestQueue', 'xbmcResponseManager', '$q',
        function ($rootScope, xbmcConnexion, xbmcCache, xbmcRequestManager, $xbmcRequestQueue, xbmcResponseManager, $q) {
            var _this = this;

            // At first, we are not connected to xbmc and the introspection is not done
            _this.isReady = false;
            _this.queue = [];
            _this.schema = {};

            // Reserved attributes for introspection
            _this.Addons = {};
            _this.Application = {};
            _this.AudioLibrary = {};
            _this.Files = {};
            _this.GUI = {};
            _this.Input = {};
            _this.JSONRPC = {};
            _this.PVR = {};
            _this.Player = {};
            _this.Playlist = {};
            _this.System = {};
            _this.VideoLibrary = {};
            _this.XBMC = {};

            /**
             * Call the callback when xbmc are ready
             * All XBMC introspected method was copy to this service
             *
             * @param callback Call when introspection was done
             */
            _this.onReady = function (callback) {
                if (!_this.isReady) {
                    xbmcConnexion.onConnect = function () {
                        // When the introspection is done, the xbmc service is ready to call any request to xbmc
                        _this.request('JSONRPC.Introspect', null, {'validate': false, 'hydrate': false}).then(
                            function (response) {
                                // Add all xbmc introspected methods
                                introspect(response.result);

                                _this.isReady = true;
                                callback.call();
                            }
                        );
                    };
                }
                else {
                    callback.call();
                }
            };

            _this.request = function (method, params, options) {
                var request = xbmcRequestManager.create(
                    {
                        method: method,
                        params: params
                    },
                    options
                );

                if (request.getOption('checkCache') != false) {
                    if (xbmcCache.hasRequest(request)) {
                        var cachedRequest = xbmcCache.getRequestByMD5(request.md5);

                        switch (cachedRequest.current) {
                            case 'failed':
                                console.log('send error');
                                return;
                            default:
                                request.defer = cachedRequest.defer;

                                return request.defer.promise;
                        }
                    }
                }

                if (request.getOption('validate') != false) {
                    request.validate();
                }

                request.pendingProcessing();

                // use to make the handleRequest after return promise
                // better to launch event?
                setTimeout(function () {
                    //                    try {
                    $xbmcRequestQueue.process();
                    //                    }
                    //                    catch (e) {
                    //                        console.log(e);
                    //                        request.defer.reject('pas valid');
                    //                    }
                }, 0);

                return request.defer.promise;
            };

            xbmcConnexion.onMessage = function (wsEvent) {
                var message = JSON.parse(wsEvent.data);

                if (message.hasOwnProperty('id')) {
                    handleResponse(xbmcResponseManager.create(message));
                }
                else {
                    console.log('notification XBMC', message);
                }
            };

            var handleResponse = function (response) {
                xbmcCache.addResponse(response);
                var request = xbmcCache.getRequestById(response.id);

                if (null == request) {
                    throw 'No request was found for response id ' + response.id;
                }

                request.success(response);
            };

            /**
             * Introspect schema and add all method to xbmc
             *
             * @param schema Schema to introspect
             */
            var introspect = function (schema) {
                _this.schema = schema;

                // Method introspection
                angular.forEach(
                    _this.schema.methods,
                    function (methodProperties, method) {
                        var methodFrag = method.split('.');
                        _this[methodFrag[0]] = _this[methodFrag[0]] || {};
                        _this[methodFrag[0]][methodFrag[1]] = _this[methodFrag[0]][methodFrag[1]] || (function (method) {
                            return function (params, options) {
                                return _this.request(method, params, options);
                            };
                        })(method);
                    },
                    _this
                );

                //Notification introspection
                //                angular.forEach(
                //                    _this.schema.notifications,
                //                    function (notificationsProperties, notification) {
                //                        var _this = this;
                //                        var notificationFrag = notification.split('.');
                //                        _this[notificationFrag[0]] = _this[notificationFrag[0]] || {};
                //                        _this[notificationFrag[0]][notificationFrag[1]] = _this[notificationFrag[0]][notificationFrag[1]] || (function (notification) {
                //                            return function (callback) {
                //                                $rootScope.$on('websocket.' + notification, function (event, data) {
                //                                    callback(data.params);
                //                                });
                //                            };
                //                        })(notification);
                //                    },
                //                    _this
                //                );
            };

            /**
             * Get some enums fields about a type
             *
             * @param type Name of type field
             *
             * @returns mixed
             */
            _this.getTypeFields = function (type) {
                var schemaType = _this.schema.types;

                // The enums is hidding in .items.enums...
                if (schemaType[type].items && schemaType[type].items.enums) {
                    return schemaType[type].items.enums;
                }
                // Or in .enums...
                else if (schemaType[type].enums) {
                    return schemaType[type].enums;
                }

                throw 'The type ' + type + ' has no fields.';
            };
        }
    ]);
