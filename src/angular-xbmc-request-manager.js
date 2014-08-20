'use strict';

/**
 * Service request
 *
 * It allows to :
 * - manage multiple request to xbmc
 * - validate request's parameter
 */
angular.module('xbmc')
    .service('xbmcRequestManager', ['xbmcRequest', 'xbmcRequestWorkflow',
        function (xbmcRequest, xbmcRequestWorkflow) {

            var _this = this;
            var requestId = 1;

            _this.create = function (attributes, options) {
                var request = new xbmcRequest(requestId++, attributes, options);

                xbmcRequestWorkflow.addStateMachine(request);
                // Initialise the request workflow
                request.create();

                return request;
            };
        }
    ]);
