'use strict';

angular.module('xbmc')
/**
 * Angular xbmc TVShow factory
 *
 * @require $q Promise for model request
 * @require xbmcIntrospection Get all xbmc available method
 * @require xbmcIntrospection Return orm collection
 */
    .factory('xbmcTvshowEntity', ['$q', 'xbmcIntrospection', 'xbmcCollection',
        function ($q, xbmcIntrospection, xbmcCollection) {

            function xbmcTvshow() {

                var _this = this;

                _this._id;
                _this._genres = {};
                _this._seasons = {};
                _this._episodes = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcTvshow.prototype = {

                /**
                 * Return TVShow detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        tvshowid  : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.TVShow")
                    };

                    return xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params);
                },

                /**
                 * Return genres
                 *
                 * @return promise
                 */
                getGenres: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        type      : 'tvshow',
                        properties: xbmcIntrospection.getTypeFields("Library.Fields.Genre")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetGenres(params)
                        .then(function (genres) {
                            var allGenresByLabelKey = genres.getByLabelKey();
                            var genresCollection = new xbmcCollection();

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
                 * Return season
                 *
                 * @return promise
                 */
                getSeasons: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : _this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Season")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetSeasons(params)
                        .then(function (seasons) {
                            var seasonsCollection = new xbmcCollection();
                            angular.forEach(seasons, function (season) {

                                _this._seasons[season._id] = season;
                                seasonsCollection.addItem(season);
                                season['_tvshow'] = _this;
                            });
                            defered.resolve(seasonsCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return episodes
                 *
                 * @return promise
                 */
                getEpisodes: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Episode")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetEpisodes(params)
                        .then(function (episodes) {
                            var episodesCollection = new xbmcCollection();
                            angular.forEach(episodes, function (episode) {

                                _this._episodes[episode._id] = episode;
                                episodesCollection.addItem(episode);
                                episode['_tvshow'] = _this;
                            });
                            defered.resolve(episodesCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                }
            };

            return xbmcTvshow;
        }
    ]);