import React, { Component } from 'react';

import { replaceZeroExContainer } from '../helpers';
import { ZEROEX_CONTAINER_ID, ZEROEX_RELAYER } from '../constants';
import './ZeroEx.scss';

// Legacy
import TabSection from 'containers/TabSection';

export default class ZeroEx extends Component {
  public componentDidMount() {
    this.renderZeroExInstant();
  }

  public render() {
    return (
      <TabSection>
        <section className="ZeroEx">
          <section className="Tab-content-pane" id={ZEROEX_CONTAINER_ID} />
        </section>
      </TabSection>
    );
  }

  private renderZeroExInstant() {
    const { zeroExInstant } = window as any;

    if (zeroExInstant) {
      zeroExInstant.render(
        {
          orderSource: ZEROEX_RELAYER
        },
        `#${ZEROEX_CONTAINER_ID}`
      );

      replaceZeroExContainer();
    }
  }
}
