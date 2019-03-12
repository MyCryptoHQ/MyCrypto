import React from 'react';

import { Layout } from 'v2/features';
import { GetStartedPanel } from './components';
import './Home.scss';

export default function Home() {
  return (
    <Layout fluid>
      <div className="HomeWrapper">
        <section className="Home">
          <section className="Home-getStarted">
            <GetStartedPanel />
          </section>
        </section>
      </div>
    </Layout>
  );
}
