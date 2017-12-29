"use strict";
exports.__esModule = true;
/**
 * Control flow functions.
 */
/* tslint:disable:no-increment-decrement */
var Utils;
(function (Utils) {
    /**
     * Logical 'any' or 'exists' function.
     */
    function exists(list, predicate) {
        if (list != null) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (predicate(obj)) {
                    return true;
                }
            }
        }
        return false;
    }
    Utils.exists = exists;
    /**
     * A contains function.
     */
    function contains(list, element) {
        return exists(list, function (item) {
            return item === element;
        });
    }
    Utils.contains = contains;
    /**
     * A removeAll function.
     */
    function removeAll(source, elementsToRemove) {
        if (source == null || source.length === 0) {
            return [];
        }
        if (elementsToRemove == null || elementsToRemove.length === 0) {
            return [].concat(source); // be sure to return a copy of the array
        }
        return source.filter(function (sourceElement) {
            return !contains(elementsToRemove, sourceElement);
        });
    }
    Utils.removeAll = removeAll;
    /**
     * A remove() function.
     */
    function remove(source, elementToRemove) {
        return removeAll(source, [elementToRemove]);
    }
    Utils.remove = remove;
    function trimTo(source, maxLength) {
        if (source == null) {
            return '';
        }
        if (source.length <= maxLength) {
            return source;
        }
        return source.substr(0, maxLength - 2) + '...';
    }
    Utils.trimTo = trimTo;
})(Utils = exports.Utils || (exports.Utils = {}));
/* tslint:enable:no-increment-decrement */ 
