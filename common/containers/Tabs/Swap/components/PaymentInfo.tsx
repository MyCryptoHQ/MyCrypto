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
        <h2>
          {translate('SWAP_SEND_TO', {
            $origin_amount: origin.amount.toString(),
            $origin_label: origin.label
          })}
          <Input
            className="SwapPayment-address"
            isValid={!!this.props.paymentAddress}
            value={this.props.paymentAddress || undefined}
            disabled={true}
          />
        </h2>
      </section>
    );
  }
}
