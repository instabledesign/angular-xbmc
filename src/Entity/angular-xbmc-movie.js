'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Movie factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     * @require xbmcORMCollection Return orm collection
     */
    .factory('xbmcMovieEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcMovie() {

                var _this = this;

                _this._id;
                _this._genres = {};

                return _this;
            };

            /**
             * Add usefull movie method
             */
            xbmcMovie.prototype = {

                /**
                 * Return Movie detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        movieid   : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Movie")
                    };

                    return xbmcIntrospection.introspection.VideoLibrary.GetMovieDetails(params);
                },

                /**
                 * Return genres
                 *
                 * @return promise
                 */
                getGenres : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        type      : 'movie',
                        properties: xbmcIntrospection.getTypeFields("Library.Fields.Genre")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetGenres(params)
                        .then(function (genres) {
                            var allGenresByLabelKey = genres.getByLabelKey();
                            var genresCollection = new xbmcORMCollection();

                            angular.forEach(_this.genre, function (genreLabel) {
                                if (allGenresByLabelKey[genreLabel]) {
                                    var genre = allGenresByLabelKey[genreLabel];

                                    _this._genres[genre._id] = genre;
                                    genresCollection.addItem(genre);
                                    genre['_movies'][_this._id] = _this;
                                }
                            });
                            defered.resolve(genresCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Play movie
                 *
                 * @return boolean
                 */
                play      : function () {
                    var params = {
                        playlistid: 1,
                        position  : 0,
                        item      : {
                            movieid: this._id
                        }
                    };

                    xbmcIntrospection.introspection.Playlist.Insert(params).then(function (data) {
                        if ('OK' == data.status) {
                            xbmcIntrospection.introspection.Player.Open({item: {playlistid: 1}}, false);
                        }
                    });

                    return true;
                }
            };

            return xbmcMovie;
        }
    ]);
