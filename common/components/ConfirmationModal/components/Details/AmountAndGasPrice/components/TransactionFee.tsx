import React from 'react';
import { getTransactionFee, makeTransaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';
import { UnitDisplay } from 'components/ui';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { getNetworkConfig } from 'selectors/config';
import BN from 'bn.js';

interface Props {
  rates: AppState['rates']['rates'];
  network: AppState['config']['network'];
  isOffline: AppState['config']['offline'];
}

class TransactionFeeClass extends React.Component<Props> {
  public render() {
    const { rates, network, isOffline } = this.props;
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => {
          const transactionInstance = makeTransaction(serializedTransaction);
          const fee = getTransactionFee(transactionInstance);
          const usdFee = network.isTestnet ? new BN(0) : fee.muln(rates[network.unit].USD);

          return (
            <React.Fragment>
              <UnitDisplay unit={'ether'} value={fee} symbol={network.unit} checkOffline={false} />{' '}
              {!isOffline &&
                rates[network.unit] && (
                  <span>
                    ($
                    <UnitDisplay
                      value={usdFee}
                      unit="ether"
                      displayShortBalance={2}
                      displayTrailingZeroes={true}
                      checkOffline={true}
                    />)
                  </span>
                )}
            </React.Fragment>
          );
        }}
      />
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    rates: state.rates.rates,
    network: getNetworkConfig(state),
    isOffline: state.config.offline
  };
}
export const TransactionFee = connect(mapStateToProps)(TransactionFeeClass);
