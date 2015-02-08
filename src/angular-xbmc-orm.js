'use strict';

angular.module('xbmc')
/**
 * Angular XBMC ORM service
 * Route the response data to the appropriate repository
 * And return the hydrated result
 *
 * @require xbmcCollection
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
    .service('xbmcORM', ['xbmcCollection', 'xbmcMovieRepository', 'xbmcAlbumRepository', 'xbmcSongRepository', 'xbmcGenreRepository', 'xbmcArtistRepository', 'xbmcTvshowRepository', 'xbmcSeasonRepository', 'xbmcEpisodeRepository', 'xbmcPlayerRepository',
        function (xbmcCollection, xbmcMovieRepository, xbmcAlbumRepository, xbmcSongRepository, xbmcGenreRepository, xbmcArtistRepository, xbmcTvshowRepository, xbmcSeasonRepository, xbmcEpisodeRepository, xbmcPlayerRepository) {
            var _this = this;

            var repositories = [
                xbmcMovieRepository,
                xbmcAlbumRepository,
                xbmcSongRepository,
                xbmcGenreRepository,
                xbmcArtistRepository,
                xbmcTvshowRepository,
                xbmcSeasonRepository,
                xbmcEpisodeRepository,
                xbmcPlayerRepository
            ];

            // Method which try to find the appropriate repository
            function guessRepository(data) {
                for (var repository in repositories)
                {
                    if (repositories[repository].hasOwnProperty('canHydrate') && repositories[repository].canHydrate(data)){
                        return repositories[repository];
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

                return 'ertyu';//new xbmcCollection();
            }

            return this;
        }
    ]);
