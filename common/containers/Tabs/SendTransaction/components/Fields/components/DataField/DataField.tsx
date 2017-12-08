import { DataInput } from './DataInput';
import { Query } from 'components/renderCbs';
import { inputData, TInputData } from 'actions/transaction';
import React from 'react';
import { connect } from 'react-redux';
import { isEtherTransaction } from 'selectors/transaction';
import { AppState } from 'reducers';
interface DispatchProps {
  isEtherTransaction;
  inputData: TInputData;
}
interface OwnProps {
  data: string | null;
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
    return this.props.isEtherTransaction ? <DataInput onChange={this.setData} /> : null;
  }

  private setData = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputData(value);
  };
}

const DataField = connect(
  (state: AppState) => ({ isEtherTransaction: isEtherTransaction(state) }),
  { inputData }
)(DataFieldClass);

const DefaultDataField: React.SFC<{}> = () => (
  /* TODO: check query param of tokens too */

  <Query params={['data']} withQuery={({ data }) => <DataField data={data} />} />
);

export { DefaultDataField as DataField };
