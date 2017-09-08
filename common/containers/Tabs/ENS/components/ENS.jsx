// @flow
import * as React from 'react';
import Title from './Title';
import GeneralInfoPanel from './GeneralInfoPanel';
import UnfinishedBanner from './UnfinishedBanner';
import NameInput from './NameInput';
type ContainerTabPaneActiveProps = {
  children: React.Element<any>
};

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
/* eslint-disable */
const ENS = props => {
  console.error('PROPS', props);
  return (
    <ContainerTabPaneActive>
      <UnfinishedBanner />
      <Title />
      <NameInput resolveDomainRequested={props.resolveDomainRequested} />
      <GeneralInfoPanel />
    </ContainerTabPaneActive>
  );
};

export default ENS;
