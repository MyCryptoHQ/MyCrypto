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
      escapeHtml={true}
      unwrapDisallowed={true}
      allowedTypes={['link', 'emphasis', 'strong', 'code', 'root', 'inlineCode']}
      renderers={{ root: 'span' }}
      source={source}
    />
  );
};

export default Translate;
