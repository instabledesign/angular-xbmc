'use strict';

/**
 * Request factory
 *
 */
angular.module('xbmc')
    .factory('xbmcRequest', [
        function () {

            function xbmcRequest(){
                var _this = this;
                _this.id = null;
                _this.jsonrpc = 2;
                _this.method = '';
                _this.params = {};

                return _this;
            }

            return xbmcRequest;
        }
    ]);
