const { tsquery } = require('@phenomnomnominal/tsquery');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const PROJECT_FILE_PATTERN = './common/**/*.{ts,tsx}';
const TRANSLATION_FILE_PATTERN = './common/v2/translations/lang/*.json';
const TRANSLATE_FUNCTIONS = ['translateRaw', 'translate'];

const findCallExpressions = (node, functionName) => {
  const query = `CallExpression:has(Identifier[name="${functionName}"])`;
  return tsquery(node, query, { visitAllChildren: true });
};

/* Get only upper case expressions */
const getStringFromCallExpression = expression => {
  if (expression.text &&
    typeof expression.text === 'string' &&
    expression.text.toUpperCase() === expression.text &&
    !/[0-9]+/.test(expression.text) // Ignore css translate
  ) {
    return [expression.text];
  }
  return [];
};

const getFilesMatchingPattern = pattern => glob.sync(pattern).filter((filePath) => {
  return fs.statSync(filePath).isFile();
});

const extract = () => {
  console.log('Extracting... ');

  let files = getFilesMatchingPattern(path.resolve(PROJECT_FILE_PATTERN));
  let keys = [];

  files.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const ast = tsquery.ast(fileContent, 'filePath', 4 /*ScriptKind.TSX*/);

    const callExpressions = TRANSLATE_FUNCTIONS.map(transFunc => findCallExpressions(ast, transFunc)).flat();

    if (callExpressions.length) {
      callExpressions.forEach((callExpression) => {
        const [firstArg] = callExpression.arguments;
        if (!firstArg) {
          return;
        }
        keys = [...keys, ...getStringFromCallExpression(firstArg)];
      });
    }
  });

  // Get unique object
  return [...new Set(keys)]
    .filter(k => k.length)
    .reduce((acc, item) => ({...acc, [item]: ''}), {});
};

const updateTranslations = (translated) => {
  console.log(`Found ${Object.keys(translated).length} translation keys`);
  console.log('Updating translations...');

  let translationFilePaths = getFilesMatchingPattern(path.resolve(TRANSLATION_FILE_PATTERN));
  translationFilePaths.forEach(translationFilePath => {
    // Read file as JSON
    const translationFileJson = require(translationFilePath);

    Object.assign(translated, translationFileJson.data);
    translationFileJson.data = Object.keys(translated)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: translated[key] }), {});

    fs.writeFileSync(translationFilePath, JSON.stringify(translationFileJson, null, '\t'));
    console.log(`File ${path.basename(translationFilePath)} updated`)
  });
};

updateTranslations(extract());
