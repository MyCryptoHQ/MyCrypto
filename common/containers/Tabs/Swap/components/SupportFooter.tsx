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
    let mailBody;
    let fallbackBody;
    if (pair && rates[pair]) {
      mailBody = encodeURI(`Please include the below if this issue is regarding your order. 

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
          // href="mailto:support@myetherwallet.com?Subject=%20Issue%20regarding%20my%20Swap%20via%20MEW%20&amp;Body=%0APlease%20include%20the%20below%20if%20this%20issue%20is%20regarding%20your%20order.%20%0A%0AREF%20ID%23%3A%20%0A%0AAmount%20to%20send%3A%20%20%0A%0AAmount%20to%20receive%3A%20%20%0A%0APayment%20Address%3A%20%0A%0ARate%3A%200.00000850%20SNGLS/BTC%0A%0A"
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
