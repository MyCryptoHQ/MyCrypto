// @flow
import React, { Component } from 'react';
import type {
  DestinationAddressSwapAction,
  ChangeStepSwapAction,
  StopLoadBityRatesSwapAction,
  BityOrderCreateRequestedSwapAction
} from 'actions/swapTypes';
import { donationAddressMap } from 'config/data';
import { isValidBTCAddress, isValidETHAddress } from 'libs/validators';
import translate from 'translations';
import { combineAndUpper } from 'utils/formatters';
import SimpleButton from 'components/ui/SimpleButton';

export type StateProps = {
  isPostingOrder: boolean,
  originAmount: number,
  originKind: string,
  destinationKind: string,
  destinationAddress: string
};

export type ActionProps = {
  destinationAddressSwap: (value: ?string) => DestinationAddressSwapAction,
  changeStepSwap: (value: number) => ChangeStepSwapAction,
  stopLoadBityRatesSwap: () => StopLoadBityRatesSwapAction,
  bityOrderCreateRequestedSwap: (
    amount: number,
    destinationAddress: string,
    pair: string,
    mode: ?number
  ) => BityOrderCreateRequestedSwapAction
};

export default class ReceivingAddress extends Component {
  props: StateProps & ActionProps;

  onChangeDestinationAddress = (event: SyntheticInputEvent) => {
    const value = event.target.value;
    this.props.destinationAddressSwap(value);
  };

  onClickPartTwoComplete = () => {
    this.props.bityOrderCreateRequestedSwap(
      this.props.originAmount,
      this.props.destinationAddress,
      combineAndUpper(this.props.originKind, this.props.destinationKind)
    );
  };

  render() {
    const { destinationKind, destinationAddress, isPostingOrder } = this.props;
    let validAddress;
    // TODO - find better pattern here once currencies move beyond BTC, ETH, REP
    if (this.props.destinationKind === 'BTC') {
      validAddress = isValidBTCAddress(destinationAddress);
    } else {
      validAddress = isValidETHAddress(destinationAddress);
    }

    return (
      <article className="swap-start">
        <section className="swap-address block">
          <section className="row">
            <div className="col-sm-8 col-sm-offset-2 col-xs-12">
              <label>
                <span>
                  {translate('SWAP_rec_add')}
                </span>
                <strong>
                  {' '}({destinationKind})
                </strong>
              </label>
              <input
                className={`form-control ${validAddress
                  ? 'is-valid'
                  : 'is-invalid'}`}
                type="text"
                value={destinationAddress}
                onChange={this.onChangeDestinationAddress}
                placeholder={donationAddressMap[destinationKind]}
              />
            </div>
          </section>
          <section className="row text-center">
            <SimpleButton
              text={translate('SWAP_start_CTA')}
              onClick={this.onClickPartTwoComplete}
              disabled={!validAddress}
              loading={isPostingOrder}
            />
          </section>
        </section>
      </article>
    );
  }
}
