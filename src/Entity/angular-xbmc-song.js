'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Song factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     * @require xbmcORMCollection Return orm collection
     */
    .factory('xbmcSongEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcSong() {

                var _this = this;

                _this._id;
                _this._artist;
                _this._album = {};
                _this._genres = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcSong.prototype = {

                /**
                 * Return Song detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        songid    : this._id,
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Song")
                    };

                    return xbmcIntrospection.introspection.AudioLibrary.GetSongDetails(params);
                },

                /**
                 * Return genres detail
                 *
                 * @return promise
                 */
                getGenres : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        properties: xbmcIntrospection.getTypeFields("Library.Fields.Genre")
                    };

                    xbmcIntrospection.introspection.AudioLibrary.GetGenres(params)
                        .then(function (genres) {
                            var genresCollection = new xbmcORMCollection();

                            angular.forEach(_this.genreid, function (genreId) {
                                if (genres[genreId]) {
                                    var genre = genres[genreId];

                                    _this._genres[genre._id] = genre;
                                    genresCollection.addItem(genre);
                                    genre['_songs'][_this._id] = _this;
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
                 * Return album
                 *
                 * @return promise
                 */
                getAlbum  : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        albumid   : _this.albumid,
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Album")
                    };

                    xbmcIntrospection.introspection.AudioLibrary.GetAlbumDetails(params)
                        .then(function (album) {

                            _this._album = album;
                            album['_songs'][_this._id] = _this;
                            defered.resolve(album);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return artist
                 *
                 * @return promise
                 */
                getArtist : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        filter    : {songid: _this._id},
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Artist")
                    };

                    xbmcIntrospection.introspection.AudioLibrary.GetArtists(params)
                        .then(function (artist) {
                            _this._artist = artist[_this.artistid];
                            artist[_this.artistid]['_songs'][_this._id] = _this;
                            defered.resolve(_this._artist);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Play song
                 *
                 * @return true
                 */
                play      : function () {
                    var params = {
                        playlistid: 0,
                        position  : 0,
                        item      : {
                            songid: this._id
                        }
                    };

                    xbmcIntrospection.introspection.Playlist.Insert(params).then(function (status) {
                        if ('OK' == status) {
                            xbmcIntrospection.introspection.Player.Open({item: {playlistid: 0}}, false);
                        }
                    });

                    return true;
                }
            };

            return xbmcSong;
        }
    ]);
