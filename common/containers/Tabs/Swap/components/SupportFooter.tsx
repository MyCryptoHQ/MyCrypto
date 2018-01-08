import React from 'react';
import './SupportFooter.scss';
import { SwapInput } from 'actions/swap';
import { NormalizedBityRates, NormalizedShapeshiftRates } from 'reducers/swap/types';

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

class SupportFooter extends React.Component<Props, {}> {
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
    const pair = origin && destination ? origin.id + destination.id : 'BTCETH';
    const rates = provider === 'shapeshift' ? shapeshiftRates.byId : bityRates.byId;
    const emailTo =
      provider === 'shapeshift'
        ? 'support@myetherwallet.com'
        : 'support@myetherwallet.com,mew@bity.com';
    const mailSubject = encodeURI('Issue regarding my Swap via MEW');
    const serviceProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
    let mailBody;
    let fallbackBody;
    if (pair && rates && rates[pair]) {
      mailBody = encodeURI(`Please include the below if this issue is regarding your order.

Provider: ${serviceProvider}

REF ID#: ${reference || ''}

Amount to send: ${origin.amount || ''} ${origin.id}

Amount to receive: ${destination.amount || ''} ${destination.id}

Payment Address: ${paymentAddress || ''}

Receiving Address: ${destinationAddress || ''}

Rate: ${rates[pair].rate} ${origin.id}/${destination.id}
        `);
      fallbackBody = `To: ${emailTo}
Subject: Issue regarding my Swap via MEW
Message:
Provider: ${serviceProvider}
REF ID#: ${reference || ''}
Amount to send: ${origin.amount || ''} ${origin.id}
Amount to receive: ${destination.amount || ''} ${destination.id}
Payment Address: ${paymentAddress || ''}
Receiving Address: ${destinationAddress || ''}
Rate: ${rates[pair].rate} ${origin.id}/${destination.id}`;
    }
    return (
      <section className="SupportFooter">
        <a
          className="btn-warning btn-sm"
          href={`mailto:${emailTo}?Subject=${mailSubject}&Body=${mailBody}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Issue with your Swap? Contact support
        </a>
        <div className="SupportFooter-fallback">
          <p onClick={this.toggleFallback}>
            <small>Click here if link doesn't work</small>
          </p>
          {open ? (
            <textarea defaultValue={fallbackBody} className="form-control input-sm" rows={9} />
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
