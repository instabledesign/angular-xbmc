'use strict';

angular.module('xbmc')
/**
 * ORM collection factory
 *
 * @return xbmcCollection
 */
    .factory('xbmcCollection', [
        function () {

            function xbmcCollection() {
                return this;
            }

            xbmcCollection.prototype.addItem = function (item) {
                this[item._id] = item;
            }

            xbmcCollection.prototype.removeItem = function (item) {
                if (this[item._id]) {
                    delete this[item._id];
                }
            }

            // TODO : Decoupling with a decorator ?
            xbmcCollection.prototype.getByLabelKey = function () {
                var allItemsByLabelKey = {};
                angular.forEach(this, function (item) {
                    allItemsByLabelKey[item.label] = item;
                });

                return allItemsByLabelKey;
            }

            //TODO : Decoupling with a filter decorator ?
            xbmcCollection.prototype.filter = function (filter) {
                var filteredItems = [];
                angular.forEach(this, function (item) {
                    var regExp = new RegExp(filter);
                    if (regExp.test(item.label)) {
                        filteredItems.push(item);
                    }
                });

                return filteredItems;
            }

            return xbmcCollection;
        }
    ]);
