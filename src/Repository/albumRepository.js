'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Album repository
 *
 * @require xbmcArtistEntity The album model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcAlbumRepository', ['xbmcAlbumEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcAlbumEntity, xbmcCache, xbmcCollection) {
            var _this = this;

            var cache = xbmcCache.cache['albums'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.albums || data.result.albumdetails;
            };

            _this.hydrate = function (data) {

                if (data.result.albums) {
                    return _this.createOrUpdateAlbums(data.result.albums);
                }
                else if (data.result.albumdetails) {
                    return _this.createOrUpdateAlbum(data.result.albumdetails);
                }
            };

            _this.createOrUpdateAlbum = function (value) {
                var album = cache[value.albumid] || new xbmcAlbumEntity();

                angular.extend(album, value);
                album._id = value.albumid;

                cache.addItem(album);

                return album;
            };

            _this.createOrUpdateAlbums = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcCollection;

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateAlbum(value));
                    });

                    return result;
                }
            };
        }
    ]);
