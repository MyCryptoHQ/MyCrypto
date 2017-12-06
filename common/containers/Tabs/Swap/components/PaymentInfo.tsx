import React, { Component } from 'react';
import translate from 'translations';
import { SwapInput } from 'reducers/swap/types';
import './PaymentInfo.scss';

export interface Props {
  origin: SwapInput;
  paymentAddress: string | null;
}

export default class PaymentInfo extends Component<Props, {}> {
  public render() {
    const { origin } = this.props;
    return (
      <section className="SwapPayment">
        <h1>
          <span>{translate('SWAP_order_CTA')}</span>
          <strong>
            {' '}
            {origin.amount} {origin.id}
          </strong>
          <span> {translate('SENDModal_Content_2')}</span>
          <input
            className="SwapPayment-address form-control"
            value={this.props.paymentAddress || undefined}
            disabled={true}
          />
        </h1>
      </section>
    );
  }
}
