import Translate from 'components/Translate';
import React from 'react';
import { getLanguageSelection } from 'selectors/config';
import { configuredStore } from '../store';
const fallbackLanguage = 'en';
const repository = {};

const languages = [
  require('./lang/de.json'),
  require('./lang/el.json'),
  require('./lang/en.json'),
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
    const translated = translate(x);
    if (typeof translated === 'string') {
      return !!translated.trim();
    }
    return !!translated;
  });
}

export type TranslateType = React.ReactElement<any> | string;

export default function translate(key: string, textOnly: boolean = false): TranslateType {
  return textOnly ? translateRaw(key) : <Translate translationKey={key} />;
}

export function translateRaw(key: string) {
  const lang = getLanguageSelection(configuredStore.getState());

  return (repository[lang] && repository[lang][key]) || repository[fallbackLanguage][key] || key;
}
