import { Fragment } from 'react';

import Markdown from 'react-markdown';

import { default as LinkApp } from './LinkApp';

interface Props {
  source: string;
}

const TranslateMarkdown = ({ source }: Props) => {
  return (
    <Markdown
      disallowedElements={['html']}
      components={{
        //@ts-expect-error bad typing on props
        a: (props) => <LinkApp isExternal={true} {...props} />,
        p: Fragment // Remove <p> added by react-markdown.
      }}
    >
      {source}
    </Markdown>
  );
};

export default TranslateMarkdown;
