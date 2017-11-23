import React, { Component } from 'react';
import {
  GasQuery,
  Transaction,
  EstimateGas,
  SetTransactionField
} from 'components/renderCbs';
import { Wei } from 'libs/units';
import { GasInput } from './GasInput';
import { SetGasLimitFieldAction } from 'actions/transaction';
import EthTx from 'ethereumjs-tx';

const defaultGasLimit = '21000';

interface Props {
  gasLimit: string | null;
  transaction: EthTx | null;
  setter(payload: SetGasLimitFieldAction['payload']): void;
  estimator(transaction: EthTx): void;
}

class GasLimitField extends Component<Props, {}> {
  public componentDidMount() {
    const { gasLimit, setter } = this.props;
    if (gasLimit) {
      setter({ raw: gasLimit, value: Wei(gasLimit) });
    } else {
      setter({ raw: defaultGasLimit, value: Wei(defaultGasLimit) });
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { transaction: nextT, estimator } = nextProps;
    const { transaction: prevT } = this.props;

    if (!nextT) {
      return;
    }

    if (this.shouldEstimateGas(nextT, prevT)) {
      estimator(nextT);
    }
  }

  public render() {
    return <GasInput onChange={this.setGas} />;
  }

  private setGas = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validGasLimit = isFinite(parseFloat(value)) && parseFloat(value) > 0;
    this.props.setter({ raw: value, value: validGasLimit ? Wei(value) : null });
  };

  private shouldEstimateGas(nextT: EthTx, prevT: EthTx | null) {
    /*
    * Data and address destination (creation address) are the two parameters that change gas estimation
    * Otherwise, we let user input override everything
    */
    if (!prevT) {
      return true;
    }
    const sameData = nextT.data.toString() === prevT.data.toString();
    const sameAddress = nextT.to.toString() === prevT.to.toString();
    return !(sameData && sameAddress);
  }
}

const DefaultGasField: React.SFC<{}> = () => (
  <Transaction
    withTransaction={({ transaction }) => (
      <GasQuery
        withQuery={({ gasLimit }) => (
          <SetTransactionField
            name="gasLimit"
            withFieldSetter={setter => (
              <EstimateGas
                withEstimate={({ estimate }) => (
                  <GasLimitField
                    gasLimit={gasLimit}
                    transaction={transaction}
                    setter={setter}
                    estimator={estimate}
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

export { DefaultGasField as GasField };
