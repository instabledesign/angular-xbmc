'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Artist repository
 *
 * @require xbmcArtistEntity The artist model
 * @require xbmcCache Get xbmc cache
 * @require xbmcCollection Return orm collection
 */
    .service('xbmcArtistRepository', ['xbmcArtistEntity', 'xbmcCache', 'xbmcCollection',
        function (xbmcArtistEntity, xbmcCache, xbmcCollection) {
            var _this = this;

            var cache = xbmcCache.cache['artists'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                return data.result.artists || data.result.artistdetails;
            };

            _this.hydrate = function (data) {

                if (data.result.artists) {
                    return _this.createOrUpdateArtists(data.result.artists);
                }
                else if (data.result.artistdetails) {
                    return _this.createOrUpdateArtist(data.result.artistdetails);
                }
            }

            _this.createOrUpdateArtist = function (value) {
                var artist = cache[value.artistid] || new xbmcArtistEntity();

                angular.extend(artist, value);
                artist._id = value.artistid;

                cache.addItem(artist);

                return artist;
            }

            _this.createOrUpdateArtists = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcCollection();

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateArtist(value));
                    });

                    return result;
                }
            }
        }
    ]);
