import React from 'react';
import { NameInput, NameResolve } from './components';
import TabSection from 'containers/TabSection';
import { NewTabLink } from 'components/ui';
import { donationAddressMap } from 'config';
import './index.scss';

const ENSDocsLink = () => (
  <NewTabLink
    href="https://ens.readthedocs.io/en/latest/introduction.html"
    content="Ethereum Name Service"
  />
);

export default class ENSClass extends React.Component<{}> {
  public render() {
    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content">
          <section className="Tab-content-pane">
            <div className="ENS">
              <h1 className="ENS-title">Ethereum Name Service</h1>
              <p className="ENS-description">
                The <ENSDocsLink /> is a distributed, open, and extensible naming system based on
                the Ethereum blockchain. Once you have a name, you can tell your friends to send ETH
                to <code>ensdomain.eth</code> instead of
                <code>{donationAddressMap.ETH.substr(0, 12)}...</code>
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
