import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getGasPriceGwei } from 'selectors/config';
import { getDecimal, toWei, Wei } from 'libs/units';

interface Props {
  gasPrice: Wei;
  withGasPrice({ gasPrice }: { gasPrice: Wei }): React.ReactElement<any>;
}

class GasPriceClass extends React.Component<Props, {}> {
  public render() {
    const { gasPrice, withGasPrice } = this.props;
    return withGasPrice({ gasPrice });
  }
}

export const GasPrice = connect((state: AppState) => ({
  gasPrice: toWei(`${getGasPriceGwei(state)}`, getDecimal('gwei'))
}))(GasPriceClass);
