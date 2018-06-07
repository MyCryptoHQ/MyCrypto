import React from 'react';
import translate from 'translations';
import Help from 'components/ui/Help';

export class PrivacyRadio extends React.Component<any, any> {
  public render() {
    return (
      <div className="PrivacyRadio input-group-wrapper">
        <label className="PrivacyRadio-group input-group input-group-inline" htmlFor="amount">
          <div className="input-group-header">
            <div className="">{translate('PRIVACY_RADIO')}</div>
            <Help size="x1" link="https://support.mycrypto.com/" />
            <div className="flex-spacer" />
          </div>
          <div className="PrivacyRadio-button-wrapper">
            <button className="PrivacyRadio-button">Low</button>
            <button className="PrivacyRadio-button">Medium</button>
            <button className="PrivacyRadio-button">High</button>
          </div>
        </label>
      </div>
    );
  }
}
