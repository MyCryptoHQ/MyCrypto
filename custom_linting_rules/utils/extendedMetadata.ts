import * as Lint from 'tslint';

/**
 * Additional information that each rule must specify.
 */
export interface ExtendedMetadata extends Lint.IRuleMetadata {
  issueClass: IssueClass;
  issueType: IssueType;
  severity: Severity;
  level: Level;
  group: Group;
  recommendation?: string;
  commonWeaknessEnumeration?: string;
}

/**
 * The Security Development Lifecycle defines many rules: https://www.microsoft.com/en-us/sdl/
 * SDL - Use this value if the rule is based on an SDL recommendation.
 * Non-SDL - Use this value when you want a rule to show up in Microsoft's Warnings Central
 * Ignored - Use this value to exclude the rule from Warnings Central
 */
export type IssueClass = 'SDL' | 'Non-SDL' | 'Ignored';
export type IssueType = 'Error' | 'Warning';
export type Severity = 'Critical' | 'Important' | 'Moderate' | 'Low';

/**
 * Mandatory - This means that all teams should be using this rule with no exceptions.
 * Opportunity for Excellence - This means that we recommend using the rule.
 */
export type Level = 'Mandatory' | 'Opportunity for Excellence';

/**
 * Ignored - Use this value to exclude the rule from recommended_ruleset.js and the deployed tslint.json file.
 */
export type Group =
  | 'Ignored'
  | 'Security'
  | 'Correctness'
  | 'Accessibility'
  | 'Clarity'
  | 'Whitespace'
  | 'Configurable'
  | 'Deprecated';
