import React from 'react';

import { Layout } from 'v2/features';
import { GetStartedPanel } from './components';
import './Home.scss';

export default function Home() {
  return (
    <Layout className="WhiteBackgrond" fluid>
      <section className="Home">
        <section className="LimitedWidth">
          <GetStartedPanel />
        </section>
      </section>
    </Layout>
  );
}
