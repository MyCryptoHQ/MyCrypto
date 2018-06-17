import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { transactionFieldsActions } from 'features/transaction';
import { Query } from 'components/renderCbs';
import { DataInput } from './DataInputFactory';

export interface CallBackProps {
  data: AppState['transaction']['fields']['data'];
  validData: boolean;
  readOnly: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}
interface DispatchProps {
  isEtherTransaction: boolean;
  inputData: transactionFieldsActions.TInputData;
}
interface OwnProps {
  data: string | null;
  withProps(props: CallBackProps): React.ReactElement<any> | null;
}
interface StateProps {
  isEtherTransaction: boolean;
}

type Props = DispatchProps & OwnProps & StateProps;

class DataFieldClass extends React.Component<Props> {
  public componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.props.inputData(data);
    }
  }

  public render() {
    return this.props.isEtherTransaction ? (
      <DataInput onChange={this.setData} withProps={this.props.withProps} />
    ) : null;
  }

  private setData = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputData(value);
  };
}

const DataField = connect(
  (state: AppState) => ({ isEtherTransaction: selectors.isEtherTransaction(state) }),
  { inputData: transactionFieldsActions.inputData }
)(DataFieldClass);

interface DefaultDataFieldProps {
  withProps(props: CallBackProps): React.ReactElement<any> | null;
}
const DefaultDataField: React.SFC<DefaultDataFieldProps> = ({ withProps }) => (
  /* TODO: check query param of tokens too */

  <Query
    params={['data']}
    withQuery={({ data }) => <DataField data={data} withProps={withProps} />}
  />
);

export { DefaultDataField as DataFieldFactory };
