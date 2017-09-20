import React, { Component } from 'react';
import translate from 'translations';
import './PaymentInfo.scss';

export interface Props {
  originKind: string;
  originAmount: string;
  paymentAddress: string;
}

export default class PaymentInfo extends Component<Props, {}> {
  public render() {
    return (
      <section className="SwapPayment">
        <h1>
          <span>
            {translate('SWAP_order_CTA')}
          </span>
          <strong>
            {' '}{this.props.originAmount} {this.props.originKind}
          </strong>
          <span>
            {' '}{translate('SENDModal_Content_2')}
          </span>
          <input
            className="SwapPayment-address form-control"
            value={this.props.paymentAddress}
            disabled
          />
        </h1>
      </section>
    );
  }
}
