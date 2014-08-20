'use strict';

angular.module('xbmc')
/**
 * Angular xbmc cache service
 *
 * @return mixed Return a cached value
 */
    .service('xbmcCache', [
        function () {

            var _this = this,
                requestsById = {},
                requestsByMD5 = {},
                responsesById = {},
                notifications = {};

            _this.addRequest = function (request, force) {
                indexRequestById(request);
                indexRequestByMD5(request, force);
            };

            function indexRequestById(request) {
                _this.hasRequestId(request.id);

                requestsById[request.id] = request;
            }

            function indexRequestByMD5(request, force) {
                try {
                    _this.hasRequestMD5(request.md5);
                }
                catch (error) {
                    if (!force) {
                        throw error;
                    }

                    request.defer.notify(error + ' Force option will continue.');
                }

                requestsByMD5[request.md5] = request;
            }

            _this.hasRequest = function (request) {
                return _this.hasRequestId(request.id) || _this.hasRequestMD5(request.md5);
            };

            _this.hasRequestId = function (id) {
                return requestsById.hasOwnProperty(id);
            };

            _this.hasRequestMD5 = function (md5) {
                return requestsByMD5.hasOwnProperty(md5);
            };

            _this.getRequests = function () {
                return requestsById;
            };

            _this.getRequestById = function (id) {
                return _this.hasRequestId(id) ? requestsById[id] : null;
            };

            _this.getRequestByMD5 = function (md5) {
                return _this.hasRequestMD5(md5) ? requestsByMD5[md5] : null;
            };

            _this.addResponse = function (response) {
                responsesById[response.id] = response;
            };

            _this.hasResponse = function (response) {
                return _this.hasResponseById(response.id);
            };

            _this.hasResponseById = function (id) {
                return responsesById.hasOwnProperty(id);
            };

            _this.getResponses = function () {
                return responsesById;
            };

            _this.getResponseById = function (id) {
                return _this.hasResponseById(id) ? responsesById[id] : null;
            };

            _this.addNotification = function (notification) {
                notifications[new Date().getTime()] = notification;
            };

            _this.getNotifications = function () {
                return notifications;
            };
        }
    ]);
