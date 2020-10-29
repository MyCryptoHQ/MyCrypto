import React from 'react';

import Markdown from 'react-markdown';

import { NewTabLink } from './NewTabLink';

interface Props {
  source: string;
}

export const TranslateMarkdown = ({ source }: Props) => {
  return (
    <Markdown
      disallowedTypes={['html']}
      renderers={{
        root: React.Fragment,
        link: NewTabLink,
        paragraph: React.Fragment // Remove <p> added by react-markdown.
      }}
    >
      {source}
    </Markdown>
  );
};

export default TranslateMarkdown;
