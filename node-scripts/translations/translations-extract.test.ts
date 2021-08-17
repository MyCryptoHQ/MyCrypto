import fs from 'fs';

import excludedTranslationKeys from './excludedTranslationKeys.json';
import {
  findTranslationKeys,
  getJsonKeys,
  PROJECT_FILE_PATTERN,
  translationKeysExtract,
  updateJsonTranslations
} from './translations-extract';

const BASE_DIR = 'node-scripts/translations/__mocks__/';
const MOCKS_FILE_PATTERN = `${BASE_DIR}**/*.{ts,tsx}`;

const JSON_MOCK_FILE_PATH = `${BASE_DIR}sample.json`;
const JSON_MOCK_EMPTY_FIXTURE = {
  code: 'sample',
  data: {}
};

const TRANSLATE_KEYS_FIXTURE = [
  'TRANSLATE_TEST_1',
  'TRANSLATE_TEST_2',
  'TRANSLATE_TEST_3',
  'TRANSLATE_TEST_4',
  'TRANSLATE_TEST_5',
  'TRANSLATE_TEST_6'
];

const writeFile = (filePath: string, json: any) =>
  fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'));
const readFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const deleteFile = (filePath: string) => fs.unlinkSync(filePath);

describe('Translations extract', () => {
  it('Should extract keys', () => {
    const extractedKeys = translationKeysExtract(MOCKS_FILE_PATTERN);
    expect(extractedKeys).toStrictEqual(
      TRANSLATE_KEYS_FIXTURE.reduce(
        (acc, key) => ({
          ...acc,
          [key]: ''
        }),
        {}
      )
    );
  });

  it('Check that all translation keys are in-use', () => {
    const extractedKeys = Object.keys(translationKeysExtract(PROJECT_FILE_PATTERN));
    const jsonKeys = getJsonKeys();
    jsonKeys.forEach((language) => {
      const matchedKeys = findTranslationKeys(PROJECT_FILE_PATTERN, language);
      const keysInUse = [
        ...new Set([...extractedKeys, ...matchedKeys, ...excludedTranslationKeys])
      ];
      expect(keysInUse.sort()).toStrictEqual(language.sort());
    });
  });

  it('Should create json and update it', () => {
    // Write empty file
    writeFile(JSON_MOCK_FILE_PATH, JSON_MOCK_EMPTY_FIXTURE);
    const emptyFile = readFile(JSON_MOCK_FILE_PATH);
    expect(Object.keys(emptyFile.data)).toHaveLength(0);

    // Write keys with empty values
    const translationObjEmptyKeys = TRANSLATE_KEYS_FIXTURE.slice(1).reduce(
      (acc, key) => ({
        ...acc,
        [key]: ''
      }),
      {}
    );
    updateJsonTranslations(translationObjEmptyKeys, JSON_MOCK_FILE_PATH);
    expect(readFile(JSON_MOCK_FILE_PATH).data).toStrictEqual(translationObjEmptyKeys);

    // Write keys with values
    const translationObjValueKeys = TRANSLATE_KEYS_FIXTURE.slice(1).reduce(
      (acc, key) => ({
        ...acc,
        [key]: 'Value'
      }),
      {}
    );
    writeFile(JSON_MOCK_FILE_PATH, {
      ...JSON_MOCK_EMPTY_FIXTURE,
      data: { ...translationObjValueKeys }
    });

    // Should keep the values with empty object keys
    updateJsonTranslations(translationObjEmptyKeys, JSON_MOCK_FILE_PATH);
    expect(readFile(JSON_MOCK_FILE_PATH).data).toStrictEqual(translationObjValueKeys);

    // Should keep the values with empty object
    updateJsonTranslations({}, JSON_MOCK_FILE_PATH);
    expect(readFile(JSON_MOCK_FILE_PATH).data).toStrictEqual(translationObjValueKeys);

    // Add key
    const translationObjUpdate = TRANSLATE_KEYS_FIXTURE.slice(0, 1).reduce(
      (acc, key) => ({
        ...acc,
        [key]: 'Value'
      }),
      {}
    );

    // Should add new key
    updateJsonTranslations(translationObjUpdate, JSON_MOCK_FILE_PATH);
    expect(readFile(JSON_MOCK_FILE_PATH).data).toStrictEqual({
      ...translationObjUpdate,
      ...translationObjValueKeys
    });
  });

  afterAll(() => {
    deleteFile(JSON_MOCK_FILE_PATH);
  });
});
