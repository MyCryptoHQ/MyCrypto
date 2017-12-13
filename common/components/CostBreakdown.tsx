import {
  getCurrentValue,
  getUnit,
  getGasCost,
  isEtherTransaction,
  getDecimal
} from 'selectors/transaction';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { UnitDisplay } from 'components/ui';
import { Wei, fromWei } from 'libs/units';

type TransactionState = AppState['transaction'];

interface StateProps {
  currentValue: TransactionState['meta']['tokenValue'] | TransactionState['fields']['value'];
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

class CostBreakdownClass extends Component<StateProps> {
  public render() {
    const {
      currentValue,
      etherTransaction,
      gasCostInWei,

      unit,
      decimal
    } = this.props;
    const gasCostInEther = fromWei(gasCostInWei, 'ether');
    return (
      <div>
        <h5>
          Amount To Send: <UnitDisplay symbol={unit} value={currentValue.value} decimal={decimal} />
        </h5>
        <h5>Gas Cost: {gasCostInEther}</h5>
        <h5>
          {' '}
          Total Spent:{' '}
          {etherTransaction ? (
            currentValue.value ? (
              <UnitDisplay
                symbol={unit}
                value={currentValue.value.add(gasCostInWei)}
                decimal={decimal}
              />
            ) : (
              gasCostInEther
            )
          ) : (
            <div>
              <h5>
                {' '}
                <UnitDisplay symbol="ether" value={gasCostInWei} unit="ether" />
              </h5>
              <h5>
                <UnitDisplay symbol={unit} value={currentValue.value} decimal={decimal} />{' '}
              </h5>
            </div>
          )}
        </h5>
      </div>
    );
  }
}

export const CostBreakdown = connect(mapStateToProps)(CostBreakdownClass);
