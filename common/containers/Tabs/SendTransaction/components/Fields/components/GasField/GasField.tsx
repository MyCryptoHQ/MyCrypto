import React, { Component } from 'react';
import { GasQuery } from 'components/renderCbs';
import { Wei } from 'libs/units';
import { GasInput } from './GasInput';
import EthTx from 'ethereumjs-tx';

const defaultGasLimit = '21000';

interface Props {
  gasLimit: string | null;
  transaction: EthTx | null;
  onChange(gasLimit: Wei | null): void;
}

interface State {
  validGasLimit: boolean;
  gasLimit: string;
}

class GasLimitField extends Component<Props, State> {
  public componentDidMount() {
    const { gasLimit, onChange } = this.props;
    if (gasLimit) {
      onChange(Wei(gasLimit));
      this.setState({ validGasLimit: true, gasLimit });
    } else {
      onChange(Wei(defaultGasLimit));
      this.setState({ validGasLimit: true, gasLimit: defaultGasLimit });
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { transaction: nextT } = nextProps;
    const { transaction: prevT, onChange } = this.props;

    if (nextT) {
      /*
      * Data and address destination (creation address) are the two parameters that change gas estimation
      * Otherwise, we let user input override everything
      */
      const shouldEstimateGas = prevT
        ? nextT.data === prevT.data && nextT.to === prevT.to
        : true;
      if (shouldEstimateGas) {
        const gasLimit = nextT.getBaseFee();
        this.setState({ validGasLimit: true, gasLimit: gasLimit.toString() });
        onChange(gasLimit);
      }
    }
  }

  public render() {
    return (
      <GasInput
        validGas={this.state.validGasLimit}
        value={this.state.gasLimit}
        onChange={this.setGas}
      />
    );
  }

  private setGas(ev: React.FormEvent<HTMLInputElement>) {
    const { value } = ev.currentTarget;
    const validGasLimit = isFinite(parseFloat(value)) && parseFloat(value) > 0;
    this.props.onChange(validGasLimit ? Wei(value) : null);
    this.setState({ validGasLimit, gasLimit: value });
  }
}

interface DefaultProps {
  transaction: EthTx | null;
  withGas(gasLimit: Wei);
}

const DefaultGasField: React.SFC<DefaultProps> = ({ withGas, transaction }) => (
  <GasQuery
    withQuery={({ gasLimit }) => (
      <GasLimitField
        gasLimit={gasLimit}
        onChange={withGas}
        transaction={transaction}
      />
    )}
  />
);

export { DefaultGasField as GasField };
