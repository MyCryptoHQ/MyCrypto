import React, { FC, ReactNode } from 'react';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

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

languages.forEach((l) => {
  repository[l.code] = l.data;
});

export function getTranslators() {
  return [
    'TranslatorName_1',
    'TranslatorName_2',
    'TranslatorName_3',
    'TranslatorName_4',
    'TranslatorName_5'
  ].filter((x) => {
    const translated = translateRaw(x);
    return !!translated;
  });
}

export function translateRaw(key: string, variables?: { [name: string]: string }): string {
  // TODO: Either find an appropriate way to share the users language setting without needing to update all our translateRaw calls.
  // In the mean time we default to english.
  const settings = { language: 'en' };
  const language = settings.language || fallbackLanguage;
  const translatedString =
    (repository[language] && repository[language][key]) || repository[fallbackLanguage][key] || key;

  /** @desc In RegExp, $foo is two "words", but __foo is only one "word."
   *  Replace all occurences of '$' with '__' in the entire string and each variable,
   *  then iterate over each variable, replacing the '__variable' in the
   *  translation key with the variable's value.
   */
  if (variables) {
    let str = translatedString.replace(/\$/g, '__');

    Object.keys(variables).forEach((variable) => {
      const singleWordVariable = variable.replace(/\$/g, '__');
      const re = new RegExp(`\\b${singleWordVariable}\\b`, 'g');

      str = str.replace(re, variables[variable]);
    });

    return str;
  }
  return translatedString;
}

interface Props {
  id: string;
  variables?: { [name: string]: () => string | React.ReactNode };
}

export const Trans: FC<Props> = ({ id, variables }) => {
  const settings = { language: 'en' };
  const language = settings.language || fallbackLanguage;
  let tString =
    (repository[language] && repository[language][id]) || repository[fallbackLanguage][id] || id;

  const uniqueId = ((counter) => () => `${++counter}`)(0);

  if (!variables) {
    return <>{tString}</>;
  } else {
    const keys = Object.keys(variables);

    const variablesComponents: ReactNode[] = [];

    /**
     * Replace all variables with tags. I.E. $variable1 with <T1>
     */
    keys.forEach((key, index) => {
      const tStringSplit = tString.split(new RegExp(`\\${key}`));
      if (tStringSplit.length) {
        tString = tStringSplit.join(`<T${index}/>`);
        const value = variables[keys[index]];
        variablesComponents.push(value);
      }
    });

    const nextTagMatch = '(?<=<)T\\d+?(?=/>)';

    /**
     * Replaces all <T{id}> with actual components from variables, and creates a components list
     * @param rest Rest of string to parse
     * @param components Components array of parsed string
     */
    const resolveComponents = (rest: string, components: ReactNode[] = []): ReactNode[] => {
      if (isEmpty(rest)) {
        return components;
      }

      const nextMatch = rest.match(new RegExp(nextTagMatch));
      if (nextMatch && nextMatch.length) {
        const resolvedComponentIndex = nextMatch[0].replace('T', '');
        const resolvedComponentIndexNumber = parseInt(resolvedComponentIndex, 10);

        const matchSplit = [
          rest.substring(0, nextMatch.index! - 1),
          rest.substring(nextMatch.index! + 3 + resolvedComponentIndex.length)
        ];

        return resolveComponents(matchSplit[1], [
          ...components,
          <React.Fragment key={uniqueId()}>{matchSplit[0]}</React.Fragment>,
          <React.Fragment key={uniqueId()}>
            {isFunction(variablesComponents[resolvedComponentIndexNumber])
              ? (variablesComponents[resolvedComponentIndexNumber] as () => any)()
              : variablesComponents[resolvedComponentIndexNumber]}
          </React.Fragment>
        ]);
      }

      return resolveComponents('', [
        ...components,
        <React.Fragment key={uniqueId()}>{rest}</React.Fragment>
      ]);
    };

    return <>{resolveComponents(tString)}</>;
  }
};

/**
 * Wrap string to export it in json language file
 */
export const translateMarker = (s: string) => s;
