'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Season factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     * @require xbmcORMCollection Return orm collection
     */
    .factory('xbmcSeasonEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcSeason() {

                var _this = this;

                _this._id;
                _this._tvshow;
                _this._episodes = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcSeason.prototype = {

                /**
                 * Return TVShow detail
                 *
                 * @return promise
                 */
                getTVShow: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid: _this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.TVShow")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params)
                        .then(function(tvshow) {

                            _this._tvshow = tvshow;
                            tvshow['_seasons'][_this._id] = _this;
                            defered.resolve(tvshow);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return TVShow detail
                 *
                 * @return promise
                 */
                getEpisodes: function(params) {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid: this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Episode")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetEpisodes(params)
                        .then(function(episodes) {
                            var episodesCollection = new xbmcORMCollection();
                            angular.forEach(episodes, function(episode) {

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

            return xbmcSeason;
        }
    ]);
