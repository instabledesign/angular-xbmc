'use strict';

angular.module('xbmc')
/**
 * Angular xbmc TVShow repository
 *
 * @require xbmcTvshowEntity The TVShow model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcTvshowRepository', ['xbmcTvshowEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcTvshowEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['tvshows'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.tvshows || data.result.tvshowdetails;
            };

            _this.hydrate = function (data) {

                if (data.result.tvshows) {
                    return _this.createOrUpdateTvshows(data.result.tvshows);
                }
                else if (data.result.tvshowdetails) {
                    return _this.createOrUpdateTvshow(data.result.tvshowdetails);
                }
            }

            _this.createOrUpdateTvshow = function (dataTvshow) {
                var tvshow = cache[dataTvshow.tvshowid] || new xbmcTvshowEntity();

                angular.extend(tvshow, dataTvshow);
                tvshow._id = dataTvshow.tvshowid;

                cache.addItem(tvshow);

                return tvshow;
            }

            _this.createOrUpdateTvshows = function (dataTvshows) {

                if (angular.isArray(dataTvshows)) {
                    var result = new xbmcCollection();

                    angular.forEach(dataTvshows, function (dataTvshow) {
                        result.addItem(_this.createOrUpdateTvshow(dataTvshow));
                    });

                    return result;
                }
            }
        }
    ]);
