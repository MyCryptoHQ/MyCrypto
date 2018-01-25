import React from 'react';
import { UnitDisplay } from 'components/ui';
import { AppState } from 'reducers';
import './Amounts.scss';
import BN from 'bn.js';

interface Props {
  sendValue: BN;
  fee: BN;
  sendValueUSD: BN;
  transactionFeeUSD: BN;
  network: AppState['config']['network'];
  decimal: number;
  unit: string;
  data: string;
  isToken: boolean;
  isTestnet: boolean | undefined;
}

export const Amounts: React.SFC<Props> = ({
  sendValue,
  fee,
  sendValueUSD,
  transactionFeeUSD,
  network,
  decimal,
  unit,
  isToken,
  isTestnet,
  data
}) => {
  const total = sendValue.add(fee);
  const totalUSD = sendValueUSD.add(transactionFeeUSD);
  return (
    <div className="Amount">
      {isTestnet && <p className="Amount-testnet-warn small">Test Network Transaction</p>}
      <div className="Amount-send">
        <div className="Amount-send-positioning-wrapper">
          <h5>You'll Send: </h5>
          <h5>
            <UnitDisplay
              decimal={decimal}
              value={sendValue}
              symbol={isToken ? unit : network.unit}
              checkOffline={false}
            />
            {!isTestnet && (
              <span style={{ 'margin-left': '8px' }} className="small">
                $<UnitDisplay
                  value={sendValueUSD}
                  unit="ether"
                  displayShortBalance={2}
                  displayTrailingZeroes={true}
                  checkOffline={true}
                />
              </span>
            )}
          </h5>
        </div>
      </div>
      <div className="Amount-fee">
        <div className="Amount-fee-positioning-wrapper">
          <h5>Transaction Fee: </h5>
          <h5>
            <UnitDisplay
              value={fee}
              unit="ether"
              symbol={network.unit}
              displayShortBalance={6}
              checkOffline={false}
            />
            {!isTestnet && (
              <span style={{ 'margin-left': '8px' }} className="small">
                $<UnitDisplay
                  value={transactionFeeUSD}
                  unit="ether"
                  displayShortBalance={2}
                  displayTrailingZeroes={true}
                  checkOffline={true}
                />
              </span>
            )}
          </h5>
        </div>
      </div>
      <div className="Amount-total">
        <div className="Amount-total-positioning-wrapper">
          <h5>Total: </h5>
          <h5>
            <UnitDisplay
              value={total}
              decimal={decimal}
              symbol={isToken ? unit : network.unit}
              checkOffline={false}
            />
            {!isTestnet && (
              <span style={{ 'margin-left': '8px' }} className="small">
                $<UnitDisplay
                  value={totalUSD}
                  unit="ether"
                  displayShortBalance={2}
                  displayTrailingZeroes={true}
                  checkOffline={true}
                />
              </span>
            )}
          </h5>
        </div>
      </div>
    </div>
  );
};
