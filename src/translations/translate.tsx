import React from 'react';
import TranslateMarkdown from '@components/TranslateMarkdown';
import { translateRaw } from './translateRaw';

export type TranslatedText = React.ReactElement<any> | string;

export function translate(
  key: string,
  variables?: { [name: string]: any }
): React.ReactElement<any> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;
