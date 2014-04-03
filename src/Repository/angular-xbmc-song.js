'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Song repository
     *
     * @require xbmcSongEntity The song model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcSongRepository', ['xbmcSongEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcSongEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['songs'] = new xbmcORMCollection();

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
                    var result = new xbmcORMCollection();

                    angular.forEach(dataSong, function (value) {
                        result.addItem(_this.createOrUpdateSong(value));
                    });

                    return result;
                }
            }
        }
    ]);
