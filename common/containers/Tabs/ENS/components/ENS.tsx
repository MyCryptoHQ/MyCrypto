import React from 'react';
import { GeneralInfoPanel } from './GeneralInfoPanel';
import Title from './Title';
import UnfinishedBanner from './UnfinishedBanner';

interface ContainerTabPaneActiveProps {
  children: React.ReactElement<any> | React.ReactElement<any>[];
}

const ContainerTabPaneActive = ({ children }: ContainerTabPaneActiveProps) =>
  <section className="container">
    <div className="tab-content">
      <main className="tab-pane active">
        <section role="main" className="row">
          {children}
        </section>
      </main>
    </div>
  </section>;

const ENS = () =>
  <ContainerTabPaneActive>
    <UnfinishedBanner />
    <Title />
    <GeneralInfoPanel />
  </ContainerTabPaneActive>;

export default ENS;
