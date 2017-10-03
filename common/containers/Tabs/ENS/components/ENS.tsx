import React from 'react';
import { GeneralInfoPanel } from './GeneralInfoPanel';
import Title from './Title';
import UnfinishedBanner from './UnfinishedBanner';
import TabSection from 'containers/TabSection';

interface ContainerTabPaneActiveProps {
  children: React.ReactElement<any> | React.ReactElement<any>[];
  location: { pathname: string };
}

const ContainerTabPaneActive = ({
  children,
  location
}: ContainerTabPaneActiveProps) => (
  <TabSection location={location}>
    <section className="container">
      <div className="tab-content">
        <main className="tab-pane active">
          <section role="main" className="row">
            {children}
          </section>
        </main>
      </div>
    </section>
  </TabSection>
);

const ENS = ({ location }) => (
  <ContainerTabPaneActive location={location}>
    <UnfinishedBanner />
    <Title />
    <GeneralInfoPanel />
  </ContainerTabPaneActive>
);

export default ENS;
