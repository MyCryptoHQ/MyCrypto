import React, { Component } from 'react';

// Legacy
import TabSection from 'containers/TabSection';
import Warning from 'components/ui/Warning';

export default class ShapeShiftDisabled extends Component {
  public render() {
    return (
      <TabSection>
        <Warning>
          ShapeShift functionality is currently unavailable on the MyCrypto App. <br />
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
