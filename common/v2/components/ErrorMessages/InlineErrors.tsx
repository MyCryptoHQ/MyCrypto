import styled from 'styled-components';
import { COLORS } from 'v2/features/constants';
const { PASTEL_RED } = COLORS;

export const InlineErrorMsg = styled.div`
  width: 100%;
  color: ${PASTEL_RED};
  text-align: justify;
`;
