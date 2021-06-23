import { useEffect, useState } from 'react';

import Slider, { createSliderWithTooltip } from 'rc-slider';
import styled from 'styled-components';

import { COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { GasEstimates, Network } from '@types';
import './GasPriceSlider.scss';

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface Props {
  gasPrice: string;
  gasEstimates: GasEstimates;
  network: Network;
  onChange(value: number): void;
}

interface GasTooltips {
  [estimationLevel: string]: string;
}

const Label = styled.span`
  &&& {
    color: ${COLORS.BLUE_GREY};
  }
`;

const SimpleGas = ({ gasPrice: gasPriceProp, gasEstimates, onChange }: Props) => {
  const [gasPrice, setGasPrice] = useState(gasPriceProp);

  useEffect(() => {
    if (gasPrice !== gasPriceProp) {
      setGasPrice(gasPriceProp);
    }
  }, [gasPriceProp]);

  const handleChange = (e: number) => setGasPrice(e.toString());

  const gasNotches = gasEstimates
    ? {
        [gasEstimates.safeLow]: '',
        [gasEstimates.standard]: '',
        [gasEstimates.fast]: '',
        [gasEstimates.fastest]: ''
      }
    : {};

  const gasTooltips: GasTooltips = {
    [gasEstimates.fast]: translateRaw('TX_FEE_RECOMMENDED_FAST'),
    [gasEstimates.fastest]: translateRaw('TX_FEE_RECOMMENDED_FASTEST'),
    [gasEstimates.safeLow]: translateRaw('TX_FEE_RECOMMENDED_SAFELOW'),
    [gasEstimates.standard]: translateRaw('TX_FEE_RECOMMENDED_STANDARD')
  };

  const formatTooltip = () => {
    const recommended = gasTooltips[parseFloat(gasPrice)] || '';
    return translateRaw('GAS_GWEI_COST', {
      $gas: gasPrice.toString(),
      $recommended: recommended
    });
  };

  const actualGasPrice = Math.max(parseFloat(gasPrice), gasEstimates.safeLow);
  return (
    <div className="GasPriceSlider">
      <div className="GasPriceSlider-input-group">
        <div className="GasPriceSlider-slider">
          <SliderWithTooltip
            onChange={handleChange}
            onAfterChange={onChange}
            min={gasEstimates.safeLow}
            max={gasEstimates.fastest}
            marks={gasNotches}
            included={false}
            value={actualGasPrice}
            tipFormatter={formatTooltip}
            step={gasEstimates.safeLow < 1 ? 0.1 : 1}
          />
          <div className="GasPriceSlider-slider-labels">
            <Label>{translate('TX_FEE_SCALE_LEFT')}</Label>
            <Label>{translate('TX_FEE_SCALE_RIGHT')}</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGas;
