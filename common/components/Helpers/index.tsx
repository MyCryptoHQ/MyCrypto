import React from 'react';
import { UnitConverter, ETHReferenceGuide } from './components';
import TabSection from 'containers/TabSection';

import './index.scss';

export default class Helpers extends React.Component<{}, {}> {
  public render() {
    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content">
          <section className="Tab-content-pane">
            <UnitConverter />
            <ETHReferenceGuide />
          </section>
        </div>
      </TabSection>
    );
  }
}
