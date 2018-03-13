import React from 'react';
import Markdown from 'react-markdown';

interface Props {
  source: string;
}

const TranslateMarkdown = ({ source }: Props) => {
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

export default TranslateMarkdown;
