import * as ts from 'typescript';

/**
 * TypeScript 2.0 will have more features to support type guard.
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 * We could avoid 'as' cast if switching to 2.0
 */

export function isJsxAttribute(node: ts.Node): node is ts.JsxAttribute {
  return node && node.kind === ts.SyntaxKind.JsxAttribute;
}

export function isJsxSpreadAttribute(node: ts.Node): node is ts.JsxSpreadAttribute {
  return node && node.kind === ts.SyntaxKind.JsxSpreadAttribute;
}

export function isJsxExpression(node: ts.Node): node is ts.JsxExpression {
  return node && node.kind === ts.SyntaxKind.JsxExpression;
}

/**
 * There is no type of NumericLiteral in typescript, guarded as LiteralExpression.
 */
export function isNumericLiteral(node: ts.Node): node is ts.LiteralExpression {
  return node && node.kind === ts.SyntaxKind.NumericLiteral;
}

export function isStringLiteral(node: ts.Node): node is ts.StringLiteral {
  return node && node.kind === ts.SyntaxKind.StringLiteral;
}

export function isJsxElement(node: ts.Node): node is ts.JsxElement {
  return node && node.kind === ts.SyntaxKind.JsxElement;
}

export function isJsxSelfClosingElement(node: ts.Node): node is ts.JsxSelfClosingElement {
  return node && node.kind === ts.SyntaxKind.JsxSelfClosingElement;
}

export function isJsxOpeningElement(node: ts.Node): node is ts.JsxOpeningElement {
  return node && node.kind === ts.SyntaxKind.JsxOpeningElement;
}

export function isTrueKeyword(node: ts.Node): node is ts.LiteralExpression {
  return node && node.kind === ts.SyntaxKind.TrueKeyword;
}
export function isFalseKeyword(node: ts.Node): node is ts.LiteralExpression {
  return node && node.kind === ts.SyntaxKind.FalseKeyword;
}
export function isNullKeyword(node: ts.Node): node is ts.LiteralExpression {
  return node && node.kind === ts.SyntaxKind.NullKeyword;
}
