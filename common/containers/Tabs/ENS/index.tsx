import React from 'react';

import { donationAddressMap } from 'config';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { NameInput, NameResolve } from './components';
import './index.scss';

export default class ENSClass extends React.Component<{}> {
  public render() {
    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content">
          <section className="Tab-content-pane">
            <div className="ENS">
              <h1 className="ENS-title">Ethereum Name Service</h1>
              <p className="ENS-description">
                {translate('ENS_DESCRIPTION', {
                  $ens_docs: 'https://ens.readthedocs.io/en/latest/introduction.html',
                  $example_donation_addr: donationAddressMap.ETH.substr(0, 8)
                })}
              </p>
              <NameInput />
            </div>
          </section>
          <NameResolve />
        </div>
      </TabSection>
    );
  }
}
