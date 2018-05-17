import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { getAutoGasLimitEnabled } from 'features/selectors';
import { getGasLimit, getGasEstimationPending } from 'features/transaction/selectors';
import { CallBackProps } from 'components/GasLimitFieldFactory';
import { Query } from 'components/renderCbs';

interface StateProps {
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  gasEstimationPending: boolean;
  autoGasLimitEnabled: boolean;
}

interface OwnProps {
  withProps(props: CallBackProps): null | React.ReactElement<any>;
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
