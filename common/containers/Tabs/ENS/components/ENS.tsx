import React from 'react';
import { GeneralInfoPanel } from './GeneralInfoPanel/index';
import Title from './Title';
import UnfinishedBanner from './UnfinishedBanner/index';
interface ContainerTabPaneActiveProps {
  children: React.ReactElement<any>;
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
