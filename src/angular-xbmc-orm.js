'use strict';

angular.module('xbmc')
/**
 * Angular XBMC ORM service
 * Route the response data to the appropriate repository
 * And return the hydrated result
 *
 * @require xbmcORMCollection
 * @require xbmcMovieRepository
 * @require xbmcAlbumRepository
 * @require xbmcSongRepository
 * @require xbmcGenreRepository
 * @require xbmcArtistRepository
 * @require xbmcTvshowRepository
 * @require xbmcSeasonRepository
 * @require xbmcEpisodeRepository
 * @require xbmcPlayerRepository
 */
    .service('xbmcORM', ['xbmcORMCollection', 'xbmcMovieRepository', 'xbmcAlbumRepository', 'xbmcSongRepository', 'xbmcGenreRepository', 'xbmcArtistRepository', 'xbmcTvshowRepository', 'xbmcSeasonRepository', 'xbmcEpisodeRepository', 'xbmcPlayerRepository',
        function (xbmcORMCollection, xbmcMovieRepository, xbmcAlbumRepository, xbmcSongRepository, xbmcGenreRepository, xbmcArtistRepository, xbmcTvshowRepository, xbmcSeasonRepository, xbmcEpisodeRepository, xbmcPlayerRepository) {
            var _this = this;

            // Method which try to find the appropriate repository
            function guessRepository(data) {
                if (data.result.movies || data.result.moviedetails) {
                    return xbmcMovieRepository;
                }
                if (data.result.albums || data.result.albumdetails) {
                    return xbmcAlbumRepository;
                }
                if (data.result.songs || data.result.songdetails) {
                    return xbmcSongRepository;
                }
                if (data.result.artists || data.result.artistdetails) {
                    return xbmcArtistRepository;
                }
                if (data.result.tvshows || data.result.tvshowdetails) {
                    return xbmcTvshowRepository;
                }
                if (data.result.seasons) {
                    return xbmcSeasonRepository;
                }
                if (data.result.episodes || data.result.episodedetails) {
                    return xbmcEpisodeRepository;
                }
                if (data.result.genres) {
                    return xbmcGenreRepository;
                }
                if (angular.isArray(data.result)) {
                    for (var id in data.result) {
                        if (data.result[id].playerid != undefined) {
                            return xbmcPlayerRepository;
                        }
                    }
                }

                return false;
            }

            // Method which returns a model if a repository is found
            this.processData = function (data) {
                var repository = guessRepository(data);

                // If found, hydrate a model with the data
                if (false !== repository) {
                    return repository.hydrate(data);
                }

                return new xbmcORMCollection();
            }

            return this;
        }
    ])
/**
 * ORM collection factory
 */
    .factory('xbmcORMCollection', [
        function () {

            function xbmcORMCollection() {
                return this;
            }

            xbmcORMCollection.prototype.addItem = function (item) {
                this[item._id] = item;
            }

            xbmcORMCollection.prototype.removeItem = function (item) {
                if (this[item._id]) {
                    delete this[item._id];
                }
            }

            // TODO : Decoupling with a decorator ?
            xbmcORMCollection.prototype.getByLabelKey = function () {
                var allItemsByLabelKey = {};
                angular.forEach(this, function (item) {
                    allItemsByLabelKey[item.label] = item;
                });

                return allItemsByLabelKey;
            }

            //TODO : Decoupling with a filter decorator ?
            xbmcORMCollection.prototype.filter = function (filter) {
                var filteredItems = [];
                angular.forEach(this, function (item) {
                    var regExp = new RegExp(filter);
                    if (regExp.test(item.label)) {
                        filteredItems.push(item);
                    }
                });

                return filteredItems;
            }

            return xbmcORMCollection;
        }
    ]);
