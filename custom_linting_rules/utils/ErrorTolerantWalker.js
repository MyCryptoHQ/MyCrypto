"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
/**
 * A base walker class that gracefully handles unexpected errors.
 * Errors are often thrown when the TypeChecker is invoked.
 */
var ErrorTolerantWalker = /** @class */ (function (_super) {
    __extends(ErrorTolerantWalker, _super);
    function ErrorTolerantWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorTolerantWalker.prototype.visitNode = function (node) {
        try {
            _super.prototype.visitNode.call(this, node);
        }
        catch (e) {
            // turn this on when trying out new rules on foreign codebases
            if (ErrorTolerantWalker.DEBUG) {
                var msg = 'An error occurred visiting a node.'
                    + '\nWalker: ' + this.getClassName()
                    + '\nNode: ' + (node.getFullText ? node.getFullText() : '<unknown>')
                    + '\n' + e;
                this.addFailureAt(node.getStart ? node.getStart() : 0, node.getWidth ? node.getWidth() : 0, msg);
            }
        }
    };
    ErrorTolerantWalker.prototype.getClassName = function () {
        // Some versions of IE have the word "function" in the constructor name and
        // have the function body there as well. This rips out and returns the function name.
        var result = this.constructor.toString().match(/function\s+([\w\$]+)\s*\(/)[1] || '';
        if (result == null || result.length === 0) {
            throw new Error('Could not determine class name from input: ' + this.constructor.toString());
        }
        return result;
    };
    ErrorTolerantWalker.DEBUG = false;
    return ErrorTolerantWalker;
}(Lint.RuleWalker));
exports.ErrorTolerantWalker = ErrorTolerantWalker;
