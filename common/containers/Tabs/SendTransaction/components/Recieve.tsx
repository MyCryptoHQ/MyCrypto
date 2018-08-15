import React from 'react';
import { AmountField, PaymentIdField } from 'components';
import { QRCode, Input } from 'components/ui';
import './Receive.scss';

export class Recieve extends React.Component<any, any> {
  public render() {
    return (
      <div className="Tab-content-pane">
        <QRCode className="XMR-qr" data={'0x0B536505855f585B09f75A0BA655F62B545Cd7B6'} />
        <div className="qr-input input-group-wrapper input-group">
          <Input
            readOnly={true}
            isValid={true}
            value="0x0B536505855f585B09f75A0BA655F62B545Cd7B60B536505855f585B09f75A0BA655F62B545Cd7B6"
          />
          <button
            className="Nonce-refresh input-group-inline-absolute-right"
            // onClick={requestNonce}
          >
            <i className="fa fa-copy" />
          </button>
        </div>
        <AmountField optional={true} networkId={'XMR'} hasUnitDropdown={false} />
        <PaymentIdField optional={true} />
      </div>
    );
  }
}
