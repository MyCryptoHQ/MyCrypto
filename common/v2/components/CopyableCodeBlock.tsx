import React from 'react';
import styled from 'styled-components';

import { Copyable } from '@mycrypto/ui';

interface Props {
  children?: React.ReactNode;
}

const truncate = (_: string) => {
  return '';
};

const CopyableCodeBlockWrapper = styled('div')`
  font-weight: 400;
  font-size: 1rem;
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  box-shadow: inset 0 1px 0 0 rgba(63, 63, 68, 0.05);
  border: 1px solid #e5ecf3;
  display: flex;
`;

const CodeDisplay = styled('pre')`
  font-weight: 400;
  font-size: 1rem;
  background-color: #ffffff;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 1rem;
  border: none;
  overflow: hidden;
  & > code {
    display: block;
    border: none;
    text-align: left;
    max-height: 320px;
    font-size: 14px;
    white-space: pre;
  }
  &.wrap {
    & > code {
      white-space: normal;
    }
  }
`;

const CodeCopyButton = styled('div')`
  display: block;
  align-content: center;
  justify-items: center;
  position: relative;
  line-height: 0px;
  right: 0px;
  max-height: 320px;
  padding: 9px 6px 9px 6px;
  font-size: 14px;
  white-space: pre;
`;

const CopyableCodeBlock = ({ children }: Props) => (
  <CopyableCodeBlockWrapper>
    <CodeDisplay>
      <code>{children}</code>
    </CodeDisplay>
    <CodeCopyButton>
      <Copyable text={`${children}`} truncate={truncate} />
    </CodeCopyButton>
  </CopyableCodeBlockWrapper>
);

export default CopyableCodeBlock;
