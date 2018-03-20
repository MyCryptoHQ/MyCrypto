import {
  TBityOrderCreateRequestedSwap,
  TChangeStepSwap,
  TDestinationAddressSwap,
  TShapeshiftOrderCreateRequestedSwap,
  TStopLoadBityRatesSwap
} from 'actions/swap';
import { SwapInput } from 'reducers/swap/types';
import SimpleButton from 'components/ui/SimpleButton';
import { donationAddressMap } from 'config';
import { isValidBTCAddress, isValidETHAddress } from 'libs/validators';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import { combineAndUpper } from 'utils/formatters';
import './ReceivingAddress.scss';
import { Input } from 'components/ui';

export interface StateProps {
  origin: SwapInput;
  destinationId: keyof typeof donationAddressMap;
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
    let validAddress;
    // TODO - find better pattern here once currencies move beyond BTC, ETH, REP
    if (destinationId === 'BTC') {
      validAddress = isValidBTCAddress(destinationAddress);
    } else {
      validAddress = isValidETHAddress(destinationAddress);
    }

    return (
      <section className="SwapAddress block">
        <section className="row">
          <div className="col-sm-8 col-sm-offset-2 col-xs-12">
            <label className="SwapAddress-address">
              <h4 className="SwapAddress-address-label">
                {translate('SWAP_REC_ADD')} ({destinationId})
              </h4>

              <Input
                className={`SwapAddress-address-input ${!validAddress ? 'invalid' : ''}`}
                type="text"
                value={destinationAddress}
                onChange={this.onChangeDestinationAddress}
                placeholder={
                  destinationId === 'BTC'
                    ? donationAddressMap[destinationId]
                    : donationAddressMap.ETH
                }
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
