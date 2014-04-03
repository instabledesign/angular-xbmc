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
