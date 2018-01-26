import { Addresses } from './components/Addresses';
import { Amounts } from './components/Amounts';
import { Details } from './components/Details';
import React from 'react';
import { SerializedTransaction } from 'components/renderCbs';
import { makeTransaction, getTransactionFields } from 'libs/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getFrom, getUnit, getDecimal, getTo } from 'selectors/transaction';
import { getNetworkConfig } from 'selectors/config';
import { getTransactionFee } from 'libs/transaction/utils/ether';
import BN from 'bn.js';
import { Wei, TokenValue } from 'libs/units';
import ERC20 from 'libs/erc20';
import './Body.scss';

interface State {
  showDetails: boolean;
}

interface Props {
  rates: AppState['rates']['rates'];
  from: string;
  to: string;
  unit: string;
  network: AppState['config']['network'];
  decimal: number;
}

class BodyClass extends React.Component<Props, State> {
  public state: State = {
    showDetails: false
  };

  public toggleDetails = () => {
    this.setState({
      showDetails: !this.state.showDetails
    });
  };

  public render() {
    const { rates, from, to, unit, network, decimal } = this.props;
    const { showDetails } = this.state;
    const networkUnit = network.unit;
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => {
          const transactionInstance = makeTransaction(serializedTransaction);
          const { value, data, nonce, chainId } = getTransactionFields(transactionInstance);
          const isToken = unit !== 'ether';
          const isTestnet = network.isTestnet;
          const sendValue = isToken
            ? TokenValue(ERC20.transfer.decodeInput(data)._value)
            : Wei(value);
          const sendValueUSD = isTestnet ? new BN(0) : sendValue.muln(rates[network.unit].USD);
          const transactionFee = getTransactionFee(transactionInstance);
          const transactionFeeUSD = isTestnet
            ? new BN(0)
            : transactionFee.muln(rates[network.unit].USD);

          return (
            <div className="Body">
              <Addresses
                to={to}
                from={from}
                amount={sendValue}
                unit={unit}
                decimal={decimal}
                networkUnit={networkUnit}
                data={data}
                isToken={isToken}
              />
              <Amounts
                isToken={isToken}
                isTestnet={isTestnet}
                sendValue={sendValue}
                fee={transactionFee}
                sendValueUSD={sendValueUSD}
                transactionFeeUSD={transactionFeeUSD}
                networkUnit={networkUnit}
                decimal={decimal}
                unit={unit}
              />
              {isTestnet && <p className="Testnet-warn small">Testnet Transaction</p>}
              <a onClick={this.toggleDetails}>+ Details</a>
              {showDetails ? <Details /> : null}
            </div>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    rates: state.rates.rates,
    from: getFrom(state),
    to: getTo(state).raw,
    unit: getUnit(state),
    network: getNetworkConfig(state),
    decimal: getDecimal(state)
  };
};

export const Body = connect(mapStateToProps)(BodyClass);
