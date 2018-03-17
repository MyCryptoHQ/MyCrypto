import React from 'react';
import './Code.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const Code = ({ children, className }: Props) => (
  <pre className={className}>
    <code>{children}</code>
  </pre>
);

export default Code;
