import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ErrorTolerantWalker } from '../node_modules/tslint-microsoft-contrib/utils/ErrorTolerantWalker';
import { ExtendedMetadata } from '../node_modules/tslint-microsoft-contrib/utils/ExtendedMetadata';
import { Utils } from '../node_modules/tslint-microsoft-contrib/utils/Utils';

import {
  getJsxAttributesFromJsxElement,
  getStringLiteral,
  isEmpty
} from '../node_modules/tslint-microsoft-contrib/utils/JsxAttribute';

const FAILURE_STRING = 'Anchor tags with an external link must use https';

/**
 * Implementation of the no-external-http-link rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
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

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
      return this.applyWithWalker(new NoExternalHttpLinkRuleWalker(sourceFile, this.getOptions()));
    } else {
      return [];
    }
  }
}

class NoExternalHttpLinkRuleWalker extends ErrorTolerantWalker {
  protected visitJsxElement(node: ts.JsxElement): void {
    const openingElement: ts.JsxOpeningElement = node.openingElement;
    this.validateOpeningElement(openingElement);
    super.visitJsxElement(node);
  }

  protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
    this.validateOpeningElement(node);
    super.visitJsxSelfClosingElement(node);
  }

  private validateOpeningElement(openingElement: ts.JsxOpeningLikeElement): void {
    if (openingElement.tagName.getText() === 'a') {
      const allAttributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(
        openingElement
      );
      const href: ts.JsxAttribute = allAttributes.href;
      if (
        href !== null &&
        !isSafeHrefAttributeValue(href) &&
        getStringLiteral(href) !== 'undefined'
      ) {
        this.addFailureAt(openingElement.getStart(), openingElement.getWidth(), FAILURE_STRING);
      }
    }
  }
}

function isSafeHrefAttributeValue(attribute: ts.JsxAttribute): boolean {
  if (isEmpty(attribute)) {
    return false;
  }

  if (attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
    const expression: ts.JsxExpression = <ts.JsxExpression>attribute.initializer;
    if (
      expression.expression !== null &&
      expression.expression.kind !== ts.SyntaxKind.StringLiteral
    ) {
      return true; // attribute value is not a string literal, so do not validate
    }
  }

  const stringValue = getStringLiteral(attribute);
  if (stringValue === '#') {
    return true;
  } else if (stringValue === null || stringValue.length === 0) {
    return false;
  }

  return stringValue.indexOf('https://') >= 0;
}
