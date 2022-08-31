import styled from 'styled-components';

import { ExtendedContentPanel, ExtendedControlPanelProps } from '@components';
import { BREAK_POINTS, SPACING } from '@theme';

export const FullSizePanelSection = styled.section<{ color?: string }>`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    padding: ${SPACING.LG} ${SPACING.BASE};
    align-items: center;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ color = 'inherit' }) => color};
  width: 100%;
  padding: ${SPACING.LG} ${SPACING.XL};
`;

export const RowPanelSection = styled(FullSizePanelSection)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const SpacedPanelSection = styled(FullSizePanelSection)`
  & > * {
    margin: ${SPACING.BASE} 0;
  }
`;

const FullSizeContentPanel = styled(ExtendedContentPanel)`
  padding: 0px;
`;

export default (props: ExtendedControlPanelProps) => {
  return <FullSizeContentPanel {...props} />;
};
