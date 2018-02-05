import React from 'react';
import { UnitDisplay } from 'components/ui';
import BN from 'bn.js';
import './Amounts.scss';
import { AppState } from 'reducers';

interface Props {
  sendValue: BN;
  fee: BN;
  networkUnit: string;
  decimal: number;
  unit: string;
  isToken: boolean;
  isTestnet: boolean | undefined;
  rates: AppState['rates']['rates'];
}

export const Amounts: React.SFC<Props> = ({
  sendValue,
  fee,
  networkUnit,
  decimal,
  unit,
  isToken,
  isTestnet,
  rates
}) => {
  const total = sendValue.add(fee);
  const sendValueUSD = isTestnet
    ? new BN(0)
    : sendValue.muln(rates[isToken ? unit : networkUnit].USD);
  const transactionFeeUSD = isTestnet ? new BN(0) : fee.muln(rates[networkUnit].USD);
  const totalUSD = sendValueUSD.add(transactionFeeUSD);
  const showConversion = !isTestnet && rates && isToken ? rates[unit] : rates[networkUnit];
  return (
    <table className="tx-modal-amount">
      <tbody>
        <tr className="tx-modal-amount-send">
          <td>You'll Send</td>
          <td>
            <UnitDisplay
              value={sendValue}
              decimal={decimal}
              displayShortBalance={6}
              symbol={isToken ? unit : networkUnit}
            />
          </td>
          {showConversion && (
            <td>
              $<UnitDisplay
                value={sendValueUSD}
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
            <UnitDisplay value={fee} unit={'ether'} displayShortBalance={6} symbol={networkUnit} />
          </td>
          {showConversion && (
            <td>
              $<UnitDisplay
                value={transactionFeeUSD}
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
                displayShortBalance={6}
                symbol={networkUnit}
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
};
