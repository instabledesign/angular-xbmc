'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Season repository
     *
     * @require xbmcSeasonEntity The season model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcSeasonRepository', ['xbmcSeasonEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcSeasonEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['seasons'] = new xbmcORMCollection();

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
                    var result = new xbmcORMCollection();

                    angular.forEach(dataSeasons, function (value) {
                        result.addItem(_this.createOrUpdateSeason(value));
                    });

                    return result;
                }
            }
        }
    ]);
