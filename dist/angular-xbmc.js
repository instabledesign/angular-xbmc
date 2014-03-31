/**
 * An angular library for xbmc
 *
 * @version v0.1.0
 * @date 2014-03-31 07:06:56 GMT+0200
 * @link https://github.com/instabledesign/angular-xbmc
 * @license GNU GPL v2
 */
'use strict';

/**
 * XBMC Angular module
 *
 * This module provided some powerful utilities to interact with XBMC webserveur
 *
 * @require angular-websocket https://github.com/instabledesign/angular-websocket
 */
angular.module('xbmc', ['websocket'])
    /**
     * Angular xbmc service
     *
     * provide a front tool to make all operation/request
     *
     * @require $rootscope Listen events
     * @require angular-xbmc-introspection Get all xbmc available method
     * @require angular-xbmc-request Send request to xbmc
     */
    .service('xbmc', ['$rootScope', 'xbmcIntrospection', 'xbmcRequest',
        function ($rootScope, xbmcIntrospection, xbmcRequest) {
            var _this = this;

            // At first, we are not connected to xbmc and the introspection is not done
            _this.isReady = false;

            /**
             * Call the callback when xbmc are ready
             * All XBMC introspected method was copy to this service
             *
             * @param callback Call when introspection was done
             */
            _this.onReady = function (callback) {
                if (!_this.isReady) {
                    // When the introspection is done, the xbmc service is ready to call any request to xbmc
                    $rootScope.$on('xbmc.introspected', function (event, introspection) {
                        _this.isReady = true;

                        // Add all xbmc introspected methods
                        angular.extend(_this, introspection);

                        callback.call();
                    });
                }
                else {
                    callback.call();
                }
            }

            /**
             * Get the introspected type fields
             *
             * Proxy of xbmcIntrospection.getTypeFields
             *
             * @type {*|getTypeFields}
             */
            _this.getTypeFields = xbmcIntrospection.getTypeFields;
        }
    ]);

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc cache service
     *
     * @return mixed Return a cached value
     */
    .service('xbmcCache', [
        function () {

            var _this = this;
            _this.cache = {};

            _this.get = function (type) {
                return _this.cache[type] || {};
            }
        }
    ]);

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

'use strict';

angular.module('xbmc')
    /**
     * Angular XBMC ORM service
     * Route the response data to the appropriate repository
     * And return the hydrated result
     *
     * @require xbmcORMCollection
     * @require xbmcMovieRepository
     * @require xbmcAlbumRepository
     * @require xbmcSongRepository
     * @require xbmcGenreRepository
     * @require xbmcArtistRepository
     * @require xbmcTvshowRepository
     * @require xbmcSeasonRepository
     * @require xbmcEpisodeRepository
     * @require xbmcPlayerRepository
     */
    .service('xbmcORM', ['xbmcORMCollection', 'xbmcMovieRepository', 'xbmcAlbumRepository', 'xbmcSongRepository', 'xbmcGenreRepository', 'xbmcArtistRepository', 'xbmcTvshowRepository', 'xbmcSeasonRepository', 'xbmcEpisodeRepository', 'xbmcPlayerRepository',
        function (xbmcORMCollection, xbmcMovieRepository, xbmcAlbumRepository, xbmcSongRepository, xbmcGenreRepository, xbmcArtistRepository, xbmcTvshowRepository, xbmcSeasonRepository, xbmcEpisodeRepository, xbmcPlayerRepository) {
            var _this = this;

            // Method which try to find the appropriate repository
            function guessRepository(data) {
                if (data.result.movies || data.result.moviedetails) {
                    return xbmcMovieRepository;
                }
                if (data.result.albums || data.result.albumdetails) {
                    return xbmcAlbumRepository;
                }
                if (data.result.songs || data.result.songdetails) {
                    return xbmcSongRepository;
                }
                if (data.result.artists || data.result.artistdetails) {
                    return xbmcArtistRepository;
                }
                if (data.result.tvshows || data.result.tvshowdetails) {
                    return xbmcTvshowRepository;
                }
                if (data.result.seasons) {
                    return xbmcSeasonRepository;
                }
                if (data.result.episodes || data.result.episodedetails) {
                    return xbmcEpisodeRepository;
                }
                if (data.result.genres) {
                    return xbmcGenreRepository;
                }
                if (angular.isArray(data.result)) {
                    for (var id in data.result) {
                        if (data.result[id].playerid != undefined) {
                            return xbmcPlayerRepository;
                        }
                    }
                }

                return false;
            }

            // Method which returns a model if a repository is found
            this.processData = function (data) {
                var repository = guessRepository(data);

                // If found, hydrate a model with the data
                if (false !== repository) {
                    return repository.hydrate(data);
                }

                return new xbmcORMCollection();
            }

            return this;
        }
    ])
    /**
     * ORM collection factory
     */
    .factory('xbmcORMCollection', [
        function () {

            function xbmcORMCollection() {
                return this;
            }

            xbmcORMCollection.prototype.addItem = function (item) {
                this[item._id] = item;
            }

            xbmcORMCollection.prototype.removeItem = function (item) {
                if (this[item._id]) {
                    delete this[item._id];
                }
            }

            // TODO : Decoupling with a decorator ?
            xbmcORMCollection.prototype.getByLabelKey = function () {
                var allItemsByLabelKey = {};
                angular.forEach(this, function (item) {
                    allItemsByLabelKey[item.label] = item;
                });

                return allItemsByLabelKey;
            }

            //TODO : Decoupling with a filter decorator ?
            xbmcORMCollection.prototype.filter = function (filter) {
                var filteredItems = [];
                angular.forEach(this, function (item) {
                    var regExp = new RegExp(filter);
                    if (regExp.test(item.label)) {
                        filteredItems.push(item);
                    }
                });

                return filteredItems;
            }

            return xbmcORMCollection;
        }
    ]);

'use strict';

/**
 * Service request
 *
 * It allows to :
 * - manage multiple request to xbmc
 * - validate request's parameter
 */
angular.module('xbmc')
    .service('xbmcRequest', ['$rootScope', '$websocket', '$q', 'xbmcORM', 'xbmcIntrospection', '$log',
        function ($rootScope, $websocket, $q, xbmcORM, xbmcIntrospection, $log) {

            var _this = this;
            _this.requestParallel = 2;
            _this.requestInProcessLifeTime = 30;// in second
            _this.requestProcessedLifeTime = 300;// in second
            var requestsToProcess = [];
            var requestsInProcess = {};
            var requestsProcessed = {};
            var requestsFailed = {};

            function addRequestToProcess (request, defer) {
                requestsToProcess.push({
                    'requestKey': getRequestKey(request),
                    'datetimeToProcess': new Date().getTime(),
                    'request': request,
                    'defer': defer
                });
            }

            _this.getRequestsToProcess = function() {
                return requestsToProcess;
            }

            _this.getRequestToProcess = function(requestKey) {
                for(var i in requestsToProcess) {
                    if (requestKey == requestsToProcess[i].requestKey) {
                        return requestsToProcess;
                    }
                }
                return false;
            }

            function addRequestInProcess(requestToProcess) {
                var requestKey = getRequestKey(requestToProcess.request);

                requestToProcess['datetimeInProcess'] = new Date().getTime();

                requestsInProcess[requestKey] = requestToProcess;
            }

            _this.getRequestsInProcess = function() {
                return requestsInProcess;
            }

            _this.getRequestInProcess = function(requestKey) {
                return requestsInProcess[requestKey] || false;
            }

            function addRequestProcessed(requestProcessed, response, result) {
                var requestKey = getRequestKey(requestProcessed.request);

                requestProcessed['datetimeProcessed'] = new Date().getTime();
                requestProcessed['response'] = response || null;
                requestProcessed['result'] = result || null;

                requestsProcessed[requestKey] = requestProcessed;
            }

            _this.getRequestsProcessed = function() {
                return requestsProcessed;
            }

            _this.getRequestProcessed = function(requestKey) {
                return requestsProcessed[requestKey] || false;
            }

            function addRequestFailed(requestFailed, error) {
                var requestKey = getRequestKey(requestFailed.request);

                requestFailed['datetimeFailed'] = new Date().getTime();
                requestFailed['error'] = error;

                requestsFailed[requestKey] = requestFailed;
            }

            _this.getRequestsFailed = function() {
                return requestsFailed;
            }

            _this.getRequestFailed = function(requestKey) {
                return requestsFailed[requestKey];
            }

            _this.request = function (method, params, cache) {
                if (false != cache) {
                    cache = true;
                }

                var defered = $q.defer();

                var request = {
                    'method': method,
                    'params': params || {}
                };

                try {
                    var status = _this.getStatus(request);
                    if (!status || !cache) {
                        addRequestToProcess(request, defered);
                        processQueue();
                    }
                    else {
                        var cache = _this.getCache(request);
                        if ('ToProcess' == status) {
                            defered = cache.defer;
                        }
                        else if ('InProcess' == status) {
                            defered = cache.defer;
                        }
                        else if ('Processed' == status) {
                            if(cache.result) {
                                defered.resolve(cache.result);
                            }
                        }
                    }
                }
                catch (e) {
                    defered.reject(e);
                }

                return defered.promise;
            };

            _this.getStatus = function(request) {
                var requestKey = getRequestKey(request);

                if (requestsProcessed[requestKey]) {
                    return 'Processed';
                }
                else if (requestsInProcess[requestKey]) {
                    return 'InProcess';
                }

                if(_this.getRequestToProcess(requestKey)) {
                    return 'ToProcess';
                }

                return false;
            };

            _this.getCache = function (request) {
                var requestKey = getRequestKey(request);

                if (requestsInProcess[requestKey]) {
                    if (requestsInProcess[requestKey].datetimeInProcess + _this.requestInProcessLifeTime * 1000 > new Date().getTime()) {
                        return requestsInProcess[requestKey];
                    }
                }

                if (requestsProcessed[requestKey]) {
                    if (requestsProcessed[requestKey].datetimeProcessed + _this.requestProcessedLifeTime * 1000 > new Date().getTime()) {
                        return requestsProcessed[requestKey];
                    }
                }

                return _this.getRequestToProcess(requestKey);
            };

            _this.addRequestToProcess = function (request, defer) {
                _this.requestToProcess.push({
                    'requestKey': getRequestKey(request),
                    'datetimeToProcess': new Date().getTime(),
                    'request': request,
                    'defer': defer
                });
            };

            _this.addRequestInProcess = function (requestToProcess) {
                var requestKey = getRequestKey(requestToProcess.request);

                requestToProcess['datetimeInProcess'] = new Date().getTime();

                _this.requestInProcess[requestKey] = requestToProcess;
            };

            _this.addRequestProcessed = function (requestProcessed, response, result) {
                var requestKey = getRequestKey(requestProcessed.request);

                requestProcessed['datetimeProcessed'] = new Date().getTime();
                requestProcessed['response'] = response || null;
                requestProcessed['result'] = result || null;

                _this.requestProcessed[requestKey] = requestProcessed;
            };

            _this.addRequestFailed = function (requestFailed, error) {
                var requestKey = getRequestKey(requestFailed.request);

                requestFailed['datetimeFailed'] = new Date().getTime();
                requestFailed['error'] = error;

                _this.requestFailed[requestKey] = requestFailed;
            };

            function processQueue() {
                if(Object.keys(requestsInProcess).length < _this.requestParallel) {
                    var requestToProcess = requestsToProcess[0];
                    if (requestToProcess) {
                        var requestKey = getRequestKey(requestToProcess.request);

                        requestsToProcess.splice(0,1);
                        addRequestInProcess(requestToProcess);

                        $websocket.request(requestToProcess.request).then(function (response) {
                            var result = xbmcORM.processData(response);
                            addRequestProcessed(requestToProcess, response, result);
                            delete requestsInProcess[requestKey];
                            processQueue();
                            requestToProcess.defer.resolve(result);
                        }).catch(function (e) {
                            addRequestFailed(requestToProcess, e);
                            delete requestsInProcess[requestKey];
                            processQueue();
                            requestToProcess.defer.reject(requestToProcess);
                        });
                    }
                }
            };

            function getRequestKey(request) {
                return JSON.stringify([request.method, request.params]);
            };

            // When the websocket is connected, we launch the method introspection to xbmc
            $rootScope.$on('websocket.connected', function () {
                $websocket.request({method: 'JSONRPC.Introspect'}).then(
                    function (data) {
                        // Do the introspection (prepare all public methods for the controllers)
                        xbmcIntrospection.introspect(data.result, _this.request);
                    }
                );
            });
        }
    ]);

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
            };

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

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Episode factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     */
    .factory('xbmcEpisodeEntity', ['$q', 'xbmcIntrospection',
        function ($q, xbmcIntrospection) {

            function xbmcEpisode() {
                var _this = this;

                _this._id;
                _this._tvshow = {};
                _this._season = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcEpisode.prototype = {

                /**
                 * Return Episode detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        episodeid : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Episode")
                    };

                    return xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params);
                },

                /**
                 * Return TVshow
                 *
                 * @return promise
                 */
                getTVShow : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : _this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.TVShow")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params)
                        .then(function (tvshow) {

                            _this._tvshow = tvshow;
                            tvshow['_seasons'][_this._id] = _this;
                            defered.resolve(tvshow);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return Season
                 *
                 * @return promise
                 */
                getSeason : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : _this.tvshowid,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Season")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetSeasons(params)
                        .then(function (seasons) {
                            if (seasons[_this['season']]) {
                                var season = seasons[_this['season']];
                                _this._season = season;
                                season['_episodes'][_this._id] = _this;
                            }
                            defered.resolve(_this._season);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                }
            };

            return xbmcEpisode;
        }
    ]);

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

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Movie factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     * @require xbmcORMCollection Return orm collection
     */
    .factory('xbmcMovieEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcMovie() {

                var _this = this;

                _this._id;
                _this._genres = {};

                return _this;
            };

            /**
             * Add usefull movie method
             */
            xbmcMovie.prototype = {

                /**
                 * Return Movie detail
                 *
                 * @return promise
                 */
                getDetails: function () {
                    var params = {
                        movieid   : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Movie")
                    };

                    return xbmcIntrospection.introspection.VideoLibrary.GetMovieDetails(params);
                },

                /**
                 * Return genres
                 *
                 * @return promise
                 */
                getGenres : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        type      : 'movie',
                        properties: xbmcIntrospection.getTypeFields("Library.Fields.Genre")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetGenres(params)
                        .then(function (genres) {
                            var allGenresByLabelKey = genres.getByLabelKey();
                            var genresCollection = new xbmcORMCollection();

                            angular.forEach(_this.genre, function (genreLabel) {
                                if (allGenresByLabelKey[genreLabel]) {
                                    var genre = allGenresByLabelKey[genreLabel];

                                    _this._genres[genre._id] = genre;
                                    genresCollection.addItem(genre);
                                    genre['_movies'][_this._id] = _this;
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
                 * Play movie
                 *
                 * @return boolean
                 */
                play      : function () {
                    var params = {
                        playlistid: 1,
                        position  : 0,
                        item      : {
                            movieid: this._id
                        }
                    };

                    xbmcIntrospection.introspection.Playlist.Insert(params).then(function (data) {
                        if ('OK' == data.status) {
                            xbmcIntrospection.introspection.Player.Open({item: {playlistid: 1}}, false);
                        }
                    });

                    return true;
                }
            };

            return xbmcMovie;
        }
    ]);

'use strict';

// To the module xbmc, ...
angular.module('xbmc')
    .factory('xbmcPlayerEntity', ['$q', 'xbmcIntrospection', '$interval',
        function ($q, xbmcIntrospection, $interval) {

            function xbmcPlayer() {

                var _this = this;

                _this._id;
                _this._item = {};
                _this.interval;

                return _this;
            };

            xbmcPlayer.prototype = {
                getProperties: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        playerid: this._id,
                        properties: xbmcIntrospection.getTypeFields("Player.Property.Name")
                    };

                    xbmcIntrospection.introspection.Player.GetProperties(params)
                        .then(function(data) {
                            angular.extend(_this, data.result);
                            defered.resolve(_this);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },
                getItem: function () {
                    var _this = this;
                    var defered = $q.defer();

                    var params = {
                        playerid: _this.playerid,
                        properties: xbmcIntrospection.getTypeFields("List.Fields.All")
                    };

                    xbmcIntrospection.introspection.Player.GetItem(params)
                        .then(function (data) {
                            _this._item = data.result.item;
                            defered.resolve(_this._item);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },
                playPause: function() {
                    var _this = this;
                    var params = {
                        playerid: _this.playerid
                    };

                    xbmcIntrospection.introspection.Player.PlayPause(params, false);

                },
                onChangeSpeed: function (speed) {
                    var _this = this;

                    _this.speed = speed;

                    function updatePercentageFromTime () {
                        var timeInMillisecond = ((_this.time.hours * 60 * 60 * 1000) || 0) + ((_this.time.minutes * 60 * 1000) || 0) + ((_this.time.seconds * 1000) || 0) + (_this.time.milliseconds || 0);
                        var totaltimeInMillisecond = ((_this.totaltime.hours * 60 * 60 * 1000) || 0) + ((_this.totaltime.minutes * 60 * 1000) || 0) + ((_this.totaltime.seconds * 1000) || 0) + (_this.totaltime.milliseconds || 0);
                        _this.percentage = timeInMillisecond / totaltimeInMillisecond * 100;
                    }

                    function increaseTime () {
                        _this.time.seconds ++;
                        if (_this.time.seconds > 59) {
                            _this.time.seconds = 0;
                            _this.time.minutes ++;
                            if (_this.time.minutes > 59) {
                                _this.time.minutes = 0;
                                _this.time.hours ++;
                            }
                        }
                    }

                    if (_this.interval) {
                        if (_this.speed == 0) {
                            $interval.cancel(_this.interval);
                            _this.interval = undefined;
                        }
                    }
                    else {
                        _this.interval = $interval(function(){
                            increaseTime();
                            updatePercentageFromTime();
                        },1000);
                    }

                }
            };

            return xbmcPlayer;
        }
    ]);

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Season factory
     *
     * @require $q Promise for model request
     * @require xbmcIntrospection Get all xbmc available method
     * @require xbmcORMCollection Return orm collection
     */
    .factory('xbmcSeasonEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcSeason() {

                var _this = this;

                _this._id;
                _this._tvshow;
                _this._episodes = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcSeason.prototype = {

                /**
                 * Return TVShow detail
                 *
                 * @return promise
                 */
                getTVShow: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid: _this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.TVShow")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params)
                        .then(function(tvshow) {

                            _this._tvshow = tvshow;
                            tvshow['_seasons'][_this._id] = _this;
                            defered.resolve(tvshow);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return TVShow detail
                 *
                 * @return promise
                 */
                getEpisodes: function(params) {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid: this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Episode")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetEpisodes(params)
                        .then(function(episodes) {
                            var episodesCollection = new xbmcORMCollection();
                            angular.forEach(episodes, function(episode) {

                                _this._episodes[episode._id] = episode;
                                episodesCollection.addItem(episode);
                                episode['_tvshow'] = _this;
                            });
                            defered.resolve(episodesCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                }
            };

            return xbmcSeason;
        }
    ]);

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

'use strict';

angular.module('xbmc')
/**
 * Angular xbmc TVShow factory
 *
 * @require $q Promise for model request
 * @require xbmcIntrospection Get all xbmc available method
 * @require xbmcIntrospection Return orm collection
 */
    .factory('xbmcTvshowEntity', ['$q', 'xbmcIntrospection', 'xbmcORMCollection',
        function ($q, xbmcIntrospection, xbmcORMCollection) {

            function xbmcTvshow() {

                var _this = this;

                _this._id;
                _this._genres = {};
                _this._seasons = {};
                _this._episodes = {};

                return _this;
            };

            /**
             * Add usefull artist method
             */
            xbmcTvshow.prototype = {

                /**
                 * Return TVShow detail
                 *
                 * @return promise
                 */
                getDetails : function () {
                    var params = {
                        tvshowid  : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.TVShow")
                    };

                    return xbmcIntrospection.introspection.VideoLibrary.GetTVShowDetails(params);
                },

                /**
                 * Return genres
                 *
                 * @return promise
                 */
                getGenres  : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        type      : 'tvshow',
                        properties: xbmcIntrospection.getTypeFields("Library.Fields.Genre")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetGenres(params)
                        .then(function (genres) {
                            var allGenresByLabelKey = genres.getByLabelKey();
                            var genresCollection = new xbmcORMCollection();

                            angular.forEach(_this.genre, function (genreLabel) {
                                if (allGenresByLabelKey[genreLabel]) {
                                    var genre = allGenresByLabelKey[genreLabel];

                                    _this._genres[genre._id] = genre;
                                    genresCollection.addItem(genre);
                                    genre['_movies'][_this._id] = _this;
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
                 * Return season
                 *
                 * @return promise
                 */
                getSeasons : function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : _this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Season")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetSeasons(params)
                        .then(function (seasons) {
                            var seasonsCollection = new xbmcORMCollection();
                            angular.forEach(seasons, function (season) {

                                _this._seasons[season._id] = season;
                                seasonsCollection.addItem(season);
                                season['_tvshow'] = _this;
                            });
                            defered.resolve(seasonsCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                },

                /**
                 * Return episodes
                 *
                 * @return promise
                 */
                getEpisodes: function () {
                    var _this = this;
                    var defered = $q.defer();
                    var params = {
                        tvshowid  : this._id,
                        properties: xbmcIntrospection.getTypeFields("Video.Fields.Episode")
                    };

                    xbmcIntrospection.introspection.VideoLibrary.GetEpisodes(params)
                        .then(function (episodes) {
                            var episodesCollection = new xbmcORMCollection();
                            angular.forEach(episodes, function (episode) {

                                _this._episodes[episode._id] = episode;
                                episodesCollection.addItem(episode);
                                episode['_tvshow'] = _this;
                            });
                            defered.resolve(episodesCollection);
                        })
                        .catch(function (e) {
                            defered.reject(e);
                        });

                    return defered.promise;
                }
            };

            return xbmcTvshow;
        }
    ]);
'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Album repository
     *
     * @require xbmcArtistEntity The album model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcAlbumRepository', ['xbmcAlbumEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcAlbumEntity, xbmcCache, xbmcORMCollection) {
            var _this = this;

            var cache = xbmcCache.cache['albums'] = new xbmcORMCollection();

            _this.hydrate = function (data) {

                if (data.result.albums) {
                    return _this.createOrUpdateAlbums(data.result.albums);
                }
                else if (data.result.albumdetails) {
                    return _this.createOrUpdateAlbum(data.result.albumdetails);
                }
            }

            _this.createOrUpdateAlbum = function (value) {
                var album = cache[value.albumid] || new xbmcAlbumEntity();

                angular.extend(album, value);
                album._id = value.albumid;

                cache.addItem(album);

                return album;
            }

            _this.createOrUpdateAlbums = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcORMCollection;

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateAlbum(value));
                    });

                    return result;
                }
            }
        }
    ]);

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

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Episode repository
     *
     * @require xbmcEpisodeEntity The episode model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcEpisodeRepository', ['xbmcEpisodeEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcEpisodeEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['episodes'] = new xbmcORMCollection();

            _this.hydrate = function (data) {

                if (data.result.episodes) {
                    return _this.createOrUpdateEpisodes(data.result.episodes);
                }
                else if (data.result.episodedetails) {
                    return _this.createOrUpdateEpisode(data.result.episodedetails);
                }
            }

            _this.createOrUpdateEpisode = function (value) {
                var episode = cache[value.episodeid] || new xbmcEpisodeEntity();

                angular.extend(episode, value);
                episode._id = value.episodeid;

                cache.addItem(episode);

                return episode;
            }

            _this.createOrUpdateEpisodes = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcORMCollection();

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateEpisode(value));
                    });

                    return result;
                }
            }
        }
    ]);

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Genre repository
     *
     * @require xbmcGenreEntity The genre model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcGenreRepository', ['xbmcGenreEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcGenreEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['genres'] = new xbmcORMCollection();

            _this.hydrate = function (data) {

                if (data.result.genres) {
                    return _this.createOrUpdateGenres(data.result.genres);
                }
            }

            _this.createOrUpdateGenre = function (value) {
                var genre = cache[value.genreid] || new xbmcGenreEntity();

                angular.extend(genre, value);
                genre._id = value.genreid;

                cache.addItem(genre);

                return genre;
            }

            _this.createOrUpdateGenres = function (values) {

                if (angular.isArray(values)) {
                    var result = new xbmcORMCollection();

                    angular.forEach(values, function (value) {
                        result.addItem(_this.createOrUpdateGenre(value));
                    });

                    return result;
                }
            }
        }
    ]);

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Movie repository
     *
     * @require xbmcMovieEntity The movie model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcMovieRepository', ['xbmcMovieEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcMovieEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['movies'] = new xbmcORMCollection();

            _this.hydrate = function (data) {

                if (data.result.movies) {
                    return createOrUpdateMovies(data.result.movies);
                }
                else if (data.result.moviedetails) {
                    return createOrUpdateMovie(data.result.moviedetails);
                }
            }

            function createOrUpdateMovie(dataMovie) {
                var movie = cache[dataMovie.movieid] || new xbmcMovieEntity();

                angular.extend(movie, dataMovie);
                movie._id = dataMovie.movieid;

                cache.addItem(movie);

                return movie;
            }

            function createOrUpdateMovies(dataMovies) {

                if (angular.isArray(dataMovies)) {
                    var result = new xbmcORMCollection();

                    angular.forEach(dataMovies, function (dataMovie) {
                        result.addItem(createOrUpdateMovie(dataMovie));
                    });

                    return result;
                }
            }
        }
    ]);

'use strict';

angular.module('xbmc')
    .service('xbmcPlayerRepository', ['$rootScope', 'xbmcPlayerEntity', 'xbmcCache', 'xbmcORMCollection',
        function ($rootScope, xbmcPlayerEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['players'] = new xbmcORMCollection();

            _this.hydrate = function (data) {
                return _this.createOrUpdatePlayers(data.result);
            }

            _this.createOrUpdatePlayer = function (values) {
                var player = cache[values.playerid] || new xbmcPlayerEntity();

                angular.extend(player, values);
                player._id = values.playerid;

                cache.addItem(player);

                return player;
            }

            _this.createOrUpdatePlayers = function (result) {
                if (angular.isArray(result)) {
                    var collection = new xbmcORMCollection;

                    angular.forEach(result, function (values) {
                        collection.addItem(_this.createOrUpdatePlayer(values));
                    });

                    return collection;
                }
            }
            $rootScope.$on('websocket.Player.OnPlay', function (event, response) {
                if (response.params.data.player) {
                    var responsePlayer = response.params.data.player
                    if (cache[responsePlayer.playerid]) {
                        cache[responsePlayer.playerid].onChangeSpeed(responsePlayer.speed);
                    }
                }
            });
            $rootScope.$on('websocket.Player.OnPause', function (event, response) {
                if (response.params.data.player) {
                    var responsePlayer = response.params.data.player
                    if (cache[responsePlayer.playerid]) {
                        cache[responsePlayer.playerid].onChangeSpeed(responsePlayer.speed);
                    }
                }
            });

        }
    ]);

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc Season repository
     *
     * @require xbmcSeasonEntity The season model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcSeasonRepository', ['xbmcSeasonEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcSeasonEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['seasons'] = new xbmcORMCollection();

            _this.hydrate = function (data) {

                if (data.result.seasons) {
                    return _this.createOrUpdateSeasons(data.result.seasons);
                }
                else if (data.result.seasondetails) {
                    return _this.createOrUpdateSeason(data.result.seasondetails);
                }
            }

            _this.createOrUpdateSeason = function (dataSeason) {
                var season = cache[dataSeason.season] || new xbmcSeasonEntity();

                angular.extend(season, dataSeason);
                season._id = dataSeason.season;

                cache.addItem(season);

                return season;
            }

            _this.createOrUpdateSeasons = function (dataSeasons) {

                if (angular.isArray(dataSeasons)) {
                    var result = new xbmcORMCollection();

                    angular.forEach(dataSeasons, function (value) {
                        result.addItem(_this.createOrUpdateSeason(value));
                    });

                    return result;
                }
            }
        }
    ]);

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

'use strict';

angular.module('xbmc')
    /**
     * Angular xbmc TVShow repository
     *
     * @require xbmcTvshowEntity The TVShow model
     * @require xbmcCache Get xbmc cache
     * @require xbmcORMCollection Return orm collection
     */
    .service('xbmcTvshowRepository', ['xbmcTvshowEntity', 'xbmcCache', 'xbmcORMCollection',
        function (xbmcTvshowEntity, xbmcCache, xbmcORMCollection) {

            var _this = this;

            var cache = xbmcCache.cache['tvshows'] = new xbmcORMCollection();

            _this.hydrate = function (data) {

                if (data.result.tvshows) {
                    return _this.createOrUpdateTvshows(data.result.tvshows);
                }
                else if (data.result.tvshowdetails) {
                    return _this.createOrUpdateTvshow(data.result.tvshowdetails);
                }
            }

            _this.createOrUpdateTvshow = function (dataTvshow) {
                var tvshow = cache[dataTvshow.tvshowid] || new xbmcTvshowEntity();

                angular.extend(tvshow, dataTvshow);
                tvshow._id = dataTvshow.tvshowid;

                cache.addItem(tvshow);

                return tvshow;
            }

            _this.createOrUpdateTvshows = function (dataTvshows) {

                if (angular.isArray(dataTvshows)) {
                    var result = new xbmcORMCollection();

                    angular.forEach(dataTvshows, function (dataTvshow) {
                        result.addItem(_this.createOrUpdateTvshow(dataTvshow));
                    });

                    return result;
                }
            }
        }
    ]);
