'use strict';

/**
 * Request factory
 *
 */
angular.module('xbmc')
    .service('xbmcRequestValidator', [
        function () {
            this.validate = function (request) {
                //TODO VALIDATION
                return true;
            }
        }
    ]);
