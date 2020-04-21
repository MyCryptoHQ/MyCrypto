import React, { Component } from 'react';

// Legacy
import TabSection from 'containers/TabSection';
import Warning from 'components/ui/Warning';

export default class ZeroExDisabled extends Component {
  public render() {
    return (
      <TabSection>
        <Warning>
          0x functionality is currently unavailable on the MyCrypto App. <br />
          However, you can use our beta product to swap using an exchange aggregator to ensure you
          get the best price! <br />
          <a href="https://beta.mycrypto.com/swap" target="_blank" rel="noreferrer">
            Go to the beta product
          </a>
        </Warning>
      </TabSection>
    );
  }
}
