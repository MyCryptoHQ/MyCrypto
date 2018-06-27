import React, { PureComponent } from 'react';

import translate from 'translations';
import { SwapInput } from 'features/swap/types';
import { Input, Warning } from 'components/ui';
import './PaymentInfo.scss';

export interface Props {
  origin: SwapInput;
  paymentAddress: string | null;
  /**
   * @desc
   * For XMR swaps, the "deposit" property in the response
   * actually refers to the "paymentId", not the payment address.
   */
  paymentId: string | null;
  /**
   * @desc
   * For XMR swap, the actual payment address is the "sAddress"
   * property in the response.
   */
  xmrPaymentAddress: string | null;
}

export default class PaymentInfo extends PureComponent<Props, {}> {
  public render() {
    const { origin, paymentAddress, paymentId, xmrPaymentAddress } = this.props;
    const isXMRSwap = origin.label === 'XMR';
    const actualPaymentAddress = isXMRSwap ? xmrPaymentAddress : paymentAddress;

    return (
      <section className="SwapPayment">
        {isXMRSwap && (
          <section className="SwapPayment-payment-id">
            <h2>
              {translate('USING_PAYMENT_ID')}
              <Input
                className="SwapPayment-address"
                isValid={!!paymentId}
                value={paymentId || undefined}
                disabled={true}
              />
            </h2>
          </section>
        )}
        <h2>
          {translate('SWAP_SEND_TO', {
            $origin_amount: origin.amount.toString(),
            $origin_label: origin.label
          })}
          <Input
            className="SwapPayment-address"
            isValid={!!actualPaymentAddress}
            value={actualPaymentAddress || undefined}
            disabled={true}
          />
        </h2>
        {isXMRSwap && (
          <Warning highlighted={true}>
            <h4>{translate('PAYMENT_ID_WARNING')}</h4>
          </Warning>
        )}
      </section>
    );
  }
}
