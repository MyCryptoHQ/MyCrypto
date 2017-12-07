import React, { Component } from 'react';
import { GasQuery } from 'components/renderCbs';
import { GasInput } from './GasInput';
import { inputGasLimit, TInputGasLimit } from 'actions/transaction';
import { connect } from 'react-redux';

const defaultGasLimit = '21000';

interface DispatchProps {
  inputGasLimit: TInputGasLimit;
}
interface OwnProps {
  gasLimit: string | null;
}

type Props = DispatchProps & OwnProps;

class GasLimitFieldClass extends Component<Props, {}> {
  public componentDidMount() {
    const { gasLimit } = this.props;
    if (gasLimit) {
      this.props.inputGasLimit(gasLimit);
    } else {
      this.props.inputGasLimit(defaultGasLimit);
    }
  }

  public render() {
    return <GasInput onChange={this.setGas} />;
  }

  private setGas = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputGasLimit(value);
  };
}

const GasLimitField = connect(null, { inputGasLimit })(GasLimitFieldClass);

const DefaultGasField: React.SFC<{}> = () => (
  <GasQuery withQuery={({ gasLimit }) => <GasLimitField gasLimit={gasLimit} />} />
);

export { DefaultGasField as GasField };
