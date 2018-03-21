import React from 'react';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import translate from 'translations';
import { AppState } from 'reducers';
import {
  Wei,
  fromTokenBase,
  getDecimalFromEtherUnit,
  timeBountyValueToRaw,
  timeBountyRawToValue
} from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
const SliderWithTooltip = createSliderWithTooltip(Slider);

interface OwnProps {
  timeBounty: AppState['transaction']['fields']['timeBounty'];

  inputTimeBounty(rawTimeBounty: string): void;
}

class TimeBounty extends React.Component<OwnProps> {
  public render() {
    const { timeBounty } = this.props;

    const bounds = {
      max: EAC_SCHEDULING_CONFIG.TIME_BOUNTY_MAX,
      min: EAC_SCHEDULING_CONFIG.TIME_BOUNTY_MIN
    };

    return (
      <div className="row form-group">
        <div className="flex-wrapper">
          <label>{translate('SCHEDULE_bounty')} </label>
        </div>

        <div className="SimpleGas-input-group">
          <div className="SimpleGas-slider">
            <SliderWithTooltip
              onChange={this.handleSlider}
              min={bounds.min}
              max={bounds.max}
              step={bounds.min < 1 ? 0.1 : 1}
              value={this.getTimeBountyRaw(timeBounty.value)}
              tipFormatter={this.formatTooltip}
              disabled={false}
            />
            <div className="SimpleGas-slider-labels">
              <span>{translate('Small')}</span>
              <span>{translate('Big')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleSlider = (timeBounty: number) => {
    this.props.inputTimeBounty(timeBounty.toString());
  };

  private getTimeBountyRaw(timeBountyValue: Wei) {
    return parseFloat(timeBountyValueToRaw(timeBountyValue));
  }

  private formatTooltip = (timeBounty: number) => {
    const valueInETH = fromTokenBase(
      timeBountyRawToValue(timeBounty),
      getDecimalFromEtherUnit('ether')
    );

    return `${valueInETH} ETH`;
  };
}

export default TimeBounty;
