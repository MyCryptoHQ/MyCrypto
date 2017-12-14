import {
  getCurrentValue,
  getUnit,
  getGasCost,
  isEtherTransaction,
  getDecimal,
  ICurrentValue
} from 'selectors/transaction';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { UnitDisplay } from 'components/ui';
import { Wei, fromWei, getDecimalFromEtherUnit, isEtherUnit } from 'libs/units';

type TransactionState = AppState['transaction'];

interface StateProps {
  currentValue: ICurrentValue;
  unit: TransactionState['meta']['unit'];
  gasCostInWei: Wei;
  etherTransaction: boolean;
  decimal: TransactionState['meta']['decimal'];
}

function mapStateToProps(state: AppState) {
  return {
    currentValue: getCurrentValue(state),
    unit: getUnit(state),
    gasCostInWei: getGasCost(state),
    etherTransaction: isEtherTransaction(state),
    decimal: getDecimal(state)
  };
}

interface TotalSpentProps {
  currentValue: ICurrentValue;
  gasCostInWei;
}
const TotalSpentForEther: React.SFC<TotalSpentProps> = ({
  currentValue: { value },
  gasCostInWei
}) => (
  <UnitDisplay symbol="ETH" value={value ? value.add(gasCostInWei) : gasCostInWei} unit="ether" />
);
class CostBreakdownClass extends Component<StateProps> {
  public render() {
    const { currentValue, etherTransaction, gasCostInWei, unit, decimal } = this.props;
    const amountToSend = (
      <UnitDisplay
        symbol={isEtherUnit(unit) ? 'ETH' : unit}
        value={currentValue.value || Wei('0')}
        decimal={decimal}
      />
    );
    return (
      <div>
        <h5>Amount To Send: {amountToSend}</h5>

        <h5>
          Gas Cost: <UnitDisplay symbol="ETH" value={gasCostInWei} unit="ether" />
        </h5>
        <h5>
          {' '}
          Total Spent:{' '}
          {etherTransaction ? (
            <TotalSpentForEther currentValue={currentValue} gasCostInWei={gasCostInWei} />
          ) : (
            <div>
              <h5>
                <UnitDisplay symbol="ETH" value={gasCostInWei} unit="ether" />
              </h5>
              <h5>{amountToSend}</h5>
            </div>
          )}
        </h5>
      </div>
    );
  }
}

export const CostBreakdown = connect(mapStateToProps)(CostBreakdownClass);
