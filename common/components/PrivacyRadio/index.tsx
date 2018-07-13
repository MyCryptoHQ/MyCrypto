import React from 'react';
import translate from 'translations';
import Help from 'components/ui/Help';
import './PrivacyRadio.scss';

interface State {
  option: { type: string; value: string | number };
}

export class PrivacyRadio extends React.Component<any, State> {
  public state = {
    option: { type: 'low', value: 0 }
  };

  public componentDidMount() {
    //
  }

  public onClick = (type: string, value: string | number) => {
    this.setState({ option: { type, value } });
  };

  public render() {
    const { option } = this.state;
    const prices = { low: '$0.24', medium: '$0.34', high: '$0.85' };
    const ringSize = { low: '7', medium: '20', high: '40' };
    const buttons = [
      { type: 'low', price: prices.low, ringSize: ringSize.low },
      { type: 'medium', price: prices.medium, ringSize: ringSize.medium },
      { type: 'high', price: prices.high, ringSize: ringSize.high }
    ];
    return (
      <div className="PrivacyRadio input-group-wrapper">
        <div className="PrivacyRadio-group input-group input-group-inline">
          <div className="input-group-header">
            <div className="">{translate('PRIVACY_RADIO')}</div>
            <Help size="x1" link="https://support.mycrypto.com/" />
            <div className="flex-spacer" />
          </div>
          <div className="PrivacyRadio-button-wrapper">
            {buttons.map((btn, i) => (
              <button
                key={i}
                className={`PrivacyRadio-button ${option.type === btn.type && 'selected'}`}
                onClick={() => this.onClick(btn.type, btn.ringSize)}
              >
                <span className="PrivacyRadio-button-level">
                  {btn.type}: {btn.price}
                </span>
                <span className="PrivacyRadio-button-ringsize small">
                  ring size: {btn.ringSize}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
