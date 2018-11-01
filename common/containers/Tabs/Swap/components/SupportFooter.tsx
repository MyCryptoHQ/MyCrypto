import React from 'react';

import translate from 'translations';
import { SwapInput, NormalizedBityRates, NormalizedShapeshiftRates } from 'features/swap/types';
import { TextArea } from 'components/ui';
import './SupportFooter.scss';

interface Props {
  origin: SwapInput;
  destination: SwapInput;
  destinationAddress: string | null;
  paymentAddress: string | null;
  reference: string | null;
  provider: string;
  shapeshiftRates: NormalizedShapeshiftRates;
  bityRates: NormalizedBityRates;
}

class SupportFooter extends React.PureComponent<Props, {}> {
  public state = {
    open: false
  };
  public render() {
    const { open } = this.state;
    const {
      origin,
      destination,
      destinationAddress,
      paymentAddress,
      reference,
      provider,
      shapeshiftRates,
      bityRates
    } = this.props;
    const pair = origin && destination ? origin.label + destination.label : 'BTCETH';
    const rates = provider === 'shapeshift' ? shapeshiftRates.byId : bityRates.byId;
    const emailTo =
      provider === 'shapeshift'
        ? 'support@shapeshift.zendesk.com,support@mycrypto.com'
        : 'support@mycrypto.com,mew@bity.com';
    const mailSubject = encodeURI('Issue regarding my Swap via MyCrypto');
    const serviceProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
    let mailBody;
    let fallbackBody;
    if (pair && rates && rates[pair]) {
      mailBody = encodeURI(`Please include the below if this issue is regarding your order.

Provider: ${serviceProvider}

REF ID#: ${reference || ''}

Amount to send: ${origin.amount || ''} ${origin.label}

Amount to receive: ${destination.amount || ''} ${destination.label}

Payment Address: ${paymentAddress || ''}

Receiving Address: ${destinationAddress || ''}

Rate: ${rates[pair].rate} ${origin.label}/${destination.label}
        `);
      fallbackBody = `To: ${emailTo}
Subject: Issue regarding my Swap via MyCrypto
Message:
Provider: ${serviceProvider}
REF ID#: ${reference || ''}
Amount to send: ${origin.amount || ''} ${origin.label}
Amount to receive: ${destination.amount || ''} ${destination.label}
Payment Address: ${paymentAddress || ''}
Receiving Address: ${destinationAddress || ''}
Rate: ${rates[pair].rate} ${destination.label}/${origin.label}`;
    }
    return (
      <section className="SupportFooter">
        <a
          className="SupportFooter-button btn-warning btn-sm"
          href={`mailto:${emailTo}?Subject=${mailSubject}&Body=${mailBody}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate('SWAP_SUPPORT')}
        </a>
        <div className="SupportFooter-fallback">
          <button className="SupportFooter-fallback-button" onClick={this.toggleFallback}>
            <small>{translate('SWAP_SUPPORT_LINK_BROKEN')}</small>
          </button>
          {open ? (
            <TextArea
              isValid={true}
              showValidAsPlain={true}
              defaultValue={fallbackBody}
              className="input-sm"
              rows={9}
            />
          ) : null}
        </div>
      </section>
    );
  }
  private toggleFallback = () => {
    this.setState({
      open: !this.state.open
    });
  };
}

export default SupportFooter;
