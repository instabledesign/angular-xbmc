'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc cache service
     *
     * @return mixed Return a cached value
     */
    .service('xbmcCache', [
        function () {

            var _this = this;
            _this.cache = {};

            _this.get = function (type) {
                return _this.cache[type] || {};
            }
        }
    ]);
