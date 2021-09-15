import { FC, Fragment, ReactNode } from 'react';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

const fallbackLanguage = 'en';
const repository: {
  [language: string]: {
    [translationName: string]: string;
  };
} = {};

type LanguageCode =
  | 'en'
  | 'de'
  | 'el'
  | 'es'
  | 'fi'
  | 'fr'
  | 'ht'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt'
  | 'ru'
  | 'ko'
  | 'tr'
  | 'vi'
  | 'zhcn'
  | 'zhtw';

interface ILanguageData {
  code: LanguageCode;
  data: {
    [translationName: string]: string;
  };
}

const languages: ILanguageData[] = [require('./lang/en.json')];

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
  // @todo: Either find an appropriate way to share the users language setting without needing to update all our translateRaw calls.
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
    try {
      let str = translatedString.replace(/\$/g, '__');

      Object.keys(variables).forEach((variable) => {
        const singleWordVariable = variable.replace(/\$/g, '__');
        const re = new RegExp(`\\b${singleWordVariable}\\b`, 'g');

        // Needs to escape '$' because it is a special replacement operator
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
        const escaped = variables[variable].replace(/\$/g, '$$$$');

        str = str.replace(re, escaped);
      });

      return str;
    } catch (err) {
      console.error(err);
      return key;
    }
  }
  return translatedString;
}

interface Props {
  id: string;
  variables?: { [name: string]: () => string | ReactNode };
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

    const nextTagMatch = new RegExp('<T\\d+/>');

    /**
     * Replaces all <T{id}> with actual components from variables, and creates a components list
     * @param rest Rest of string to parse
     * @param components Components array of parsed string
     */
    const resolveComponents = (rest: string, components: ReactNode[] = []): ReactNode[] => {
      if (isEmpty(rest)) {
        return components;
      }

      const nextMatch = rest.match(nextTagMatch);
      if (nextMatch && nextMatch.length) {
        const resolvedComponentIndex = nextMatch[0].replace('<T', '').replace('/>', '');
        const resolvedComponentIndexNumber = parseInt(resolvedComponentIndex, 10);

        const matchSplit = [
          rest.substring(0, nextMatch.index!),
          rest.substring(nextMatch.index! + 4 + resolvedComponentIndex.length)
        ];

        return resolveComponents(matchSplit[1], [
          ...components,
          <Fragment key={uniqueId()}>{matchSplit[0]}</Fragment>,
          <Fragment key={uniqueId()}>
            {isFunction(variablesComponents[resolvedComponentIndexNumber])
              ? (variablesComponents[resolvedComponentIndexNumber] as () => any)()
              : variablesComponents[resolvedComponentIndexNumber]}
          </Fragment>
        ]);
      }

      return resolveComponents('', [...components, <Fragment key={uniqueId()}>{rest}</Fragment>]);
    };

    return <>{resolveComponents(tString)}</>;
  }
};

/**
 * Wrap string to export it in json language file
 */
export const translateMarker = (s: string) => s;
