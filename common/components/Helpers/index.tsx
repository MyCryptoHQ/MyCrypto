import React from 'react';
import { UnitInput } from './components';
import TabSection from 'containers/TabSection';
import './index.scss';

export default class Helpers extends React.Component<{}> {
  public render() {
    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content">
          <section className="Tab-content-pane">
            <div className="Helper">
              <h1 className="Helper-title">{`Convert Ethererum Units (e.g. Ether <-> Wei)`}</h1>
              <h2 className="Helper-title">Ether Wei Converter</h2>
              <UnitInput displayUnit="wei" />
              <UnitInput displayUnit="kwei" />
              <UnitInput displayUnit="mwei" />
              <UnitInput displayUnit="gwei" />
              <UnitInput displayUnit="szabo" />
              <UnitInput displayUnit="finney" />
              <UnitInput displayUnit="ether" />
              <UnitInput displayUnit="kether" />
              <UnitInput displayUnit="mether" />
              <UnitInput displayUnit="gether" />
              <UnitInput displayUnit="tether" />
            </div>
          </section>
        </div>
      </TabSection>
    );
  }
}
