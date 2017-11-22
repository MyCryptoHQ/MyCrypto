import {
  Query,
  CurrentBalance,
  Transaction,
  GetTransactionMetaFields,
  SetTokenValueMetaField,
  SetTransactionField
} from 'components/renderCbs';
import React, { Component } from 'react';
import { TokenValue, Wei, fromTokenBase, fromWei } from 'libs/units';
import EthTx from 'ethereumjs-tx';
import {
  SetValueFieldAction,
  SetTokenValueMetaAction
} from 'actions/transaction';
import translate from 'translations';

interface Props {
  unit: string;
  balance: Wei | TokenValue | null | undefined;
  decimal: number;
  transaction: EthTx;
  setter(
    payload: SetValueFieldAction['payload'] | SetTokenValueMetaAction['payload']
  );
}

class SendEverythingClass extends Component<Props, {}> {
  public render() {
    if (!this.props.balance) {
      return null;
    }
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          !readOnly ? (
            <span className="help-block">
              <a onClick={this.onSendEverything}>
                <span className="strong">
                  {translate('SEND_TransferTotal')}
                </span>
              </a>
            </span>
          ) : null
        }
      />
    );
  }
  private onSendEverything = () => {
    const { unit, transaction, balance, setter, decimal } = this.props; // if its in ether, we need to have upfront-cost in account
    if (balance) {
      if (unit === 'ether') {
        const remainder = balance.sub(transaction.getUpfrontCost());
        const rawVersion = fromWei(remainder, 'ether');
        setter({ raw: rawVersion, value: remainder });
      } else {
        // else we just max out the token value
        const rawVersion = fromTokenBase(balance, decimal);
        setter({ raw: rawVersion, value: balance });
      }
    }
  };
}

export const SendEverything: React.SFC<{}> = () => (
  <CurrentBalance
    withBalance={({ balance }) => (
      <Transaction
        withTransaction={({ transaction }) => (
          <GetTransactionMetaFields
            withFieldValues={({ decimal, unit }) => {
              const partialSendEverything = setter => (
                <SendEverythingClass
                  decimal={decimal}
                  balance={balance}
                  setter={setter}
                  transaction={transaction}
                  unit={unit}
                />
              );

              return unit === 'ether' ? (
                <SetTransactionField
                  name="value"
                  withFieldSetter={partialSendEverything}
                />
              ) : (
                <SetTokenValueMetaField
                  withTokenBalanceSetter={partialSendEverything}
                />
              );
            }}
          />
        )}
      />
    )}
  />
);
