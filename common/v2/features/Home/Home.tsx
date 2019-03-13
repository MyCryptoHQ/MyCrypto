import React from 'react';

import { Layout } from 'v2/features';
import { GetStartedPanel, DownloadAppPanel, CompatibleWalletsPanel } from './components';
import './Home.scss';

export default function Home() {
  return (
    <Layout className="WhiteBackground" fluid>
      <section className="Home">
        <section className="LimitedWidth">
          <GetStartedPanel />
        </section>
        <section className="Home-compatibleWallets">
          <CompatibleWalletsPanel />
        </section>
        <section className="Home-DownloadApp">
          <DownloadAppPanel />
        </section>
      </section>
    </Layout>
  );
}
