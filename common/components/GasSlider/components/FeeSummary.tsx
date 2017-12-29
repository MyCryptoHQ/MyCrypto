import React from 'react';
import BN from 'bn.js';
import { UnitDisplay } from 'components/ui';

interface Props {
  gasPrice: BN | null;
  gasLimit: BN | null;
  exchangeRate: BN | null;
}

export default class FeeSummary extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit } = this.props;
    const gasFeeEth = gasLimit ? gasPrice.mul(gasLimit).toString() : null;

    return (
      <span>
        <UnitDisplay value={gasFeeEth} unit="ether" symbol="ETH" displayShortBalance={6} /> / $0.02
      </span>
    );
  }
}
