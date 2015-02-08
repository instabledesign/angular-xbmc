'use strict';

/**
 * Service request
 *
 * It allows to :
 * - manage multiple request to xbmc
 * - validate request's parameter
 */
angular.module('xbmc')
    .service('xbmcRequestWorkflow', ['xbmcRequest', 'xbmcConnexion', '$xbmcRequestQueue', 'xbmcCache', 'xbmcRequestValidator', 'xbmcORM', '$q', 'md5',
        function (xbmcRequest, xbmcConnexion, $xbmcRequestQueue, xbmcCache, xbmcRequestValidator, xbmcORM,  $q, md5) {

            var _this = this;

            _this.addStateMachine = function (request) {
                StateMachine.create({
                    target   : request,
                    events   : [
                        {
                            name: 'create',
                            from: 'none',
                            to  : 'created'
                        },
                        {
                            name: 'validate',
                            from: 'created',
                            to  : 'validated'
                        },
                        {
                            name: 'pendingProcessing',
                            from: ['created', 'validated'],
                            to  : 'pendingProcess'
                        },
                        {
                            name: 'process',
                            from: 'pendingProcess',
                            to  : 'inProcess'
                        },
                        {
                            name: 'success',
                            from: 'inProcess',
                            to  : 'processed'
                        },
                        {
                            name: 'fail',
                            from: ['create', 'inProcess'],
                            to  : 'failed'
                        }
                    ],
                    callbacks: {
                        /*
                         * Global statemachine handlers
                         */
                        onbeforeevent      : function (event, from, to, message) {
                            this.defer.notify(event);
                        },
                        onafterevent       : function (event, from, to, message) {
                            this[event + 'At'] = new Date().getTime();
                            this.defer.notify(this.current);
                        },
                        error              : function (event, from, to, args, errorCode, errorMessage) {
                            if (this.defer) {
                                this.defer.reject(event);
                            }
                        },
                        /*
                         * Event statemachine handlers
                         */
                        onbeforecreate           : function () {
                            this.defer = $q.defer();
                            this.history = [];
                            this.md5 = md5.createHash(JSON.stringify([this.method, this.params]));
                        },
                        onvalidate         : function (event) {
                            try {
                                return xbmcRequestValidator.validate(this);
                            }
                            catch (e) {
                                this.defer.reject(event);

                                return false;
                            }
                        },
                        onpendingProcessing: function () {
                            xbmcCache.addRequest(this);
                            $xbmcRequestQueue.add(this);
                        },
                        onprocess          : function () {
                            xbmcConnexion.exec(this.toJson());
                        },
                        onsuccess          : function (event, from, to, response) {
                            this.response = response;

                            if (this.getOption('hydrate') == false) {
                                this.defer.resolve(response);

                                return;
                            }

                            this.defer.resolve(xbmcORM.processData(response));
                        }
                    }
                });
            };
        }
    ]);
