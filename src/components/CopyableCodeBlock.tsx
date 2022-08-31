import { ReactNode } from 'react';

import { Copyable } from '@mycrypto/ui';
import styled from 'styled-components';

interface Props {
  children?: ReactNode;
}

const truncate = () => {
  return '';
};

const CopyableCodeBlockWrapper = styled('div')`
  font-weight: 400;
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  box-shadow: inset 0 1px 0 0 rgba(63, 63, 68, 0.05);
  border: 1px solid #e5ecf3;
  display: flex;
  div {
    display: flex;
    align-content: center;
    justify-items: center;
    position: relative;
    line-height: 0px;
    right: 0px;
    max-height: 320px;
    padding: 9px 6px 9px 6px;
    font-size: 14px;
    white-space: pre;
  }
`;

const CodeDisplay = styled('pre')`
  font-weight: 400;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 1rem;
  border: none;
  overflow: hidden;
  white-space: normal;
  background: none;
  & > code {
    display: block;
    border: none;
    text-align: left;
    max-height: 320px;
    font-size: 14px;
    color: inherit;
    white-space: pre-wrap;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    font-family: 'Roboto Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

const CopyableCodeBlock = ({ children }: Props) => (
  <CopyableCodeBlockWrapper>
    <CodeDisplay>
      <code>{children}</code>
    </CodeDisplay>
    <Copyable text={`${children}`} truncate={truncate} disableTooltip={true} />
  </CopyableCodeBlockWrapper>
);

export default CopyableCodeBlock;
