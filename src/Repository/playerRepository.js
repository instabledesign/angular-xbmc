'use strict';

angular.module('xbmc')
    .service('xbmcPlayerRepository', ['$rootScope', 'xbmcPlayerEntity', 'xbmcCache', 'xbmcCollection',
        function ($rootScope, xbmcPlayerEntity, xbmcCache, xbmcCollection) {

            var _this = this;

            var cache = xbmcCache.cache['players'] = new xbmcCollection();

            _this.canHydrate = function (data) {
                var canHydrate = false;
                if (angular.isArray(data.result)) {
                    for (var id in data.result) {
                        canHydrate = data.result[id].playerid != undefined
                    }
                }

                return canHydrate;
            };

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
                    var collection = new xbmcCollection;

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
