import {
  Query,
  CurrentBalance,
  Transaction,
  GetTransactionMetaFields,
  SetTokenValueMetaField,
  SetTransactionField,
  EtherBalance
} from 'components/renderCbs';
import React, { Component } from 'react';
import { TokenValue, Wei, fromTokenBase, fromWei } from 'libs/units';
import EthTx from 'ethereumjs-tx';
import {
  SetValueFieldAction,
  SetTokenValueMetaAction
} from 'actions/transaction';
import translate from 'translations';
import { connect } from 'react-redux';
import { showNotification, TShowNotification } from 'actions/notifications';
interface DispatchProps {
  notif: TShowNotification;
}
interface OwnProps {
  unit: string;
  etherBalance: Wei | null;
  currentBalance: Wei | TokenValue | null | undefined;
  decimal: number;
  transaction: EthTx;
  setter(
    payload: SetValueFieldAction['payload'] | SetTokenValueMetaAction['payload']
  );
}
type Props = OwnProps & DispatchProps;

class SendEverythingClass extends Component<Props> {
  public render() {
    if (!this.props.currentBalance) {
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
    const {
      unit,
      transaction,
      currentBalance,
      etherBalance,
      setter,
      decimal,
      notif
    } = this.props; // if its in ether, we need to have upfront-cost in account
    if (currentBalance && etherBalance) {
      // set transaction value to 0 so it's not calculated in the upfrontcost
      transaction.value = Buffer.from([]);
      const totalCost = transaction.getUpfrontCost();

      if (totalCost.gt(etherBalance)) {
        // Dust amount is too small
        notif(
          'warning',
          `The cost of gas is higher than your balance:
          Total cost: ${totalCost} > 
          Your Ether balance: ${etherBalance}`
        );
        return setter({ raw: '0', value: null });
      }

      if (unit === 'ether') {
        const remainder = currentBalance.sub(totalCost);
        const rawVersion = fromWei(remainder, 'ether');
        setter({ raw: rawVersion, value: remainder });
      } else {
        // else we just max out the token value
        const rawVersion = fromTokenBase(currentBalance, decimal);
        setter({ raw: rawVersion, value: currentBalance });
      }
    }
  };
}

const Placeholder = connect(null, { notif: showNotification })(
  SendEverythingClass
);

//remove this for selectors
export const SendEverything: React.SFC<{}> = () => (
  <EtherBalance
    withBalance={({ balance: etherBalance }) => (
      <CurrentBalance
        withBalance={({ balance: currentBalance }) => (
          <Transaction
            withTransaction={({ transaction }) => (
              <GetTransactionMetaFields
                withFieldValues={({ decimal, unit }) => (
                  <SetTokenValueMetaField
                    withTokenBalanceSetter={tokenValueSetter => (
                      <SetTransactionField
                        name="value"
                        withFieldSetter={valueSetter => (
                          <Placeholder
                            etherBalance={etherBalance}
                            decimal={decimal}
                            currentBalance={currentBalance}
                            setter={
                              unit === 'ether' ? valueSetter : tokenValueSetter
                            }
                            transaction={transaction}
                            unit={unit}
                          />
                        )}
                      />
                    )}
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
