import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { SerializedTransaction } from 'components/renderCbs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { isEtherTransaction } from 'selectors/transaction';

interface StateProps {
  showData: boolean;
}
class ShowDataWhenNoTokenClass extends Component<StateProps> {
  public render() {
    return this.props.showData ? <Data /> : null;
  }
}

const ShowDataWhenNoToken = connect((state: AppState) => ({ showData: isEtherTransaction(state) }))(
  ShowDataWhenNoTokenClass
);

const Data: React.SFC<{}> = () => (
  <SerializedTransaction
    withSerializedTransaction={serializedTransaction => {
      const transactionInstance = makeTransaction(serializedTransaction);
      const { data } = getTransactionFields(transactionInstance);
      const dataBox = (
        <span>
          You are sending the following data:{' '}
          <textarea className="form-control" value={data} rows={3} disabled={true} />
        </span>
      );

      return (
        <li className="ConfModal-details-detail">
          {!emptyData(data) ? dataBox : 'There is no data attached to this transaction'}
        </li>
      );
    }}
  />
);

const emptyData = (data: string) => data === '0x';

export { ShowDataWhenNoToken as Data };
