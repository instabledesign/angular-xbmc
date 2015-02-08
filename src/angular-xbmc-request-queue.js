'use strict';

/**
 * Service queue
 *
 * It allows to :
 * - manage multiple request to xbmc
 * - validate request's parameter
 */
angular.module('xbmc')
    .provider('$xbmcRequestQueue', [
        function () {

            var _this = this;
            var queue = [];
            var inProcess = false;
            var queueId;

//            _this.requestParallel = 2;
//            _this.requestInProcessLifeTime = 30;// in second
//            _this.requestProcessedLifeTime = 300;// in second

            _this.$get = ['$rootScope',
                function () {
                    _this.add = function (request) {
                        queue.push(request);
                    };

                    _this.process = function (id) {
                        if (true == inProcess && queueId != id) {
                            return;
                        }

                        if (queue.length == 0) {
                            inProcess = false;
                            return;
                        }

                        inProcess = true;
                        queueId = new Date().getTime();
                        queue[0].process();
                        queue.splice(0, 1);

                        _this.process(queueId);
                    };

                    return this;
                }
            ];
        }
    ]);
