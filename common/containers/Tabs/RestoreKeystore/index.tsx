import React, { Component } from 'react';
import TabSection from 'containers/TabSection';
import KeystoreDetails from './components/KeystoreDetails';

class RestoreKeystore extends Component<{}, {}> {
  public render() {
    return (
      <TabSection>
        <KeystoreDetails />
      </TabSection>
    );
  }
}

export default RestoreKeystore;
