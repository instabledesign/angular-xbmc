'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Genre repository
 *
 * @require xbmcGenreEntity The genre model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcGenreRepository', ['xbmcGenreEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcGenreEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['genres'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.genres;
            };

            _this.hydrate = function (data) {

                if (data.result.genres) {
                    return _this.createOrUpdateGenres(data.result.genres);
                }
            }

            _this.createOrUpdateGenre = function (value) {
                var genre = cache[value.genreid] || new xbmcGenreEntity();

                angular.extend(genre, value);
                genre._id = value.genreid;

                cache.addItem(genre);

                return genre;
            }

            _this.createOrUpdateGenres = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcCollection();

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateGenre(value));
                    });

                    return result;
                }
            }
        }
    ]);
