import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getGasLimit } from 'selectors/transaction';
import { CallBackProps } from 'components/GasFieldFactory';

interface StateProps {
  gasLimit: AppState['transaction']['fields']['gasLimit'];
}

interface OwnProps {
  withProps(props: CallBackProps): React.ReactElement<any> | null;
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

type Props = StateProps & OwnProps;
class GasInputClass extends Component<Props> {
  public render() {
    const { gasLimit, onChange } = this.props;
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          this.props.withProps({ gasLimit, onChange, readOnly: !!readOnly })
        }
      />
    );
  }
}

export const GasInput = connect((state: AppState) => ({ gasLimit: getGasLimit(state) }))(
  GasInputClass
);
