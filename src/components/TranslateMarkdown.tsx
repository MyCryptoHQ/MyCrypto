import { Fragment } from 'react';

import Markdown from 'react-markdown';

import { default as LinkApp } from './LinkApp';

interface Props {
  source: string;
}

//@ts-expect-error bad typing on props
const Link = (props) => <LinkApp isExternal={true} {...props} />;

const disallowed = ['html'];

const components = {
  a: Link,
  p: Fragment // Remove <p> added by react-markdown.
};

const TranslateMarkdown = ({ source }: Props) => {
  return (
    <Markdown disallowedElements={disallowed} components={components}>
      {source}
    </Markdown>
  );
};

export default TranslateMarkdown;
