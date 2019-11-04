import React from 'react';
import Markdown from 'react-markdown';

import { NewTabLink } from './NewTabLink';

interface Props {
  source: string;
}

const TranslateMarkdown = ({ source }: Props) => {
  return (
    <Markdown
      escapeHtml={true}
      unwrapDisallowed={true}
      allowedTypes={['link', 'emphasis', 'strong', 'code', 'root', 'inlineCode']}
      renderers={{
        root: React.Fragment,
        link: NewTabLink
      }}
      source={source}
    />
  );
};

export default TranslateMarkdown;
