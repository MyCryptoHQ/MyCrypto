import { Addresses } from './components/Addresses';
import { Amounts } from './components/Amounts';
import { Details } from './components/Details';
import React from 'react';
import { SerializedTransaction } from 'components/renderCbs';
import { makeTransaction, getTransactionFields } from 'libs/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getFrom, getUnit, getDecimal } from 'selectors/transaction';
import { getNetworkConfig } from 'selectors/config';

interface State {
  showDetails: boolean;
}

interface Props {
  from: string;
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
    const { from, unit, network, decimal } = this.props;
    const { showDetails } = this.state;
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => {
          const transactionInstance = makeTransaction(serializedTransaction);
          const { value, data, to, gasPrice, gasLimit, nonce, chainId } = getTransactionFields(
            transactionInstance
          );

          return (
            <React.Fragment>
              <Addresses to={to} from={from} unit={unit} data={data} />
              <Amounts
                value={value}
                gasPrice={gasPrice}
                gasLimit={gasLimit}
                network={network}
                decimal={decimal}
                unit={unit}
                data={data}
              />
              <a onClick={this.toggleDetails}>+ Details</a>
              {showDetails ? <Details /> : null}
            </React.Fragment>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    from: getFrom(state),
    unit: getUnit(state),
    network: getNetworkConfig(state),
    decimal: getDecimal(state)
  };
};

export const Body = connect(mapStateToProps)(BodyClass);
