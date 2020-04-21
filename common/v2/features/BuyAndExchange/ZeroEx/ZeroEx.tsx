import React, { Component } from 'react';

// import { isDesktop } from 'v2/utils';
// import { replaceZeroExContainer } from './helpers';
// import {
//   ZEROEX_CONTAINER_ID,
//   ZEROEX_RELAYER,
//   ZEROEX_FEE_ADDRESS,
//   ZEROEX_FEE_PERCENTAGE
// } from './constants';
import './ZeroEx.scss';

// Legacy
// import TabSection from 'containers/TabSection';
import ZeroExDisabled from './ZeroExDisabled';

export default class ZeroEx extends Component {
  public componentDidMount() {
    // if (!isDesktop()) {
    //   this.renderZeroExInstant();
    // }
  }

  public render() {
    return <ZeroExDisabled />;
  }

  // private renderZeroExInstant() {
  //   const { zeroExInstant } = window as any;

  //   if (zeroExInstant) {
  //     zeroExInstant.render(
  //       {
  //         orderSource: ZEROEX_RELAYER,
  //         affiliateInfo: {
  //           feeRecipient: ZEROEX_FEE_ADDRESS,
  //           feePercentage: ZEROEX_FEE_PERCENTAGE
  //         }
  //       },
  //       `#${ZEROEX_CONTAINER_ID}`
  //     );

  //     replaceZeroExContainer();
  //   }
  // }
}
