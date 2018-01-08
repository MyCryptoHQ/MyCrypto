import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';
import { UnitDisplay } from 'components/ui';
import { Wei, TokenValue } from 'libs/units';
import ERC20 from 'libs/erc20';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getDecimal, getUnit } from 'selectors/transaction';

interface StateProps {
  unit: string;
  decimal: number;
  network: AppState['config']['network'];
}

class AmountClass extends Component<StateProps> {
  public render() {
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => {
          const transactionInstance = makeTransaction(serializedTransaction);
          const { value, data } = getTransactionFields(transactionInstance);
          const { decimal, unit, network } = this.props;
          const handledValue =
            unit === 'ether' ? Wei(value) : TokenValue(ERC20.transfer.decodeInput(data)._value);
          return (
            <UnitDisplay
              decimal={decimal}
              value={handledValue}
              symbol={network.unit}
              checkOffline={false}
            />
          );
        }}
      />
    );
  }
}

export const Amount = connect((state: AppState) => ({
  decimal: getDecimal(state),
  unit: getUnit(state),
  network: state.config.network
}))(AmountClass);
