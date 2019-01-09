import React, { Component } from 'react';

import { isDesktop } from 'v2/utils';
import { replaceZeroExContainer } from './helpers';
import { ZEROEX_CONTAINER_ID, ZEROEX_RELAYER } from './constants';
import './ZeroEx.scss';

// Legacy
import TabSection from 'containers/TabSection';
import Warning from 'components/ui/Warning';

export default class ZeroEx extends Component {
  public componentDidMount() {
    if (!isDesktop()) {
      this.renderZeroExInstant();
    }
  }

  public render() {
    return (
      <TabSection>
        {isDesktop() ? (
          <Warning>
            0x Instant functionality is currently unavailable on the MyCrypto Desktop App. This
            functionality will be available in a future update -- stay tuned!
          </Warning>
        ) : (
          <section className="ZeroEx">
            <section className="Tab-content-pane" id={ZEROEX_CONTAINER_ID} />
          </section>
        )}
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
