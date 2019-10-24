import React from 'react';
import { ConfigState } from 'features/config/types';
import { loadStatePropertyOrEmptyObject } from 'utils/localStorage';
import TranslateMarkdown from 'components/Translate';

const fallbackLanguage = 'en';
const repository: {
  [language: string]: {
    [translationName: string]: string;
  };
} = {};

interface ILanguage {
  code: string;
  data: {
    [translationName: string]: string;
  };
}

const languages: ILanguage[] = [
  require('./lang/en.json'),
  require('./lang/de.json'),
  require('./lang/el.json'),
  require('./lang/es.json'),
  require('./lang/fi.json'),
  require('./lang/fr.json'),
  require('./lang/ht.json'),
  require('./lang/hu.json'),
  require('./lang/id.json'),
  require('./lang/it.json'),
  require('./lang/ja.json'),
  require('./lang/nl.json'),
  require('./lang/no.json'),
  require('./lang/pl.json'),
  require('./lang/pt.json'),
  require('./lang/ru.json') /*sk, sl, sv */,
  require('./lang/ko.json'),
  require('./lang/tr.json'),
  require('./lang/vi.json'),
  require('./lang/zhcn.json'),
  require('./lang/zhtw.json')
];

languages.forEach(l => {
  repository[l.code] = l.data;
});

export function getTranslators() {
  return [
    'TranslatorName_1',
    'TranslatorName_2',
    'TranslatorName_3',
    'TranslatorName_4',
    'TranslatorName_5'
  ].filter(x => {
    const translated = translateRaw(x);
    return !!translated;
  });
}

export type TranslatedText = React.ReactElement<any> | string;

export function translateRaw(key: string, variables?: { [name: string]: string }): string {
  // redux store isn't initialized in time which throws errors, instead we get the language selection from localstorage
  const lsConfig = loadStatePropertyOrEmptyObject('config');
  const language = !!lsConfig ? (lsConfig as ConfigState).meta.languageSelection : fallbackLanguage;
  const translatedString =
    (repository[language] && repository[language][key]) || repository[fallbackLanguage][key] || key;

  /** @desc In RegExp, $foo is two "words", but __foo is only one "word."
   *  Replace all occurences of '$' with '__' in the entire string and each variable,
   *  then iterate over each variable, replacing the '__variable' in the
   *  translation key with the variable's value.
   */
  if (variables) {
    let str = translatedString.replace(/\$/g, '__');

    Object.keys(variables).forEach(variable => {
      const singleWordVariable = variable.replace(/\$/g, '__');
      const re = new RegExp(`\\b${singleWordVariable}\\b`, 'g');

      str = str.replace(re, variables[variable]);
    });

    return str;
  }

  return translatedString;
}

export function translate(
  key: string,
  variables?: { [name: string]: string }
): React.ReactElement<any> {
  return <TranslateMarkdown source={translateRawV2(key, undefined, variables)} />;
}

export default translate;

export const translateRawV2 = (key: string, languageApplied?: string, variables?: { [name: string]: string }): string => {
  const language = languageApplied || fallbackLanguage
  const translatedString =
    (repository[language] && repository[language][key]) || repository[fallbackLanguage][key] || key;

  /** @desc In RegExp, $foo is two "words", but __foo is only one "word."
   *  Replace all occurences of '$' with '__' in the entire string and each variable,
   *  then iterate over each variable, replacing the '__variable' in the
   *  translation key with the variable's value.
   */
  if (variables) {
    let str = translatedString.replace(/\$/g, '__');

    Object.keys(variables).forEach(variable => {
      const singleWordVariable = variable.replace(/\$/g, '__');
      const re = new RegExp(`\\b${singleWordVariable}\\b`, 'g');

      str = str.replace(re, variables[variable]);
    });

    return str;
  }

  return translatedString;
};