import React, { PureComponent } from 'react';
import translate from 'translations';
import { SwapInput } from 'reducers/swap/types';
import './PaymentInfo.scss';
import { Input } from 'components/ui';

export interface Props {
  origin: SwapInput;
  paymentAddress: string | null;
}

export default class PaymentInfo extends PureComponent<Props, {}> {
  public render() {
    const { origin } = this.props;
    return (
      <section className="SwapPayment">
        <h1>
          <span>{translate('SWAP_order_CTA')}</span>
          <strong>
            {' '}
            {origin.amount} {origin.label}
          </strong>
          <span> {translate('SENDModal_Content_2')}</span>
          <Input
            className="SwapPayment-address"
            value={this.props.paymentAddress || undefined}
            disabled={true}
          />
        </h1>
      </section>
    );
  }
}
