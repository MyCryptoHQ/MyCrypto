import { FC } from 'react';

import styled from 'styled-components';

import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';

import Button from './Button';
import { Identicon } from './Identicon';

const TableOverlay = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 25px 16px ${SPACING.SM};
  background-color: ${COLORS.WHITE};
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    max-height: 100%;
  }
`;

const ContentOverlay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SIdenticon = styled(Identicon)`
  padding-top: 4px;
  margin-left: ${SPACING.SM};
  margin-right: ${SPACING.SM};
  margin-bottom: ${SPACING.SM};

  img {
    height: 2em;
    min-width: 2em;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    padding-top: 0;
    margin-left: 0;
    margin-right: ${SPACING.BASE};
    margin-bottom: 0;
  }
`;

const OverlayText = styled('span')`
  color: ${COLORS.BLACK};
  flex-grow: 1;
  overflow-wrap: break-word;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    max-width: 100%;
  }
`;

const OverlayButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  & > * {
    margin-left: 25px;
    font-size: ${FONT_SIZE.SM};
  }
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-self: flex-end;
  }
`;

interface Props {
  overlayText: string;
  address: string;
  restoreAccount(): void;
}

const UndoDeleteOverlay: FC<Props> = ({ overlayText, restoreAccount, address }) => (
  <TableOverlay>
    <ContentOverlay>
      <SIdenticon address={address} />
      <OverlayText>{overlayText}</OverlayText>
    </ContentOverlay>
    <OverlayButtons>
      <Button colorScheme={'inverted'} onClick={restoreAccount}>
        Undo
      </Button>
    </OverlayButtons>
  </TableOverlay>
);

export default UndoDeleteOverlay;
