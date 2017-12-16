import React from 'react';
import TabSection from 'containers/TabSection';
import KeystoreDetails from './components/KeystoreDetails';

const RestoreKeystore: React.SFC<{}> = () => (
  <TabSection>
    <KeystoreDetails />
  </TabSection>
);

export default RestoreKeystore;
