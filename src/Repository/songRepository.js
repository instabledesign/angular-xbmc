'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Song repository
 *
 * @require xbmcSongEntity The song model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcSongRepository', ['xbmcSongEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcSongEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['songs'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.songs || data.result.songdetails;
            };

            _this.hydrate = function (data) {

                if (data.result.songs) {
                    return _this.createOrUpdateSongs(data.result.songs);
                }
                else if (data.result.songdetails) {
                    return _this.createOrUpdateSong(data.result.songdetails);
                }
            }

            _this.createOrUpdateSong = function (value) {
                var song = cache[value.songid] || new xbmcSongEntity();

                angular.extend(song, value);
                song._id = value.songid;

                cache.addItem(song);

                return song;
            }

            _this.createOrUpdateSongs = function (dataSong) {

                if (angular.isArray(dataSong)) {
                    var result = new xbmcCollection();

                    angular.forEach(dataSong, function (value) {
                        result.addItem(_this.createOrUpdateSong(value));
                    });

                    return result;
                }
            }
        }
    ]);
