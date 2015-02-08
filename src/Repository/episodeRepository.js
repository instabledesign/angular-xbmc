'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Episode repository
 *
 * @require xbmcEpisodeEntity The episode model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcEpisodeRepository', ['xbmcEpisodeEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcEpisodeEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['episodes'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.episodes || data.result.episodedetails;
            };

            _this.hydrate = function (data) {

                if (data.result.episodes) {
                    return _this.createOrUpdateEpisodes(data.result.episodes);
                }
                else if (data.result.episodedetails) {
                    return _this.createOrUpdateEpisode(data.result.episodedetails);
                }
            }

            _this.createOrUpdateEpisode = function (value) {
                var episode = cache[value.episodeid] || new xbmcEpisodeEntity();

                angular.extend(episode, value);
                episode._id = value.episodeid;

                cache.addItem(episode);

                return episode;
            }

            _this.createOrUpdateEpisodes = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcCollection();

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateEpisode(value));
                    });

                    return result;
                }
            }
        }
    ]);
