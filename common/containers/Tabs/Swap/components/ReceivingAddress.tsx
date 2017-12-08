import {
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TStopLoadBityRatesSwap
} from 'actions/swap';
import { SwapInput } from 'reducers/swap/types';
import classnames from 'classnames';
import SimpleButton from 'components/ui/SimpleButton';
import { donationAddressMap } from 'config/data';
import { isValidBTCAddress, isValidETHAddress } from 'libs/validators';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import './ReceivingAddress.scss';

export interface StateProps {
  origin: SwapInput;
  destinationId: string;
  isPostingOrder: boolean;
  destinationAddress: string;
}

export interface ActionProps {
  destinationAddressSwap: TDestinationAddressSwap;
  changeStepSwap: TChangeStepSwap;
  stopLoadBityRatesSwap: TStopLoadBityRatesSwap;
  bityOrderCreateRequestedSwap: TBityOrderCreateRequestedSwap;
}

export default class ReceivingAddress extends Component<StateProps & ActionProps, {}> {
  public onChangeDestinationAddress = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    this.props.destinationAddressSwap(value);
  };

  public onClickPartTwoComplete = () => {
    const { origin, destinationId } = this.props;
    if (!origin) {
      return;
    }
    this.props.bityOrderCreateRequestedSwap(
      origin.amount,
      this.props.destinationAddress,
      combineAndUpper(origin.id, destinationId)
    );
  };

  public render() {
    const { destinationId, destinationAddress, isPostingOrder } = this.props;
    let validAddress;
    // TODO - find better pattern here once currencies move beyond BTC, ETH, REP
    if (destinationId === 'BTC') {
      validAddress = isValidBTCAddress(destinationAddress);
    } else {
      validAddress = isValidETHAddress(destinationAddress);
    }

    const inputClasses = classnames({
      'SwapAddress-address-input': true,
      'form-control': true,
      'is-valid': validAddress,
      'is-invalid': !validAddress
    });

    return (
      <section className="SwapAddress block">
        <section className="row">
          <div className="col-sm-8 col-sm-offset-2 col-xs-12">
            <label className="SwapAddress-address">
              <h4 className="SwapAddress-address-label">
                {translate('SWAP_rec_add')} ({destinationId})
              </h4>

              <input
                className={inputClasses}
                type="text"
                value={destinationAddress}
                onChange={this.onChangeDestinationAddress}
                placeholder={donationAddressMap[destinationId]}
              />
            </label>
          </div>
        </section>

        <section className="SwapAddress-submit row">
          <SimpleButton
            text={translate('SWAP_start_CTA')}
            onClick={this.onClickPartTwoComplete}
            disabled={!validAddress}
            loading={isPostingOrder}
          />
        </section>
      </section>
    );
  }
}
