import { gasPriceDefaults } from 'config';
import { Field, FieldProps, Formik } from 'formik';
import Slider, { createSliderWithTooltip, Marks } from 'rc-slider';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { GasEstimates } from 'v2/types';
import { IFormikFields } from '../../types';
import './GasPriceSlider.scss';

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface OwnProps {
  gasPrice: string;
  handleChange: Formik['handleChange'];
  gasEstimates: GasEstimates;
}

type Props = OwnProps;

interface State {
  hasSetRecommendedGasPrice: boolean;
  realGasPrice: number;
}

interface GasTooltips {
  [estimationLevel: string]: string;
}

export default class SimpleGas extends Component<Props> {
  public state: State = {
    hasSetRecommendedGasPrice: false,
    realGasPrice: 0
  };

  public render() {
    const { gasPrice, gasEstimates } = this.props;
    const bounds = {
      max: gasEstimates ? gasEstimates.fastest : gasPriceDefaults.max,
      min: gasEstimates ? gasEstimates.safeLow : gasPriceDefaults.min
    };
    const gasNotches = this.makeGasNotches();

    /**
     * @desc On retrieval of gas estimates,
     *  the current gas price may be lower than the lowest recommended price.
     *  `rc-slider` will force the onChange if the value is too low, so we
     *  ensure it at least passes the lower boundary.
     *  When this occurs, the logic in `UNSAFE_componentWillReceiveProps` fires,
     *  and it cannot happen again from that point forward.
     */
    const actualGasPrice = Math.max(parseFloat(gasPrice), bounds.min);
    return (
      <Field
        name="gasPriceSlider"
        render={({ field, form }: FieldProps<IFormikFields>) => (
          <div className="GasPriceSlider">
            <div className="GasPriceSlider-input-group">
              <div className="GasPriceSlider-slider">
                <SliderWithTooltip
                  {...field}
                  onChange={e => form.setFieldValue('gasPriceSlider', e)}
                  min={bounds.min}
                  max={bounds.max}
                  marks={gasNotches}
                  included={false}
                  value={actualGasPrice}
                  tipFormatter={this.formatTooltip}
                  step={bounds.min < 1 ? 0.1 : 1}
                />
                <div className="GasPriceSlider-slider-labels">
                  <span>{translate('TX_FEE_SCALE_LEFT')}</span>
                  <span>{translate('TX_FEE_SCALE_RIGHT')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    );
  }

  private makeGasNotches = (): Marks => {
    const { gasEstimates } = this.props;
    return gasEstimates
      ? {
          [gasEstimates.safeLow]: '',
          [gasEstimates.standard]: '',
          [gasEstimates.fast]: '',
          [gasEstimates.fastest]: ''
        }
      : {};
  };

  private formatTooltip = (gas: number) => {
    const { gasEstimates } = this.props;
    if (!(gasEstimates && !gasEstimates.isDefault)) {
      return '';
    }

    const gasTooltips: GasTooltips = {
      [gasEstimates.fast]: translateRaw('TX_FEE_RECOMMENDED_FAST'),
      [gasEstimates.fastest]: translateRaw('TX_FEE_RECOMMENDED_FASTEST'),
      [gasEstimates.safeLow]: translateRaw('TX_FEE_RECOMMENDED_SAFELOW'),
      [gasEstimates.standard]: translateRaw('TX_FEE_RECOMMENDED_STANDARD')
    };

    const recommended = gasTooltips[gas] || '';
    const x = translateRaw('GAS_GWEI_COST', {
      $gas: gas.toString(),
      $recommended: recommended
    });

    return x;
  };
}
