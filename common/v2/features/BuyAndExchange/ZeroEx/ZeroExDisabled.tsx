import React, { Component } from 'react';

// Legacy
import TabSection from 'containers/TabSection';
import Warning from 'components/ui/Warning';

export default class ZeroExDisabled extends Component {
  public render() {
    return (
      <TabSection>
        <Warning>
          0x Instant is currently unavailable. <br />
          To continue with your swap, please use the new and improved swap functionality on the
          MyCrypto Beta! <br />
          <a href="https://beta.mycrypto.com/swap" target="_blank" rel="noreferrer">
            Continue Swap &raquo;
          </a>
        </Warning>
      </TabSection>
    );
  }
}
