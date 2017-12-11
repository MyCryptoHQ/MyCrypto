import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import { getData } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallBackProps } from 'components/DataFieldFactory';

interface OwnProps {
  withProps(props: CallBackProps): React.ReactElement<any> | null;
  onChange(ev: React.FormEvent<HTMLInputElement>);
}
interface StateProps {
  data: AppState['transaction']['fields']['data'];
}

type Props = OwnProps & StateProps;

class DataInputClass extends Component<Props> {
  public render() {
    const { data, onChange } = this.props;
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => this.props.withProps({ data, onChange, readOnly: !!readOnly })}
      />
    );
  }
}

export const DataInput = connect((state: AppState) => ({ data: getData(state) }))(DataInputClass);
