import React from 'react';
import styled from 'styled-components';

import { COLORS } from 'v2/theme';

const CodeBlockWrapper = styled.div`
  font-weight: 400;
  font-size: 1rem;
  border: 1px solid ${COLORS.GREY_LIGHTER};
  padding: 0.75rem 1rem;
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  border-radius: 2px;
  overflow: auto;
`;

const Code = styled.div`
  display: block;
  text-align: left;
  max-height: 320px;
  border: none;
  background-color: inherit;
  font-size: 14px;
  white-space: pre;
  font-family: 'Roboto Mono';
`;

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children }: Props) => (
  <CodeBlockWrapper>
    <Code>{children}</Code>
  </CodeBlockWrapper>
);

export default CodeBlock;
