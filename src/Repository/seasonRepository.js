'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Season repository
 *
 * @require xbmcSeasonEntity The season model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcSeasonRepository', ['xbmcSeasonEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcSeasonEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['seasons'] = new xbmcCollection();


            _this.canHydrate = function (data) {
                return data.result.seasons;
            };

            _this.hydrate = function (data) {

                if (data.result.seasons) {
                    return _this.createOrUpdateSeasons(data.result.seasons);
                }
                else if (data.result.seasondetails) {
                    return _this.createOrUpdateSeason(data.result.seasondetails);
                }
            }

            _this.createOrUpdateSeason = function (dataSeason) {
                var season = cache[dataSeason.season] || new xbmcSeasonEntity();

                angular.extend(season, dataSeason);
                season._id = dataSeason.season;

                cache.addItem(season);

                return season;
            }

            _this.createOrUpdateSeasons = function (dataSeasons) {

                if (angular.isArray(dataSeasons)) {
                    var result = new xbmcCollection();

                    angular.forEach(dataSeasons, function (value) {
                        result.addItem(_this.createOrUpdateSeason(value));
                    });

                    return result;
                }
            }
        }
    ]);
