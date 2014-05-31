'use strict';

/**
 * Service request
 *
 * It allows to :
 * - manage multiple request to xbmc
 * - validate request's parameter
 */
angular.module('xbmc')
    .service('xbmcRequestManager', ['$rootScope', '$websocket', '$q', '$log', 'xbmcORM', 'xbmcIntrospection', 'xbmcRequest',
        function ($rootScope, $websocket, $q, $log, xbmcORM, xbmcIntrospection, xbmcRequest) {

            var _this = this;
            _this.requestParallel = 2;
            _this.requestInProcessLifeTime = 30;// in second
            _this.requestProcessedLifeTime = 300;// in second
            var requestsToProcess = [];
            var requestsInProcess = {};
            var requestsProcessed = {};
            var requestsFailed = {};

            function addRequestToProcess (request, defer) {
                requestsToProcess.push({
                    'requestKey': getRequestKey(request),
                    'datetimeToProcess': new Date().getTime(),
                    'request': request,
                    'defer': defer
                });
            }

            _this.getRequestsToProcess = function() {
                return requestsToProcess;
            }

            _this.getRequestToProcess = function(requestKey) {
                for(var i in requestsToProcess) {
                    if (requestKey == requestsToProcess[i].requestKey) {
                        return requestsToProcess;
                    }
                }
                return false;
            }

            function addRequestInProcess(requestToProcess) {
                var requestKey = getRequestKey(requestToProcess.request);

                requestToProcess['datetimeInProcess'] = new Date().getTime();

                requestsInProcess[requestKey] = requestToProcess;
            }

            _this.getRequestsInProcess = function() {
                return requestsInProcess;
            }

            _this.getRequestInProcess = function(requestKey) {
                return requestsInProcess[requestKey] || false;
            }

            function addRequestProcessed(requestProcessed, response, result) {
                var requestKey = getRequestKey(requestProcessed.request);

                requestProcessed['datetimeProcessed'] = new Date().getTime();
                requestProcessed['response'] = response || null;
                requestProcessed['result'] = result || null;

                requestsProcessed[requestKey] = requestProcessed;
            }

            _this.getRequestsProcessed = function() {
                return requestsProcessed;
            }

            _this.getRequestProcessed = function(requestKey) {
                return requestsProcessed[requestKey] || false;
            }

            function addRequestFailed(requestFailed, error) {
                var requestKey = getRequestKey(requestFailed.request);

                requestFailed['datetimeFailed'] = new Date().getTime();
                requestFailed['error'] = error;

                requestsFailed[requestKey] = requestFailed;
            }

            _this.getRequestsFailed = function() {
                return requestsFailed;
            }

            _this.getRequestFailed = function(requestKey) {
                return requestsFailed[requestKey];
            }

            _this.create = function (method, params) {
                var request = new xbmcRequest();
            }

            _this.request = function (method, params, cache) {
                if (false != cache) {
                    cache = true;
                }

                var defered = $q.defer();

                try {
                    var status = _this.getStatus(request);
                    if (!status || !cache) {
                        addRequestToProcess(request, defered);
                        processQueue();
                    }
                    else {
                        var cache = _this.getCache(request);
                        if ('ToProcess' == status) {
                            defered = cache.defer;
                        }
                        else if ('InProcess' == status) {
                            defered = cache.defer;
                        }
                        else if ('Processed' == status) {
                            if(cache.result) {
                                defered.resolve(cache.result);
                            }
                        }
                    }
                }
                catch (e) {
                    defered.reject(e);
                }

                return defered.promise;
            };

            _this.getStatus = function(request) {
                var requestKey = getRequestKey(request);

                if (requestsProcessed[requestKey]) {
                    return 'Processed';
                }
                else if (requestsInProcess[requestKey]) {
                    return 'InProcess';
                }

                if(_this.getRequestToProcess(requestKey)) {
                    return 'ToProcess';
                }

                return false;
            };

            _this.getCache = function (request) {
                var requestKey = getRequestKey(request);

                if (requestsInProcess[requestKey]) {
                    if (requestsInProcess[requestKey].datetimeInProcess + _this.requestInProcessLifeTime * 1000 > new Date().getTime()) {
                        return requestsInProcess[requestKey];
                    }
                }

                if (requestsProcessed[requestKey]) {
                    if (requestsProcessed[requestKey].datetimeProcessed + _this.requestProcessedLifeTime * 1000 > new Date().getTime()) {
                        return requestsProcessed[requestKey];
                    }
                }

                return _this.getRequestToProcess(requestKey);
            };

            _this.addRequestToProcess = function (request, defer) {
                _this.requestToProcess.push({
                    'requestKey': getRequestKey(request),
                    'datetimeToProcess': new Date().getTime(),
                    'request': request,
                    'defer': defer
                });
            };

            _this.addRequestInProcess = function (requestToProcess) {
                var requestKey = getRequestKey(requestToProcess.request);

                requestToProcess['datetimeInProcess'] = new Date().getTime();

                _this.requestInProcess[requestKey] = requestToProcess;
            };

            _this.addRequestProcessed = function (requestProcessed, response, result) {
                var requestKey = getRequestKey(requestProcessed.request);

                requestProcessed['datetimeProcessed'] = new Date().getTime();
                requestProcessed['response'] = response || null;
                requestProcessed['result'] = result || null;

                _this.requestProcessed[requestKey] = requestProcessed;
            };

            _this.addRequestFailed = function (requestFailed, error) {
                var requestKey = getRequestKey(requestFailed.request);

                requestFailed['datetimeFailed'] = new Date().getTime();
                requestFailed['error'] = error;

                _this.requestFailed[requestKey] = requestFailed;
            };

            function processQueue() {
                if(Object.keys(requestsInProcess).length < _this.requestParallel) {
                    var requestToProcess = requestsToProcess[0];
                    if (requestToProcess) {
                        var requestKey = getRequestKey(requestToProcess.request);

                        requestsToProcess.splice(0,1);
                        addRequestInProcess(requestToProcess);

                        $websocket.request(requestToProcess.request).then(function (response) {
                            var result = xbmcORM.processData(response);

                            addRequestProcessed(requestToProcess, response, result);

                            delete requestsInProcess[requestKey];

                            processQueue();

                            requestToProcess.defer.resolve(result);
                        }).catch(function (e) {
                            addRequestFailed(requestToProcess, e);
                            delete requestsInProcess[requestKey];
                            processQueue();
                            requestToProcess.defer.reject(requestToProcess);
                        });
                    }
                }
            };

            function getRequestKey(request) {
                return JSON.stringify([request.method, request.params]);
            };

            // When the websocket is connected, we launch the method introspection to xbmc
            $rootScope.$on('websocket.connected', function () {
                $websocket.request({method: 'JSONRPC.Introspect'}).then(
                    function (data) {
                        // Do the introspection (prepare all public methods for the controllers)
                        xbmcIntrospection.introspect(data.result, _this.request);
                    }
                );
            });
        }
    ]);
