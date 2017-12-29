"use strict";
exports.__esModule = true;
var ts = require("typescript");
/**
 * TypeScript 2.0 will have more features to support type guard.
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 * We could avoid 'as' cast if switching to 2.0
 */
function isJsxAttribute(node) {
    return node && node.kind === ts.SyntaxKind.JsxAttribute;
}
exports.isJsxAttribute = isJsxAttribute;
function isJsxSpreadAttribute(node) {
    return node && node.kind === ts.SyntaxKind.JsxSpreadAttribute;
}
exports.isJsxSpreadAttribute = isJsxSpreadAttribute;
function isJsxExpression(node) {
    return node && node.kind === ts.SyntaxKind.JsxExpression;
}
exports.isJsxExpression = isJsxExpression;
/**
 * There is no type of NumericLiteral in typescript, guarded as LiteralExpression.
 */
function isNumericLiteral(node) {
    return node && node.kind === ts.SyntaxKind.NumericLiteral;
}
exports.isNumericLiteral = isNumericLiteral;
function isStringLiteral(node) {
    return node && node.kind === ts.SyntaxKind.StringLiteral;
}
exports.isStringLiteral = isStringLiteral;
function isJsxElement(node) {
    return node && node.kind === ts.SyntaxKind.JsxElement;
}
exports.isJsxElement = isJsxElement;
function isJsxSelfClosingElement(node) {
    return node && node.kind === ts.SyntaxKind.JsxSelfClosingElement;
}
exports.isJsxSelfClosingElement = isJsxSelfClosingElement;
function isJsxOpeningElement(node) {
    return node && node.kind === ts.SyntaxKind.JsxOpeningElement;
}
exports.isJsxOpeningElement = isJsxOpeningElement;
function isTrueKeyword(node) {
    return node && node.kind === ts.SyntaxKind.TrueKeyword;
}
exports.isTrueKeyword = isTrueKeyword;
function isFalseKeyword(node) {
    return node && node.kind === ts.SyntaxKind.FalseKeyword;
}
exports.isFalseKeyword = isFalseKeyword;
function isNullKeyword(node) {
    return node && node.kind === ts.SyntaxKind.NullKeyword;
}
exports.isNullKeyword = isNullKeyword;
