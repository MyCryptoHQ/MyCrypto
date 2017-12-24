import { Identicon } from 'components/ui';
import { SerializedTransaction } from 'components/renderCbs';
import { makeTransaction, getTransactionFields } from 'libs/transaction';
import ERC20 from 'libs/erc20';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getUnit } from 'selectors/transaction';

interface StateProps {
  unit: string;
}
//got duplication here

class SummaryToClass extends Component<StateProps> {
  public render() {
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => {
          const transactionInstance = makeTransaction(serializedTransaction);
          const { to, data } = getTransactionFields(transactionInstance);

          return (
            <div className="ConfModal-summary-icon ConfModal-summary-icon--to">
              <Identicon
                size="100%"
                address={this.props.unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}
              />
            </div>
          );
        }}
      />
    );
  }
}

export const SummaryTo = connect((state: AppState) => ({ unit: getUnit(state) }))(SummaryToClass);
