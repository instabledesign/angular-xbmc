'use strict';

/**
 * Service response
 *
 * It allows to :
 * - manage multiple response to xbmc
 */
angular.module('xbmc')
    .service('xbmcResponseManager', ['xbmcResponse',
        function (xbmcResponse) {

            this.create = function (response) {
                response.receivedAt = new Date().getTime();
                return new xbmcResponse(response);
            }
        }
    ]);
