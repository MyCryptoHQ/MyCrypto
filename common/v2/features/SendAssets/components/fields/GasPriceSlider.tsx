import React, { Component } from 'react';
import { Field, FieldProps } from 'formik';
import Slider, { createSliderWithTooltip, Marks } from 'rc-slider';
import styled from 'styled-components';

import translate, { translateRaw } from 'v2/translations';
import { GAS_PRICE_DEFAULT } from 'v2/config';
import { GasEstimates, IFormikFields, Network } from 'v2/types';
import { COLORS } from 'v2/theme';
import './GasPriceSlider.scss';

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface OwnProps {
  gasPrice: string;
  gasEstimates: GasEstimates;
  network: Network;
}

type Props = OwnProps;

interface State {
  gasPrice: string;
  hasSetRecommendedGasPrice: boolean;
  realGasPrice: number;
}

interface GasTooltips {
  [estimationLevel: string]: string;
}

const Label = styled.span`
  &&& {
    color: ${COLORS.BLUE_GREY};
  }
`;

export default class SimpleGas extends Component<Props> {
  public state: State = {
    gasPrice: this.props.gasPrice,
    hasSetRecommendedGasPrice: false,
    realGasPrice: 0
  };

  public render() {
    const { gasEstimates } = this.props;
    const { gasPrice } = this.state;
    const bounds = {
      max: gasEstimates ? gasEstimates.fastest : GAS_PRICE_DEFAULT.max,
      min: gasEstimates ? gasEstimates.safeLow : GAS_PRICE_DEFAULT.min
    };
    const gasNotches = this.makeGasNotches();

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
                  onChange={(e) => {
                    this.setState({ gasPrice: e.toString() });
                  }}
                  onAfterChange={(e) => {
                    form.setFieldValue('gasPriceSlider', e);
                  }}
                  min={bounds.min}
                  max={bounds.max}
                  marks={gasNotches}
                  included={false}
                  value={actualGasPrice}
                  tipFormatter={this.formatTooltip}
                  step={bounds.min < 1 ? 0.1 : 1}
                />
                <div className="GasPriceSlider-slider-labels">
                  <Label>{translate('TX_FEE_SCALE_LEFT')}</Label>
                  <Label>{translate('TX_FEE_SCALE_RIGHT')}</Label>
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
    const { gasEstimates, network } = this.props;
    if (!(gasEstimates && !gasEstimates.isDefault) && !network.isTestnet) {
      return '';
    }

    const gasTooltips: GasTooltips = {
      [gasEstimates.fast]: translateRaw('TX_FEE_RECOMMENDED_FAST'),
      [gasEstimates.fastest]: translateRaw('TX_FEE_RECOMMENDED_FASTEST'),
      [gasEstimates.safeLow]: translateRaw('TX_FEE_RECOMMENDED_SAFELOW'),
      [gasEstimates.standard]: translateRaw('TX_FEE_RECOMMENDED_STANDARD')
    };

    const recommended = gasTooltips[gas] || '';

    return translateRaw('GAS_GWEI_COST', {
      $gas: gas.toString(),
      $recommended: recommended
    });
  };
}
