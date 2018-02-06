import React, { Component } from 'react';
import { UnitDisplay } from 'components/ui';
import './Amounts.scss';
import { AppState } from 'reducers';
import { getAllUSDValuesFromSerializedTx, AllUSDValues } from 'selectors/rates';
import { SerializedTxParams, getParamsFromSerializedTx } from 'selectors/transaction';
import { connect } from 'react-redux';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'config';

interface StateProps extends SerializedTxParams, AllUSDValues {
  network: NetworkConfig;
}

class AmountsClass extends Component<StateProps> {
  public render() {
    const {
      unit,
      decimal,
      feeUSD,
      totalUSD,
      valueUSD,
      isToken,
      currentValue,
      fee,
      total,
      network
    } = this.props;
    const showConversion = valueUSD && totalUSD && feeUSD;

    return (
      <table className="tx-modal-amount">
        <tbody>
          <tr className="tx-modal-amount-send">
            <td>You'll Send</td>
            <td>
              <UnitDisplay
                value={currentValue}
                decimal={decimal}
                displayShortBalance={6}
                symbol={unit}
              />
            </td>
            {showConversion && (
              <td>
                $<UnitDisplay
                  value={valueUSD}
                  unit="ether"
                  displayShortBalance={2}
                  displayTrailingZeroes={true}
                  checkOffline={true}
                />
              </td>
            )}
          </tr>
          <tr className="tx-modal-amount-fee">
            <td>Transaction Fee</td>
            <td>
              <UnitDisplay
                value={fee}
                unit={'ether'}
                displayShortBalance={false}
                symbol={network.unit}
              />
            </td>
            {showConversion && (
              <td>
                $<UnitDisplay
                  value={feeUSD}
                  unit="ether"
                  displayShortBalance={2}
                  displayTrailingZeroes={true}
                  checkOffline={true}
                />
              </td>
            )}
          </tr>
          {!isToken && (
            <tr className="tx-modal-amount-total">
              <td>Total</td>
              <td>
                <UnitDisplay
                  value={total}
                  decimal={decimal}
                  displayShortBalance={false}
                  symbol={network.unit}
                />
              </td>
              {showConversion && (
                <td>
                  $<UnitDisplay
                    value={totalUSD}
                    unit="ether"
                    displayShortBalance={2}
                    displayTrailingZeroes={true}
                    checkOffline={true}
                  />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  ...getParamsFromSerializedTx(state),
  ...getAllUSDValuesFromSerializedTx(state),
  network: getNetworkConfig(state)
});

export const Amounts = connect(mapStateToProps)(AmountsClass);
