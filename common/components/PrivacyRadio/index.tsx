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
    return (
      <div className="PrivacyRadio input-group-wrapper">
        <div className="PrivacyRadio-group input-group input-group-inline">
          <div className="input-group-header">
            <div className="">{translate('PRIVACY_RADIO')}</div>
            <Help size="x1" link="https://support.mycrypto.com/" />
            <div className="flex-spacer" />
          </div>
          <div className="PrivacyRadio-button-wrapper">
            <div
              className={`PrivacyRadio-sliding-border ${
                option.type === 'high' ? 'high' : option.type === 'medium' ? 'medium' : ''
              }`}
            />
            <button
              className={`PrivacyRadio-button ${option.type === 'low' && 'selected'}`}
              onClick={() => this.onClick('low', ringSize.low)}
            >
              <span className="PrivacyRadio-button-level">Low: {prices.low}</span>
              <span className="PrivacyRadio-button-ringsize small">ring size: {ringSize.low}</span>
            </button>
            <button
              className={`PrivacyRadio-button ${option.type === 'medium' && 'selected'}`}
              onClick={() => this.onClick('medium', ringSize.medium)}
            >
              <span className="PrivacyRadio-button-level">Medium: {prices.medium}</span>
              <span className="PrivacyRadio-button-ringsize small">
                ring size: {ringSize.medium}
              </span>
            </button>
            <button
              className={`PrivacyRadio-button ${option.type === 'high' && 'selected'}`}
              onClick={() => this.onClick('high', ringSize.high)}
            >
              <span className="PrivacyRadio-button-level">High: {prices.high}</span>
              <span className="PrivacyRadio-button-ringsize small">ring size: {ringSize.high}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
