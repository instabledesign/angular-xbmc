'use strict';

/**
 * XBMC Angular module
 *
 * This module provided some powerful utilities to interact with XBMC webserveur
 *
 * @require angular-websocket https://github.com/instabledesign/angular-websocket
 */
angular.module('xbmc', ['websocket'])
    /**
     * Angular xbmc service
     *
     * provide a front tool to make all operation/request
     *
     * @require $rootscope Listen events
     * @require angular-xbmc-introspection Get all xbmc available method
     * @require angular-xbmc-request Send request to xbmc
     */
    .service('xbmc', ['$rootScope', 'xbmcIntrospection', 'xbmcRequest',
        function ($rootScope, xbmcIntrospection, xbmcRequest) {
            var _this = this;

            // At first, we are not connected to xbmc and the introspection is not done
            _this.isReady = false;

            /**
             * Call the callback when xbmc are ready
             * All XBMC introspected method was copy to this service
             *
             * @param callback Call when introspection was done
             */
            _this.onReady = function (callback) {
                if (!_this.isReady) {
                    // When the introspection is done, the xbmc service is ready to call any request to xbmc
                    $rootScope.$on('xbmc.introspected', function (event, introspection) {
                        _this.isReady = true;

                        // Add all xbmc introspected methods
                        angular.extend(_this, introspection);

                        callback.call();
                    });
                }
                else {
                    callback.call();
                }
            }

            /**
             * Get the introspected type fields
             *
             * Proxy of xbmcIntrospection.getTypeFields
             *
             * @type {*|getTypeFields}
             */
            _this.getTypeFields = xbmcIntrospection.getTypeFields;
        }
    ]);
