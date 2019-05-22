import styled from 'styled-components';
import { COLORS } from 'v2/features/constants';
const { PASTEL_RED } = COLORS;

export const InlineErrorMsg = styled.div`
  font-size: 18px;
  width: 100%;
  color: ${PASTEL_RED};
  text-align: justify;
  white-space: pre-line;
`;
