'use strict';

/**
 * Response factory
 *
 */
angular.module('xbmc')
    .factory('xbmcResponse', [
        function () {

            function xbmcResponse(attributes) {
                angular.extend(this, attributes);

                return this;
            }

            return xbmcResponse;
        }
    ]);
