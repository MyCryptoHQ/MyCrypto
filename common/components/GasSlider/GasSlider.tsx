import React from 'react';
import Slider from 'rc-slider';
import translate from 'translations';
import { connect } from 'react-redux';
import {
  inputGasLimit,
  TInputGasLimit,
  inputNonce,
  TInputNonce,
  setGasPriceField,
  TSetGasPriceField
} from 'actions/transaction';
import { AppState } from 'reducers';
import { gasPriceDefaults } from 'config/data';
import { gasPricetoBase } from 'libs/units';
import FeeSummary from './components/FeeSummary';
import './GasSlider.scss';

interface Props {
  // Data
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  // Actions
  inputGasLimit: TInputGasLimit;
  inputNonce: TInputNonce;
  setGasPriceField: TSetGasPriceField;
}

class GasSlider extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit } = this.props;

    return (
      <div className="GasSlider">
        <div className="GasSlider-simple row form-group">
          <div className="col-md-12">
            <label className="GasSlider-simple-label">{translate('Transaction Fee')}</label>
          </div>

          <div className="col-md-8 col-sm-12">
            <div className="GasSlider-simple-slider">
              <Slider
                onChange={this.handleSlider}
                min={gasPriceDefaults.gasPriceMinGwei}
                max={gasPriceDefaults.gasPriceMaxGwei}
                value={gasPrice.value.toNumber() / 1000000000}
              />
              <div className="GasSlider-simple-slider-labels">
                <span>{translate('Cheap')}</span>
                <span>{translate('Balanced')}</span>
                <span>{translate('Fast')}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="GasSlider-simple-fee">
              <FeeSummary gasPrice={gasPrice.value} gasLimit={gasLimit.value} exchangeRate={null} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleSlider = (gasGwei: number) => {
    this.props.setGasPriceField({
      raw: gasGwei.toString(),
      value: gasPricetoBase(gasGwei)
    });
  };
}

function mapStateToProps(state: AppState) {
  return {
    gasPrice: state.transaction.fields.gasPrice,
    gasLimit: state.transaction.fields.gasLimit
  };
}

export default connect(mapStateToProps, {
  inputGasLimit,
  inputNonce,
  setGasPriceField
})(GasSlider);
