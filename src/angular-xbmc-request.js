'use strict';

/**
 * Request factory
 *
 */
angular.module('xbmc')
    .constant('JSONRPC_VERSION', '2.0')
    .factory('xbmcRequest', ['JSONRPC_VERSION',
        function (JSONRPC_VERSION) {

            function xbmcRequest(id, attributes, options) {
                this.id = id;
                this.jsonrpc = JSONRPC_VERSION;
                this.method;
                this.params;
                this.options = {};

                angular.extend(this, attributes);
                angular.extend(this.options, options);

                return this;
            }

            xbmcRequest.prototype.toJson = function () {
                return JSON.stringify({
                    id     : this.id,
                    jsonrpc: this.jsonrpc,
                    method : this.method,
                    params : this.params || undefined
                });
            };

            xbmcRequest.prototype.getOption = function (name) {
                return this.options.hasOwnProperty(name) ? this.options[name] : null;
            };

            return xbmcRequest;
        }
    ]);
