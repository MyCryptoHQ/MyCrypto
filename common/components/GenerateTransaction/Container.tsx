import {
  signLocalTransactionRequested,
  signWeb3TransactionRequested,
  TSignLocalTransactionRequested,
  TSignWeb3TransactionRequested,
  SignLocalTransactionRequestedAction,
  SignWeb3TransactionRequestedAction
} from 'actions/transaction';
import React, { Component } from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppState } from 'reducers';
type Payload =
  | SignLocalTransactionRequestedAction['payload']
  | SignWeb3TransactionRequestedAction['payload'];
type Signer = (
  payload: Payload
) => () => SignLocalTransactionRequestedAction | SignWeb3TransactionRequestedAction;

interface DispatchProps {
  signer: TSignLocalTransactionRequested | TSignWeb3TransactionRequested;
}
interface Props {
  isWeb3: boolean;
  withSigner(signer: Signer): React.ReactElement<any> | null;
}

class Container extends Component<DispatchProps & Props, {}> {
  public render() {
    return this.props.withSigner(this.sign);
  }

  private sign = (payload: Payload) => () => this.props.signer(payload);
}

export const WithSigner = connect(null, (dispatch: Dispatch<AppState>, ownProps: Props) => {
  return bindActionCreators(
    {
      signer: ownProps.isWeb3 ? signWeb3TransactionRequested : signLocalTransactionRequested
    },
    dispatch
  );
})(Container);
