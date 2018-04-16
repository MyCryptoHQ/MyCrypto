import React, { Component } from 'react';
import { GasQuery } from 'components/renderCbs';
import { GasLimitInput } from './GasLimitInputFactory';
import { inputGasLimit, TInputGasLimit } from 'actions/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { sanitizeNumericalInput } from 'libs/values';
import { getSchedulingToggle } from 'selectors/schedule/fields';

const defaultGasLimit = '21000';

export interface CallBackProps {
  readOnly: boolean;
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  gasEstimationPending: boolean;
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

interface DispatchProps {
  inputGasLimit: TInputGasLimit;
}

interface OwnProps {
  gasLimit: string | null;
  scheduling: boolean;

  withProps(props: CallBackProps): React.ReactElement<any> | null;
}

type Props = DispatchProps & OwnProps;

class GasLimitFieldClass extends Component<Props> {
  public componentDidMount() {
    const { gasLimit, scheduling } = this.props;

    if (scheduling) {
      return;
    }

    if (gasLimit) {
      this.props.inputGasLimit(gasLimit);
    } else {
      this.props.inputGasLimit(defaultGasLimit);
    }
  }

  public render() {
    return <GasLimitInput onChange={this.setGas} withProps={this.props.withProps} />;
  }

  private setGas = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputGasLimit(sanitizeNumericalInput(value));
  };
}

const GasLimitField = connect(
  (state: AppState) => ({
    scheduling: getSchedulingToggle(state).value
  }),
  { inputGasLimit }
)(GasLimitFieldClass);

interface DefaultGasLimitFieldProps {
  withProps(props: CallBackProps): React.ReactElement<any> | null;
}
const DefaultGasLimitField: React.SFC<DefaultGasLimitFieldProps> = ({ withProps }) => (
  <GasQuery
    withQuery={({ gasLimit }) => <GasLimitField gasLimit={gasLimit} withProps={withProps} />}
  />
);

export { DefaultGasLimitField as GasLimitFieldFactory };
