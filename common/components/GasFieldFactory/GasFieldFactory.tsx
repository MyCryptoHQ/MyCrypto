import React, { Component } from 'react';
import { GasQuery } from 'components/renderCbs';
import { GasInput } from './GasInputFactory';
import { inputGasLimit, TInputGasLimit } from 'actions/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

const defaultGasLimit = '21000';

export interface CallBackProps {
  readOnly: boolean;
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

interface DispatchProps {
  inputGasLimit: TInputGasLimit;
}
interface OwnProps {
  gasLimit: string | null;
  withProps(props: CallBackProps): React.ReactElement<any> | null;
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
    return <GasInput onChange={this.setGas} withProps={this.props.withProps} />;
  }

  private setGas = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputGasLimit(value);
  };
}

const GasLimitField = connect(null, { inputGasLimit })(GasLimitFieldClass);

interface DefaultGasFieldProps {
  withProps(props: CallBackProps): React.ReactElement<any> | null;
}
const DefaultGasField: React.SFC<DefaultGasFieldProps> = ({ withProps }) => (
  <GasQuery
    withQuery={({ gasLimit }) => <GasLimitField gasLimit={gasLimit} withProps={withProps} />}
  />
);

export { DefaultGasField as GasFieldFactory };
