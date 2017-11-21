import React, { Component } from 'react';
import EthTx from 'ethereumjs-tx';
import { TokenBalance } from 'selectors/wallet';
import { Wei } from 'libs/units';
import {
  UnitConverter,
  GetTransactionMetaFields,
  SetUnitMetaField,
  SetTransactionField,
  SetTokenValueMetaField,
  Transaction,
  Query
} from 'components/renderCbs';
import {
  SetValueFieldAction,
  SetTokenValueMetaAction
} from 'actions/transaction';
import BN from 'bn.js';

interface Props {
  value: string | null;
  transaction: EthTx | null;
  setter(
    payload: SetValueFieldAction['payload'] | SetTokenValueMetaAction['payload']
  );
}

class AmountFieldClass extends Component<Props, {}> {
  public componentDidMount() {
    const { value, setter } = this.props;
    if (value) {
      setter({ raw: value, value: new BN(value) }); //we dont know if its wei or token balance
    }
  }
  public render() {
    return null;
  }
  private handleSendEverything = () => {};
  private setValue = () => {};
  private validInput = (input: string) => isFinite(+input) && +input > 0;
}

const AmountField = (
  <Query
    params={['value']}
    withQuery={({ value }) => (
      <Transaction
        withTransaction={({ transaction }) => (
          <GetTransactionMetaFields
            withFieldValues={({ unit }) => {
              const partialAmountField = setter => (
                <AmountFieldClass
                  value={value}
                  transaction={transaction}
                  setter={setter}
                />
              );

              return unit === 'ether' ? (
                <SetTransactionField
                  name="value"
                  withFieldSetter={partialAmountField}
                />
              ) : (
                <SetTokenValueMetaField
                  withTokenBalanceSetter={partialAmountField}
                />
              );
            }}
          />
        )}
      />
    )}
  />
);
