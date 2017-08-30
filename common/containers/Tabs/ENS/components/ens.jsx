// @flow
import * as React from 'react';
import Title from './components/title';
import GeneralInfoPanel from './components/generalInfoPanel';
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

const ENS = () =>
  <ContainerTabPaneActive>
    <Title />
    <GeneralInfoPanel />
  </ContainerTabPaneActive>;

export default ENS;
