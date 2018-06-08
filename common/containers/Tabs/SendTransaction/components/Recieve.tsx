import React from 'react';
import { AmountField, PaymentIdField } from 'components';

export class Recieve extends React.Component<any, any> {
  public render() {
    return (
      <div className="Tab-content-pane">
        <AmountField optional={true} networkId={'XMR'} hasUnitDropdown={false} />
        <PaymentIdField optional={true} />
      </div>
    );
  }
}
