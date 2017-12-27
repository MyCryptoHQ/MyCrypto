import { DataInput } from './DataInputFactory';
import { Query } from 'components/renderCbs';
import { inputData, TInputData } from 'actions/transaction';
import React from 'react';
import { connect } from 'react-redux';
import { isEtherTransaction } from 'selectors/transaction';
import { AppState } from 'reducers';
export interface CallBackProps {
  data: AppState['transaction']['fields']['data'];
  dataExists: boolean;
  readOnly: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}
interface DispatchProps {
  isEtherTransaction: boolean;
  inputData: TInputData;
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
  (state: AppState) => ({ isEtherTransaction: isEtherTransaction(state) }),
  { inputData }
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
