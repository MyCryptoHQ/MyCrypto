import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

export default class ShapeShift extends Component {
  public render() {
    console.log('\n\n\n', 'ShapeShiftService', ShapeShiftService, '\n\n\n');
    return (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane" />
        </section>
      </TabSection>
    );
  }
}
