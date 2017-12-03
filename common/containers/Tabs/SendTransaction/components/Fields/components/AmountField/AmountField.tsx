import React, { Component } from 'react';
import EthTx from 'ethereumjs-tx';
import { Wei, TokenValue, toTokenBase } from 'libs/units';
import { enoughBalance, enoughTokens } from 'libs/transaction';
import {
  GetTransactionMetaFields,
  SetTransactionField,
  SetTokenValueMetaField,
  CurrentBalance,
  CurrentValue,
  Transaction,
  Query
} from 'components/renderCbs';
import {
  SetValueFieldAction,
  SetTokenValueMetaAction
} from 'actions/transaction';

import { AmountInput } from './AmountInput';

interface Props {
  currentValue;
  decimal: number;
  value: string | null;
  balance: Wei | TokenValue | null | undefined;
  transaction: EthTx;
  unit: string;
  setter(
    payload: SetValueFieldAction['payload'] | SetTokenValueMetaAction['payload']
  );
}

class AmountFieldClass extends Component<Props, {}> {
  public componentDidMount() {
    const { value, setter } = this.props;
    if (value) {
      setter({ raw: value, value: TokenValue(value) }); //we dont know if its wei or token balance
    }
    this.validateBalances(this.props);
  }

  public render() {
    return <AmountInput onChange={this.setValue} />;
  }

  private validateBalances = (props: Props) => {
    const { transaction, balance, unit, setter, currentValue } = props;
    // do validation based on unit
    if (balance) {
      // this check should skip when offline since balance will be unavailable
      let valid = false;
      if (unit === 'ether') {
        valid = enoughBalance(transaction, balance);
      } else {
        valid = enoughTokens(transaction, currentValue.value, balance);
      }
      if (!valid && currentValue.value !== null) {
        setter({ value: null });
      }
    }
  };
  private setValue = (ev: React.FormEvent<HTMLInputElement>) => {
    const { balance, decimal } = this.props;
    const { value } = ev.currentTarget;

    const valid = validNumber(value, balance, decimal);

    if (!valid) {
      this.props.setter({ raw: value, value: null });
    } else {
      const baseUnit = toTokenBase(value, this.props.decimal);
      this.props.setter({ raw: value, value: baseUnit });
    }
  };
}

const validNumber = (
  numStr: string,
  balance: Wei | TokenValue | null | undefined,
  decimal: number
) => {
  const validNum = isFinite(+numStr) && +numStr > 0;
  if (balance && validNum) {
    const validBalance = toTokenBase(numStr, decimal).lte(balance);
    return validBalance;
  }
  return false;
};

export const AmountField: React.SFC<{}> = () => (
  <Query
    params={['value']}
    withQuery={({ value }) => (
      <CurrentValue
        withValue={({ value: currentValue }) => (
          <CurrentBalance
            withBalance={({ balance }) => (
              <Transaction
                withTransaction={({ transaction }) => (
                  <GetTransactionMetaFields
                    withFieldValues={({ unit, decimal }) => {
                      const partialAmountField = setter => (
                        <AmountFieldClass
                          currentValue={currentValue}
                          value={value}
                          balance={balance}
                          transaction={transaction}
                          setter={setter}
                          unit={unit}
                          decimal={decimal}
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
        )}
      />
    )}
  />
);
