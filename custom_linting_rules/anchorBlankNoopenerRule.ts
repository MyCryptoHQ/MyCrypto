import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ErrorTolerantWalker } from './utils/ErrorTolerantWalker';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { Utils } from './utils/Utils';

import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';

const FAILURE_STRING: string =
  'Anchor tags with target="_blank" should also include rel="noopener noreferrer"';

/**
 * Implementation of the react-anchor-blank-noopener rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'react-anchor-blank-noopener',
    type: 'functionality',
    description: 'Anchor tags with target="_blank" should also include rel="noopener noreferrer"',
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
      return this.applyWithWalker(
        new ReactAnchorBlankNoopenerRuleWalker(sourceFile, this.getOptions())
      );
    } else {
      return [];
    }
  }
}

class ReactAnchorBlankNoopenerRuleWalker extends ErrorTolerantWalker {
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
      /* tslint:disable:no-string-literal */
      const target: ts.JsxAttribute = allAttributes['target'];
      const rel: ts.JsxAttribute = allAttributes['rel'];
      /* tslint:enable:no-string-literal */
      if (target != null && getStringLiteral(target) === '_blank' && !isRelAttributeValue(rel)) {
        this.addFailureAt(openingElement.getStart(), openingElement.getWidth(), FAILURE_STRING);
      }
    }
  }
}

function isRelAttributeValue(attribute: ts.JsxAttribute): boolean {
  if (isEmpty(attribute)) {
    return false;
  }

  if (attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
    const expression: ts.JsxExpression = <ts.JsxExpression>attribute.initializer;
    if (
      expression.expression != null &&
      expression.expression.kind !== ts.SyntaxKind.StringLiteral
    ) {
      return true; // attribute value is not a string literal, so do not validate
    }
  }

  const stringValue = getStringLiteral(attribute);
  if (stringValue == null || stringValue.length === 0) {
    return false;
  }

  const relValues: string[] = stringValue.split(/\s+/);
  return Utils.contains(relValues, 'noreferrer') && Utils.contains(relValues, 'noopener');
}
