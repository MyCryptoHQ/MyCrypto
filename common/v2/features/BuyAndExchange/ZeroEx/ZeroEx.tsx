import React, { Component } from 'react';

import { IS_ELECTRON } from 'v2/utils';
import { replaceZeroExContainer } from './helpers';
import {
  ZEROEX_CONTAINER_ID,
  ZEROEX_RELAYER,
  ZEROEX_FEE_ADDRESS,
  ZEROEX_FEE_PERCENTAGE
} from './constants';
import './ZeroEx.scss';

// Legacy
import TabSection from 'containers/TabSection';
import { Warning } from 'v2/components';

export default class ZeroEx extends Component {
  public componentDidMount() {
    if (!IS_ELECTRON) {
      this.renderZeroExInstant();
    }
  }

  public render() {
    return (
      <TabSection>
        {IS_ELECTRON ? (
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
          orderSource: ZEROEX_RELAYER,
          affiliateInfo: {
            feeRecipient: ZEROEX_FEE_ADDRESS,
            feePercentage: ZEROEX_FEE_PERCENTAGE
          }
        },
        `#${ZEROEX_CONTAINER_ID}`
      );

      replaceZeroExContainer();
    }
  }
}
