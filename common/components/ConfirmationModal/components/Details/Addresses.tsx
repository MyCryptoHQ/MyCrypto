import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';
import ERC20 from 'libs/erc20';
import { From } from '../From';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUnit } from 'selectors/transaction';
import { AppState } from 'reducers';

interface StateProps {
  unit: string;
}

class AddressesClass extends Component<StateProps> {
  public render() {
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => {
          const transactionInstance = makeTransaction(serializedTransaction);
          const { to, data } = getTransactionFields(transactionInstance);

          return (
            <React.Fragment>
              <li className="ConfModal-details-detail">
                You are sending from <From withFrom={from => <code>{from}</code>} />
              </li>

              <li className="ConfModal-details-detail">
                You are sending to{' '}
                <code>
                  {this.props.unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}
                </code>
              </li>
            </React.Fragment>
          );
        }}
      />
    );
  }
}

export const Addresses = connect((state: AppState) => ({ unit: getUnit(state) }))(AddressesClass);

//got duplication here
