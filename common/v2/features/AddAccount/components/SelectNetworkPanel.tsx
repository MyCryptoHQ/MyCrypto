import React, { Component } from 'react';
import { Button, ComboBox, Typography } from '@mycrypto/ui';

import styled from 'styled-components';

// const SelectNetworkStyled = styled.div`
//   width: 100%;
// `;

const TitleTypography = styled(Typography)`
  width: 421px;
  height: 39px;
  font-family: Lato;
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--dark-slate-blue);
`;

export default class SelectNetworkPanel extends Component {
  public render() {
    return (
      <div>
        <TitleTypography>Select Network</TitleTypography>
        <Typography>
          Select the blockchain that you want to operate with. Not sure what to choose? Stick with
          the default choices below and click next.
        </Typography>

        <label>Network</label>
        <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />

        <Button className="SelectNetworkPanel-next" onClick={console.log}>
          Next
        </Button>
      </div>
    );
  }
}
