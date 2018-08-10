import React, { PureComponent } from 'react';

import { donationAddressMap, WhitelistedCoins } from 'config';
import translate, { translateRaw } from 'translations';
import { isValidBTCAddress, isValidETHAddress, isValidXMRAddress } from 'libs/validators';
import { combineAndUpper } from 'utils/formatters';
import { SwapInput } from 'features/swap/types';
import {
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TShapeshiftOrderCreateRequestedSwap,
  TStopLoadBityRatesSwap
} from 'features/swap/actions';
import SimpleButton from 'components/ui/SimpleButton';
import { Input } from 'components/ui';
import './ReceivingAddress.scss';

export interface StateProps {
  origin: SwapInput;
  destinationId: WhitelistedCoins;
  isPostingOrder: boolean;
  destinationAddress: string;
  destinationKind: number;
  provider: string;
}

export interface ActionProps {
  destinationAddressSwap: TDestinationAddressSwap;
  changeStepSwap: TChangeStepSwap;
  stopLoadBityRatesSwap: TStopLoadBityRatesSwap;
  bityOrderCreateRequestedSwap: TBityOrderCreateRequestedSwap;
  shapeshiftOrderCreateRequestedSwap: TShapeshiftOrderCreateRequestedSwap;
}

export default class ReceivingAddress extends PureComponent<StateProps & ActionProps, {}> {
  public onChangeDestinationAddress = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    this.props.destinationAddressSwap(value);
  };

  public onClickPartTwoComplete = () => {
    const { origin, destinationId, destinationAddress, destinationKind, provider } = this.props;
    if (!origin) {
      return;
    }
    if (provider === 'shapeshift') {
      this.props.shapeshiftOrderCreateRequestedSwap(
        destinationAddress,
        origin.label,
        destinationId,
        destinationKind
      );
    } else {
      this.props.bityOrderCreateRequestedSwap(
        origin.amount as number,
        this.props.destinationAddress,
        combineAndUpper(origin.label, destinationId)
      );
    }
  };

  public render() {
    const { destinationId, destinationAddress, isPostingOrder } = this.props;

    const addressValidators: { [coinOrToken: string]: (address: string) => boolean } = {
      BTC: isValidBTCAddress,
      XMR: isValidXMRAddress,
      ETH: isValidETHAddress
    };
    // If there is no matching validator for the ID, assume it's a token and use ETH.
    const addressValidator = addressValidators[destinationId] || addressValidators.ETH;
    const validAddress = addressValidator(destinationAddress);

    const placeholders: { [coinOrToken: string]: string } = {
      BTC: donationAddressMap.BTC,
      XMR: donationAddressMap.XMR,
      ETH: donationAddressMap.ETH
    };
    const placeholder = placeholders[destinationId] || donationAddressMap.ETH;

    return (
      <section className="SwapAddress block">
        <section className="row">
          <div className="col-sm-8 col-sm-offset-2 col-xs-12">
            <label className="SwapAddress-address">
              <h4 className="SwapAddress-address-label">
                {translate('SWAP_REC_ADD')} ({destinationId})
              </h4>

              <Input
                isValid={validAddress}
                className="SwapAddress-address-input"
                type="text"
                value={destinationAddress}
                onChange={this.onChangeDestinationAddress}
                placeholder={placeholder}
              />
            </label>
          </div>
        </section>

        <section className="SwapAddress-submit row">
          <SimpleButton
            text={translateRaw('SWAP_START_CTA')}
            onClick={this.onClickPartTwoComplete}
            disabled={!validAddress}
            loading={isPostingOrder}
          />
        </section>
      </section>
    );
  }
}
