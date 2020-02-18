import React from 'react';
import styled from 'styled-components';

import { COLORS, BREAK_POINTS } from 'v2/theme';
import { Button } from 'v2/components';

/*
  Passed to CollapisableTable and Table by AccountList and AddressBook
  It handles its own display to adapt to overlay on table row or over
  StackCard.
*/

const TableOverlay = styled.div`
  height: 100%;
  max-height: 69px;
  background-color: ${COLORS.GREY_DARKER};
  color: ${COLORS.WHITE};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-items: space-between;
    flex-direction: column;
    justify-content: start;
    max-height: 100%;
  }
`;

const OverlayText = styled('span')`
  color: ${COLORS.WHITE};
  flex-grow: 1;
  overflow-wrap: break-word;
  max-width: 70%;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    max-width: 100%;
  }
`;

const OverlayButtons = styled.div`
  padding: 8px 0px;
  & > * {
    margin-left: 2ch;
    font-size: 0.9em;
  }
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-self: flex-end;
  }
`;

const RowDeleteOverlay = (props: any) => (
  <TableOverlay>
    <OverlayText>{props.prompt}</OverlayText>
    <OverlayButtons>
      <Button onClick={props.deleteAction}>Delete</Button>
      <Button secondary={true} onClick={props.cancelAction}>
        Cancel
      </Button>
    </OverlayButtons>
  </TableOverlay>
);

export default RowDeleteOverlay;
