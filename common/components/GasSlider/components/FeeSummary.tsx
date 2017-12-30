import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { UnitDisplay } from 'components/ui';
import './FeeSummary.scss';

interface RenderData {
  gasPriceWei: string;
  gasPriceGwei: string;
  gasLimit: string;
  fee: React.ReactElement<string>;
  usd: React.ReactElement<string> | null;
}

interface Props {
  // Redux props
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  rates: AppState['rates']['rates'];
  // Component props
  render(data: RenderData): React.ReactElement<string> | string;
}

class FeeSummary extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit, rates } = this.props;
    const feeBig = gasPrice.value && gasLimit.value && gasPrice.value.mul(gasLimit.value);
    const fee = <UnitDisplay value={feeBig} unit="ether" symbol="ETH" displayShortBalance={6} />;
    const usdBig = feeBig && rates.ETH && feeBig.muln(rates.ETH.USD);
    const usd = (
      <UnitDisplay
        value={usdBig}
        unit="ether"
        displayShortBalance={2}
        displayTrailingZeroes={true}
      />
    );

    return (
      <div className="FeeSummary">
        {this.props.render({
          gasPriceWei: gasPrice.value.toString(),
          gasPriceGwei: gasPrice.raw,
          fee,
          usd,
          gasLimit: gasLimit.raw
        })}
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    gasPrice: state.transaction.fields.gasPrice,
    gasLimit: state.transaction.fields.gasLimit,
    rates: state.rates.rates
  };
}

export default connect(mapStateToProps)(FeeSummary);
