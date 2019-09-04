import React from 'react';

import './CodeBlock.scss';
import { Copyable } from '@mycrypto/ui';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const truncate = (_: string) => {
  return '';
};

const CodeBlock = ({ children, className }: Props) => (
  <div className={`${className} CodeWrapper`}>
    <pre className={'CodeBlock'}>
      <code>{children}</code>
    </pre>
    <div className={'CodeBlock-button'}>
      <Copyable text={`${children}`} truncate={truncate} />
    </div>
  </div>
);

export default CodeBlock;
