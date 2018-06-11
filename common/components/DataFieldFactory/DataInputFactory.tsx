import React, { Component } from 'react';
<<<<<<< HEAD
=======
import { Query } from 'components/renderCbs';
import { getData } from 'selectors/transaction';
>>>>>>> develop
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { getData, getDataExists } from 'features/transaction';
import { CallBackProps } from 'components/DataFieldFactory';
<<<<<<< HEAD
import { Query } from 'components/renderCbs';
=======
import { isHexString } from 'ethereumjs-util';
>>>>>>> develop

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
  data: getData(state),
  validData: getData(state).raw === '' || isHexString(getData(state).raw)
}))(DataInputClass);
