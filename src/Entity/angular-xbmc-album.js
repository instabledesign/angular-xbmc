'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Album factory
 *
 * @require $q Promise for model request
 * @require xbmcIntrospection Get all xbmc available method
 * @require xbmcORMCollection To add result
 */
    .factory('xbmcAlbumEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcAlbum() {
                var _this = this;

                _this._id;
                _this._songs = {};
                _this._genres = {};
                _this._artists = {};

                return _this;
            }

            /**
             * Add usefull album method
             */
            xbmcAlbum.prototype = {

                /**
                 * Return album detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        albumid   : this._id,
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Album")
                    };

                    return xbmcIntrospection.introspection.AudioLibrary.GetAlbumDetails(params);
                },

                /**
                 * Return album genres
                 *
                 * @return promise
                 */
                getGenres: function () {
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
                                    genre['_albums'][_this._id] = _this;
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
                 * Return album artists
                 *
                 * @return promise
                 */
                getArtists: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        filter    : {albumid: this._id},
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Artist")
                    };

                    xbmcIntrospection.introspection.AudioLibrary.GetArtists(params)
                        .then(function (artists) {
                            var artistsCollection = new xbmcORMCollection();
                            angular.forEach(artists, function (artist) {

                                _this._artists[artist._id] = artist;
                                artistsCollection.addItem(artist);
                                artist['_albums'][_this._id] = _this;
                            });
                            defered.resolve(artistsCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return album songs
                 *
                 * @return promise
                 */
                getSongs: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        filter    : {albumid: this._id},
                        properties: xbmcIntrospection.getTypeFields("Audio.Fields.Song")
                    };

                    xbmcIntrospection.introspection.AudioLibrary.GetSongs(params)
                        .then(function (songs) {
                            angular.forEach(songs, function (song) {
                                _this._songs[song._id] = song;
                                song['_album'][_this._id] = _this;
                            });
                            defered.resolve(songs);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                }
            };

            return xbmcAlbum;
        }
    ]);
