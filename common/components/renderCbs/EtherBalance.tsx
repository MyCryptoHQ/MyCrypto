import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

type IBalance = AppState['wallet']['balance'];

interface Props {
  balance: IBalance;
  withBalance({ balance }: { balance: IBalance }): React.ReactElement<any>;
}

class EtherBalanceClass extends React.Component<Props, {}> {
  public render() {
    const { balance, withBalance } = this.props;
    return withBalance({ balance });
  }
}

export const EtherBalance = connect((state: AppState) => ({
  balance: state.wallet.balance
}))(EtherBalanceClass);
