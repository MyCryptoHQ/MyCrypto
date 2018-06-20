import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isHexString } from 'ethereumjs-util';

import { AppState } from 'features/reducers';
import { transactionFieldsSelectors } from 'features/transaction';
import { CallBackProps } from 'components/DataFieldFactory';
import { Query } from 'components/renderCbs';

interface OwnProps {
  withProps(props: CallBackProps): React.ReactElement<any> | null;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}
interface StateProps {
  data: AppState['transaction']['fields']['data'];
  validData: boolean;
}

type Props = OwnProps & StateProps;

class DataInputClass extends Component<Props> {
  public render() {
    const { data, onChange, validData } = this.props;
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          this.props.withProps({ data, onChange, readOnly: !!readOnly, validData })
        }
      />
    );
  }
}

export const DataInput = connect((state: AppState) => ({
  data: transactionFieldsSelectors.getData(state),
  validData:
    transactionFieldsSelectors.getData(state).raw === '' ||
    isHexString(transactionFieldsSelectors.getData(state).raw)
}))(DataInputClass);
