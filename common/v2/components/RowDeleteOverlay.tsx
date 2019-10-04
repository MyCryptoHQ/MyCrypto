import React from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

const TableOverlay = styled.div`
  height: 67px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #b5bfc7;
  color: #fff;
  padding: 1em;
`;

const OverlayText = styled(Typography)`
  color: #fff;
  flex-grow: 1;
  text-overflow: hidden;
  width: 50%;
`;

const OverlayButtons = styled.div`
  align-self: flex-end;
`;

const OverlayDelete = styled(Button)`
  font-size: 14px;
  margin-left: 5px;
`;

const OverlayCancel = styled(Button)`
  font-size: 14px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 5px;
`;

const RowDeleteOverlay = (props: any) => (
  <TableOverlay>
    <OverlayText>{props.prompt}</OverlayText>
    <OverlayButtons>
      <OverlayDelete onClick={props.deleteAction}>Delete</OverlayDelete>
      <OverlayCancel secondary={true} onClick={props.cancelAction}>
        Cancel
      </OverlayCancel>
    </OverlayButtons>
  </TableOverlay>
);

export default RowDeleteOverlay;
