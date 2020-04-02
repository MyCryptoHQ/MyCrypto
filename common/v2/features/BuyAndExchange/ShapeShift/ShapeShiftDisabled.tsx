import React, { Component } from 'react';

// Legacy
import TabSection from 'containers/TabSection';
import Warning from 'components/ui/Warning';

export default class ShapeShiftDisabled extends Component {
  public render() {
    return (
      <TabSection>
          <Warning>
            ShapeShift functionality is currently unavailable on the MyCrypto App.
          </Warning>
      </TabSection>
    );
  }
}
