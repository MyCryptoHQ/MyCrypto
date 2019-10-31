import React from 'react';
import TranslateMarkdown from 'v2/components/TranslateMarkdown';
import { translateRawV2 } from './translateRaw';

export type TranslatedText = React.ReactElement<any> | string;

export function translate(
  key: string,
  variables?: { [name: string]: string }
): React.ReactElement<any> {
  return <TranslateMarkdown source={translateRawV2(key, undefined, variables)} />;
}

export default translate;
