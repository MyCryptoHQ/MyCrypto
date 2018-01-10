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
var ts = require("typescript");
var Lint = require("tslint");
var ErrorTolerantWalker_1 = require("../node_modules/tslint-microsoft-contrib/utils/ErrorTolerantWalker");
var JsxAttribute_1 = require("../node_modules/tslint-microsoft-contrib/utils/JsxAttribute");
var FAILURE_STRING = 'Anchor tags with an external link must use https';
/**
 * Implementation of the no-external-http-link rule.
 */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new NoExternalHttpLinkRuleWalker(sourceFile, this.getOptions()));
        }
        else {
            return [];
        }
    };
    Rule.metadata = {
        ruleName: 'tno-external-http-link',
        type: 'functionality',
        description: 'Anchor tags with an external link must use https',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '242,676'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoExternalHttpLinkRuleWalker = /** @class */ (function (_super) {
    __extends(NoExternalHttpLinkRuleWalker, _super);
    function NoExternalHttpLinkRuleWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoExternalHttpLinkRuleWalker.prototype.visitJsxElement = function (node) {
        var openingElement = node.openingElement;
        this.validateOpeningElement(openingElement);
        _super.prototype.visitJsxElement.call(this, node);
    };
    NoExternalHttpLinkRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.validateOpeningElement(node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    NoExternalHttpLinkRuleWalker.prototype.validateOpeningElement = function (openingElement) {
        if (openingElement.tagName.getText() === 'a') {
            var allAttributes = JsxAttribute_1.getJsxAttributesFromJsxElement(openingElement);
            var href = allAttributes.href;
            if (href !== null && !isSafeHrefAttributeValue(href) && JsxAttribute_1.getStringLiteral(href) !== 'undefined') {
                this.addFailureAt(openingElement.getStart(), openingElement.getWidth(), FAILURE_STRING);
            }
        }
    };
    return NoExternalHttpLinkRuleWalker;
}(ErrorTolerantWalker_1.ErrorTolerantWalker));
function isSafeHrefAttributeValue(attribute) {
    if (JsxAttribute_1.isEmpty(attribute)) {
        return false;
    }
    if (attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
        var expression = attribute.initializer;
        if (expression.expression !== null &&
            expression.expression.kind !== ts.SyntaxKind.StringLiteral) {
            return true; // attribute value is not a string literal, so do not validate
        }
    }
    var stringValue = JsxAttribute_1.getStringLiteral(attribute);
    if (stringValue === '#') {
        return true;
    }
    else if (stringValue === null || stringValue.length === 0) {
        return false;
    }
    return stringValue.indexOf('https://') >= 0;
}
