import React, { Component } from 'react';

// Legacy
import TabSection from 'containers/TabSection';

import { replaceZeroExContainer } from '../helpers';
import './ZeroEx.scss';

export const ZEROEX_CONTAINER_ID = 'ZeroEx';
export const RELAYER = 'https://api.radarrelay.com/0x/v2/';

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
          orderSource: RELAYER
        },
        `#${ZEROEX_CONTAINER_ID}`
      );

      replaceZeroExContainer();
    }
  }
}
