import React, { Component } from 'react';
import EthTx from 'ethereumjs-tx';
import { TokenBalance } from 'selectors/wallet';
import { Wei } from 'libs/units';
import {
  UnitConverter,
  GetTransactionMetaFields,
  SetTransactionField,
  Transaction,
  Query
} from 'components/renderCbs';
import { SetValueFieldAction } from 'actions/transaction';

interface Props {
  value: string | null;
  transaction: EthTx | null;
  setter(payload: SetValueFieldAction['payload']);
}

class AmountFieldClass extends Component<Props, {}> {
  public render() {
    return null;
  }
}

const AmountField = (
  <Query
    params={['value']}
    withQuery={({ value }) => (
      <Transaction
        withTransaction={({ transaction }) => (
          <SetTransactionField
            name="value"
            withFieldSetter={setter => (
              <AmountFieldClass
                value={value}
                transaction={transaction}
                setter={setter}
              />
            )}
          />
        )}
      />
    )}
  />
);

export const AmountFields: React.SFC<{}> = props => {
  const { balance, decimal, readOnly } = props;

  const callWithBaseUnit = ({ currentTarget: { value } }) =>
    props.readOnly && props.onAmountChange(value, props.unit);

  const onSendEverything = () =>
    props.readOnly && props.onAmountChange('everything', props.unit);

  const validInput = (input: string) => isFinite(+input) && +input > 0;

  return null;
};
/*
<div className="row form-group">
  <div className="col-xs-11">

  </div>
    </div>
    */
