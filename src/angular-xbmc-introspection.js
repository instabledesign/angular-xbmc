'use strict';

angular.module('xbmc')
    /**
     * Angular XBMC introspection service
     * Get the XBMC introspection schema
     *
     * @require $rootscope Emit events
     *
     * @event xbmc.introspected When the introspection was done
     */
    .service('xbmcIntrospection', ['$rootScope',
        function ($rootScope) {
            var _this = this;

            // Raw schema of the introspection
            // Contains methods, types, notifications and other information
            _this.schema = {};

            // Object contains the namespace and method from xbmc
            //
            // introspection['Addons']['ExecuteAddon'](params, cache)
            //                        ['GetAddonDetails'](params, cache)
            //                        ['GetAddons'](params, cache)
            //                        ['SetAddonEnabled'](params, cache)
            //
            // introspection['Application']['GetProperties'](params, cache)
            //                             ['OnVolumeChanged'](callback)
            //                             ['Quit'](params, cache)
            //                             ['SetMute'](params, cache)
            //                             ['SetVolume'](params, cache)
            //
            // introspection['AudioLibrary']['Clean'](params, cache)
            //                              ['Export'](params, cache)
            //                              ['GetAlbumDetails'](params, cache)
            //                              ['GetAlbums'](params, cache)
            //                              ['GetArtistDetails'](params, cache)
            //                              ['GetArtists'](params, cache)
            //                              ['GetGenres'](params, cache)
            //                              ['GetRecentlyAddedAlbums'](params, cache)
            //                              ['GetRecentlyAddedSongs'](params, cache)
            //                              ['GetRecentlyPlayedAlbums'](params, cache)
            //                              ['GetRecentlyPlayedSongs'](params, cache)
            //                              ['GetSongDetails'](params, cache)
            //                              ['GetSongs'](params, cache)
            //                              ['OnCleanFinished'](callback)
            //                              ['OnCleanStarted'](callback)
            //                              ['OnRemove'](callback)
            //                              ['OnScanFinished'](callback)
            //                              ['OnScanStarted'](callback)
            //                              ['OnUpdate'](callback)
            //                              ['Scan'](params, cache)
            //                              ['SetAlbumDetails'](params, cache)
            //                              ['SetArtistDetails'](params, cache)
            //                              ['SetSongDetails'](params, cache)
            //
            // introspection['Files']['GetDirectory'](params, cache)
            //                       ['GetFileDetails'](params, cache)
            //                       ['GetSources'](params, cache)
            //
            // introspection['GUI']['ActivateWindow'](params, cache)
            //                     ['GetProperties'](params, cache)
            //                     ['SetFullscreen'](params, cache)
            //                     ['ShowNotification'](params, cache)
            //
            // introspection['Input']['Back'](params, cache)
            //                       ['ContextMenu'](params, cache)
            //                       ['Down'](params, cache)
            //                       ['ExecuteAction'](params, cache)
            //                       ['Home'](params, cache)
            //                       ['Info'](params, cache)
            //                       ['Left'](params, cache)
            //                       ['OnInputFinished'](callback)
            //                       ['OnInputRequested'](callback)
            //                       ['Right'](params, cache)
            //                       ['Select'](params, cache)
            //                       ['SendText'](params, cache)
            //                       ['ShowCodec'](params, cache)
            //                       ['ShowOSD'](params, cache)
            //                       ['Up'](params, cache)
            //
            // introspection['JSONRPC']['GetConfiguration'](params, cache)
            //                         ['Introspect'](params, cache)
            //                         ['NotifyAll'](params, cache)
            //                         ['Permission'](params, cache)
            //                         ['Ping'](params, cache)
            //                         ['SetConfiguration'](params, cache)
            //                         ['Version'](params, cache)
            //
            // introspection['PVR']['GetChannelDetails'](params, cache)
            //                     ['GetChannelGroupDetails'](params, cache)
            //                     ['GetChannelGroups'](params, cache)
            //                     ['GetChannels'](params, cache)
            //                     ['GetProperties'](params, cache)
            //                     ['Record'](params, cache)
            //                     ['Scan'](params, cache)
            //
            // introspection['Player']['GetActivePlayers'](params, cache)
            //                        ['GetItem'](params, cache)
            //                        ['GetProperties'](params, cache)
            //                        ['GoTo'](params, cache)
            //                        ['Move'](params, cache)
            //                        ['OnPause'](callback)
            //                        ['OnPlay'](callback)
            //                        ['OnPropertyChanged'](callback)
            //                        ['OnSeek'](callback)
            //                        ['OnSpeedChanged'](callback)
            //                        ['OnStop'](callback)
            //                        ['Open'](params, cache)
            //                        ['PlayPause'](params, cache)
            //                        ['Rotate'](params, cache)
            //                        ['Seek'](params, cache)
            //                        ['SetAudioStream'](params, cache)
            //                        ['SetPartymode'](params, cache)
            //                        ['SetRepeat'](params, cache)
            //                        ['SetShuffle'](params, cache)
            //                        ['SetSpeed'](params, cache)
            //                        ['SetSubtitle'](params, cache)
            //                        ['Stop'](params, cache)
            //                        ['Zoom'](params, cache)
            //
            // introspection['Playlist']['Add'](params, cache)
            //                          ['Clear'](params, cache)
            //                          ['GetItems'](params, cache)
            //                          ['GetPlaylists'](params, cache)
            //                          ['GetProperties'](params, cache)
            //                          ['Insert'](params, cache)
            //                          ['OnAdd'](callback)
            //                          ['OnClear'](callback)
            //                          ['OnRemove'](callback)
            //                          ['Remove'](params, cache)
            //                          ['Swap'](params, cache)
            //
            // introspection['System']['EjectOpticalDrive'](params, cache)
            //                        ['GetProperties'](params, cache)
            //                        ['Hibernate'](params, cache)
            //                        ['OnLowBattery'](callback)
            //                        ['OnQuit'](callback)
            //                        ['OnRestart'](callback)
            //                        ['OnSleep'](callback)
            //                        ['OnWake'](callback)
            //                        ['Reboot'](params, cache)
            //                        ['Shutdown'](params, cache)
            //                        ['Suspend'](params, cache)
            //
            // introspection['VideoLibrary']['Clean'](params, cache)
            //                              ['Export'](params, cache)
            //                              ['GetEpisodeDetails'](params, cache)
            //                              ['GetEpisodes'](params, cache)
            //                              ['GetGenres'](params, cache)
            //                              ['GetMovieDetails'](params, cache)
            //                              ['GetMovieSetDetails'](params, cache)
            //                              ['GetMovieSets'](params, cache)
            //                              ['GetMovies'](params, cache)
            //                              ['GetMusicVideoDetails'](params, cache)
            //                              ['GetMusicVideos'](params, cache)
            //                              ['GetRecentlyAddedEpisodes'](params, cache)
            //                              ['GetRecentlyAddedMovies'](params, cache)
            //                              ['GetRecentlyAddedMusicVideos'](params, cache)
            //                              ['GetSeasons'](params, cache)
            //                              ['GetTVShowDetails'](params, cache)
            //                              ['GetTVShows'](params, cache)
            //                              ['OnCleanFinished'](callback)
            //                              ['OnCleanStarted'](callback)
            //                              ['OnRemove'](callback)
            //                              ['OnScanFinished'](callback)
            //                              ['OnScanStarted'](callback)
            //                              ['OnUpdate'](callback)
            //                              ['RemoveEpisode'](params, cache)
            //                              ['RemoveMovie'](params, cache)
            //                              ['RemoveMusicVideo'](params, cache)
            //                              ['RemoveTVShow'](params, cache)
            //                              ['Scan'](params, cache)
            //                              ['SetEpisodeDetails'](params, cache)
            //                              ['SetMovieDetails'](params, cache)
            //                              ['SetMusicVideoDetails'](params, cache)
            //                              ['SetTVShowDetails'](params, cache)
            //
            // introspection['XBMC']['GetInfoBooleans'](params, cache)
            //                      ['GetInfoLabels'](params, cache)
            _this.introspection = {};

            /**
             * Prepare the introspection method and notification
             *
             * @param schema Introspection schema
             * @param callback
             *
             * @returns object
             */
            _this.introspect = function (schema, callback) {
                _this.schema = schema;

                // Method introspection
                angular.forEach(
                    schema.methods,
                    function (methodProperties, method) {
                        var methodFrag = method.split('.');
                        _this.introspection[methodFrag[0]] = _this.introspection[methodFrag[0]] || {};
                        _this.introspection[methodFrag[0]][methodFrag[1]] = _this.introspection[methodFrag[0]][methodFrag[1]] || (function (method) {
                            return function (params, cache) {
                                return callback(method, params, cache);
                            };
                        })(method);
                    },
                    _this
                );

                //Notification introspection
                angular.forEach(
                    schema.notifications,
                    function (notificationsProperties, notification) {
                        var _this = this;
                        var notificationFrag = notification.split('.');
                        _this.introspection[notificationFrag[0]] = _this.introspection[notificationFrag[0]] || {};
                        _this.introspection[notificationFrag[0]][notificationFrag[1]] = _this.introspection[notificationFrag[0]][notificationFrag[1]] || (function (notification) {
                            return function (callback) {
                                $rootScope.$on('websocket.' + notification, function (event, data) {
                                    callback(data.params);
                                });
                            };
                        })(notification);
                    },
                    _this
                );

                // Introspection done !
                $rootScope.$emit('xbmc.introspected', _this.introspection);
            };

            /**
             * Get some enums fields about a type
             *
             * @param type Name of type field
             *
             * @returns mixed
             */
            _this.getTypeFields = function (type) {
                var schemaType = _this.schema.types;

                // The enums is hidding in .items.enums...
                if (schemaType[type].items && schemaType[type].items.enums) {
                    return schemaType[type].items.enums;
                }
                // Or in .enums...
                else if (schemaType[type].enums) {
                    return schemaType[type].enums;
                }

                throw 'The type ' + type + ' has no fields.';
            };
        }]
    );
