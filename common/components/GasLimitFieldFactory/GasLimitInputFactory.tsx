import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getGasLimit, getGasEstimationPending } from 'selectors/transaction';
import { CallBackProps } from 'components/GasLimitFieldFactory';
import { getAutoGasLimitEnabled } from 'selectors/config';

interface StateProps {
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  gasEstimationPending: boolean;
  autoGasLimitEnabled: boolean;
}

interface OwnProps {
  withProps(props: CallBackProps);
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

type Props = StateProps & OwnProps;
class GasLimitInputClass extends Component<Props> {
  public render() {
    const { gasLimit, onChange, gasEstimationPending, autoGasLimitEnabled } = this.props;
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          this.props.withProps({
            gasLimit,
            onChange,
            readOnly: !!(readOnly || autoGasLimitEnabled),
            gasEstimationPending
          })
        }
      />
    );
  }
}
export const GasLimitInput = connect((state: AppState) => ({
  gasLimit: getGasLimit(state),
  gasEstimationPending: getGasEstimationPending(state),
  autoGasLimitEnabled: getAutoGasLimitEnabled(state)
}))(GasLimitInputClass);
