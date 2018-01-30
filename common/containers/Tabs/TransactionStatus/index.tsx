import React, { Component } from 'react';
import translate from 'translations';
import SimpleButton from 'components/ui/SimpleButton';
import TabSection from 'containers/TabSection';

export default class ViewWallet extends Component {
  public render() {
    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content-pane row block text-center">
          <div className="TransactionStatus">
            <h1 className="TransactionStatus-title">Check TX Status</h1>
            <p className="TransactionStatus-help">{translate('tx_Summary')}</p>
            <input placeholder="0x3f0efedfe0a0cd611f2465fac9a3699f92d6a06613bc3ead4f786856f5c73e9c" />
            <SimpleButton text={translate('NAV_CheckTxStatus')} type="primary" />
          </div>
        </div>
      </TabSection>
    );
  }
}
