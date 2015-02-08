'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Episode factory
 *
 * @require $q Promise for model request
 * @require xbmcIntrospection Get all xbmc available method
 */
    .factory('xbmcEpisodeEntity', ['$q', 'xbmcIntrospection',
        function ($q, xbmcIntrospection) {

            function xbmcEpisode() {
                var _this = this;

                _this._id;
                _this._tvshow = {};
                _this._season = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcEpisode.prototype = {

                /**
                 * Return Episode detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        episodeid : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Episode")
                    };

                    return xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params);
                },

                /**
                 * Return TVshow
                 *
                 * @return promise
                 */
                getTVShow: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : _this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.TVShow")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params)
                        .then(function (tvshow) {

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
                 * Return Season
                 *
                 * @return promise
                 */
                getSeason: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : _this.tvshowid,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Season")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetSeasons(params)
                        .then(function (seasons) {
                            if (seasons[_this['season']]) {
                                var season = seasons[_this['season']];
                                _this._season = season;
                                season['_episodes'][_this._id] = _this;
                            }
                            defered.resolve(_this._season);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                }
            };

            return xbmcEpisode;
        }
    ]);
