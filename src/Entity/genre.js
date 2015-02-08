'use strict';

angular.module('xbmc')
/**
 * Angular xbmc Genre factory
 */
    .factory('xbmcGenreEntity', [
        function () {

            function xbmcGenre() {

                var _this = this;

                _this._id;
                _this._songs = {};
                _this._albums = {};
                _this._movies = {};
                _this._artists = {};
                _this._tvshows = {};

                return _this;
            };

            return xbmcGenre;
        }
    ]);
