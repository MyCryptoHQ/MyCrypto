import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { configSelectors } from 'features/config';
import { transactionSignTypes } from 'features/transaction';
import { UnitDisplay } from 'components/ui';
import './Amounts.scss';

interface StateProps
  extends transactionSignTypes.SerializedTxParams,
    derivedSelectors.AllUSDValues {
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
            <td>{translate('CONFIRM_TX_SENDING')}</td>
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
            <td>{translate('CONFIRM_TX_FEE')}</td>
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
              <td>{translate('CONFIRM_TX_TOTAL')}</td>
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
  ...derivedSelectors.getParamsFromSerializedTx(state),
  ...derivedSelectors.getAllUSDValuesFromSerializedTx(state),
  network: configSelectors.getNetworkConfig(state)
});

export const Amounts = connect(mapStateToProps)(AmountsClass);
