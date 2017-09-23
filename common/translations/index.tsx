import Translate from 'components/Translate';
import React from 'react';
import { getLanguageSelection } from 'selectors/config';
import { configuredStore } from '../store';
const fallbackLanguage = 'en';
const repository = {};

const languages = [
  require('./lang/de'),
  require('./lang/el'),
  require('./lang/en'),
  require('./lang/es'),
  require('./lang/fi'),
  require('./lang/fr'),
  require('./lang/ht'),
  require('./lang/hu'),
  require('./lang/id'),
  require('./lang/it'),
  require('./lang/ja'),
  require('./lang/nl'),
  require('./lang/no'),
  require('./lang/pl'),
  require('./lang/pt'),
  require('./lang/ru') /*sk, sl, sv */,
  require('./lang/ko'),
  require('./lang/tr'),
  require('./lang/vi'),
  require('./lang/zhcn'),
  require('./lang/zhtw')
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

type TranslateType = React.ReactElement<any> | string;

export default function translate(
  key: string,
  textOnly: boolean = false
): TranslateType {
  return textOnly ? translateRaw(key) : <Translate translationKey={key} />;
}

export function translateRaw(key: string) {
  const lang = getLanguageSelection(configuredStore.getState());

  return (
    (repository[lang] && repository[lang][key]) ||
    repository[fallbackLanguage][key] ||
    key
  );
}
