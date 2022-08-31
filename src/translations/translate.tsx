import { ReactElement } from 'react';

import TranslateMarkdown from '@components/TranslateMarkdown';

import { translateRaw } from './translateRaw';

export type TranslatedText = ReactElement<any> | string;

export function translate(
  key: string,
  variables?: { [name: string]: string }
): ReactElement<typeof TranslateMarkdown> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;
