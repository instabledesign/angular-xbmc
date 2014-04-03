'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Artist repository
     *
     * @require xbmcArtistEntity The artist model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcArtistRepository', ['xbmcArtistEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcArtistEntity, xbmcCache, xbmcORMCollection) {
            var _this = this;

            var cache = xbmcCache.cache['artists'] = new xbmcORMCollection();

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
                    var result = new xbmcORMCollection();

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateArtist(value));
                    });

                    return result;
                }
            }
        }
    ]);
