import React, { Component } from 'react';
import {
  GasQuery,
  Transaction,
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
    const { transaction: nextT } = nextProps;
    const { transaction: prevT, setter } = this.props;

    if (!nextT) {
      return;
    }

    if (this.shouldEstimateGas(nextT, prevT)) {
      const gasLimit = nextT.getBaseFee();
      setter({ raw: gasLimit.toString(), value: gasLimit });
    }
  }

  public render() {
    return <GasInput onChange={this.setGas} />;
  }

  private setGas(ev: React.FormEvent<HTMLInputElement>) {
    const { value } = ev.currentTarget;
    const validGasLimit = isFinite(parseFloat(value)) && parseFloat(value) > 0;
    this.props.setter({ raw: value, value: validGasLimit ? Wei(value) : null });
  }

  private shouldEstimateGas(nextT: EthTx, prevT: EthTx | null) {
    /*
    * Data and address destination (creation address) are the two parameters that change gas estimation
    * Otherwise, we let user input override everything
    */
    if (!prevT) {
      return true;
    }
    const sameData = nextT.data === prevT.data;
    const sameAddress = nextT.to === prevT.to;
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
              <GasLimitField
                gasLimit={gasLimit}
                transaction={transaction}
                setter={setter}
              />
            )}
          />
        )}
      />
    )}
  />
);

export { DefaultGasField as GasField };
