/* tslint:disable:no-console */
import { tsquery } from '@phenomnomnominal/tsquery';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import ts from 'typescript';

export const PROJECT_FILE_PATTERN = './src/**/*.{ts,tsx}';
export const TRANSLATION_FILE_PATTERN = './src/translations/lang/*.json';
const TRANSLATE_FUNCTIONS = ['translateRaw', 'translate', 'translateMarker'];
const JSX_ELEMENTS_WITH_PROP: [string, string][] = [['Trans', 'id']];

const replaceApostrophe = (s: string) => s.replace(/'/g, '').replace(/`/g, '').replace(/"/g, '');

const findCallExpressions = (node: ts.Node, functionName: string): ts.CallExpression[] => {
  const functionsQuery = `CallExpression:has(Identifier[name="${functionName}"]):not(:has(PropertyAccessExpression))`;
  return tsquery(node, functionsQuery, { visitAllChildren: true });
};

const findIinsideTemplateCallExpressions = (
  node: ts.Node,
  functionName: string
): ts.CallExpression[] => {
  const insideTemplateQuery = `JsxExpression CallExpression:has(Identifier[name="${functionName}"])`;
  return tsquery(node, insideTemplateQuery, { visitAllChildren: true });
};

const findJxsElementExpressions = (
  node: ts.Node,
  identifierArray: [string, string]
): ts.StringLiteral[] => {
  const query = `JsxSelfClosingElement:has(Identifier[name="${identifierArray[0]}"]) JsxAttribute:has(Identifier[name="${identifierArray[1]}"]) StringLiteral`;
  return tsquery(node, query, { visitAllChildren: true });
};

const findAllStringLiterals = (node: ts.Node): ts.StringLiteral[] => {
  const query = `StringLiteral`;
  return tsquery(node, query, { visitAllChildren: true });
};

const getStringFromExpression = (expression: ts.Node) => {
  const text = expression.getText();

  if (
    text &&
    typeof text === 'string' &&
    text.toUpperCase() === text &&
    /^[0-9]*[`'"][A-Z][A-Z0-9_'"`]*$/.test(text) // Ignore only digits
  ) {
    return [text];
  }
  return [];
};

const getFilesMatchingPattern = (pattern: string) =>
  glob.sync(pattern).filter((filePath: string) => {
    return fs.statSync(filePath).isFile();
  });

export const translationKeysExtract = (projectFilePattern = PROJECT_FILE_PATTERN) => {
  console.log('Extracting... ');

  const files = getFilesMatchingPattern(path.resolve(projectFilePattern));
  let keys: string[] = [];

  files.forEach((filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const ast = tsquery.ast(fileContent, 'filePath', ts.ScriptKind.TSX);

    const callExpressions = TRANSLATE_FUNCTIONS.map((transFunc) => [
      ...findCallExpressions(ast, transFunc),
      ...findIinsideTemplateCallExpressions(ast, transFunc)
    ]).flat();

    if (callExpressions.length) {
      callExpressions.forEach((callExpression) => {
        const [firstArg] = callExpression.arguments;
        if (!firstArg) {
          return;
        }
        keys = [...keys, ...getStringFromExpression(firstArg)];
      });
    }

    const jsxExpressions = JSX_ELEMENTS_WITH_PROP.map((identifierArray) =>
      findJxsElementExpressions(ast, identifierArray)
    ).flat();

    if (jsxExpressions.length) {
      jsxExpressions.forEach((callExpression) => {
        keys = [...keys, ...getStringFromExpression(callExpression)];
      });
    }
  });

  // Get unique object
  return [...new Set(keys)]
    .map((k) => replaceApostrophe(k))
    .filter((k) => k.length)
    .reduce((acc, item) => ({ ...acc, [item]: '' }), {});
};

export const getJsonKeys = (translationFilePattern = TRANSLATION_FILE_PATTERN) => {
  const translationFilePaths = getFilesMatchingPattern(path.resolve(translationFilePattern));
  return translationFilePaths.map((translationFilePath: string) => {
    const translationFileJson = JSON.parse(fs.readFileSync(translationFilePath, 'utf-8'));

    const translationJson = translationFileJson.data;
    return Object.keys(translationJson);
  });
};

export const findTranslationKeys = (
  projectFilePattern = PROJECT_FILE_PATTERN,
  jsonKeys: string[]
) => {
  const files = getFilesMatchingPattern(path.resolve(projectFilePattern));
  let keys: string[] = [];

  files.forEach((filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const ast = tsquery.ast(fileContent, 'filePath', ts.ScriptKind.TSX);

    const stringLiterals = findAllStringLiterals(ast);

    const strings = stringLiterals.map((s) => s.text);

    const matchedStrings = strings.filter((s) => jsonKeys.includes(s));

    keys = [...keys, ...matchedStrings];
  });

  return [...new Set(keys)];
};

export const updateJsonTranslations = (
  translated: { [name: string]: string },
  translationFilePattern = TRANSLATION_FILE_PATTERN
) => {
  console.log(`Found ${Object.keys(translated).length} translation keys`);
  console.log('Updating translations...');

  const translationFilePaths = getFilesMatchingPattern(path.resolve(translationFilePattern));
  translationFilePaths.forEach((translationFilePath: string) => {
    const translationFileJson = JSON.parse(fs.readFileSync(translationFilePath, 'utf-8'));

    const translationJson = {
      ...translated,
      ...translationFileJson.data
    };
    translationFileJson.data = Object.keys(translationJson)
      .map((k) => replaceApostrophe(k))
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: translationJson[key] || '' }), {});

    fs.writeFileSync(translationFilePath, JSON.stringify(translationFileJson, null, '\t'));
    console.log(`File ${path.basename(translationFilePath)} updated`);
  });
};

// Since this is a script, it should't fire when running jest tests
if (typeof process.env.JEST_WORKER_ID !== 'string') {
  updateJsonTranslations(translationKeysExtract());
}
