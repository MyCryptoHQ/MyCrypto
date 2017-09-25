import React from 'react';
import Markdown from 'react-markdown';
import { translateRaw } from 'translations';

interface Props {
  translationKey: string;
}

const Translate = ({ translationKey }: Props) => {
  const source = translateRaw(translationKey);
  return (
    <Markdown
      containerTagName="span"
      containerProps={{ 'data-l10n-key': translationKey }}
      escapeHtml={true}
      unwrapDisallowed={true}
      allowedTypes={['Text', 'Link', 'Emph', 'Strong', 'Code']}
      source={source}
    />
  );
};

export default Translate;
