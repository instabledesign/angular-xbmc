'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Movie repository
 *
 * @require xbmcMovieEntity The movie model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcMovieRepository', ['xbmcMovieEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcMovieEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['movies'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.movies || data.result.moviedetails;
            };

            _this.hydrate = function (data) {

                if (data.result.movies) {
                    return createOrUpdateMovies(data.result.movies);
                }
                else if (data.result.moviedetails) {
                    return createOrUpdateMovie(data.result.moviedetails);
                }
            }

            function createOrUpdateMovie(dataMovie) {
                var movie = cache[dataMovie.movieid] || new xbmcMovieEntity();

                angular.extend(movie, dataMovie);
                movie._id = dataMovie.movieid;

                cache.addItem(movie);

                return movie;
            }

            function createOrUpdateMovies(dataMovies) {

                if (angular.isArray(dataMovies)) {
                    var result = new xbmcCollection();

                    angular.forEach(dataMovies, function (dataMovie) {
                        result.addItem(createOrUpdateMovie(dataMovie));
                    });

                    return result;
                }
            }
        }
    ]);
