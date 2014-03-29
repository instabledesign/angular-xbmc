'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Artist factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     */
    .factory('xbmcArtistEntity', ['$q', 'xbmcIntrospection',
        function ($q, xbmcIntrospection) {

            function xbmcArtist() {
                var _this = this;

                _this._id;
                _this._songs = {};
                _this._albums = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcArtist.prototype = {

                /**
                 * Return artist detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        artistid  : this._id,
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Artist")
                    };

                    return xbmcIntrospection.introspection.AudioLibrary.GetArtistDetails(params);
                },

                /**
                 * Return artist songs
                 *
                 * @return promise
                 */
                getSongs  : function () {
                    var _this = this;

                    var params = {
                        filter    : {artistid: this._id},
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Song")
                    };

                    var defer = xbmcIntrospection.introspection.AudioLibrary.GetSongs(params);
                    defer.then(
                        function (songs) {
                            _this._songs = songs;
                        }
                    );
                    return defer;
                }
            };

            return xbmcArtist;
        }
    ]);
