import React from 'react';

import Markdown from 'react-markdown';

import { default as LinkApp } from './LinkApp';

interface Props {
  source: string;
}

const TranslateMarkdown = ({ source }: Props) => {
  return (
    <Markdown
      disallowedTypes={['html']}
      renderers={{
        root: React.Fragment,
        link: (props) => <LinkApp isExternal={true} {...props} />,
        paragraph: React.Fragment // Remove <p> added by react-markdown.
      }}
    >
      {source}
    </Markdown>
  );
};

export default TranslateMarkdown;
