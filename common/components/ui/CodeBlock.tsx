import React from 'react';
import './CodeBlock.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children, className }: Props) => (
  <pre className={`${className} CodeBlock`}>
    <code>{children}</code>
  </pre>
);

export default CodeBlock;
