import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { signaturePending } from 'selectors/transaction';
import { Spinner } from 'components/ui';
interface StateProps {
  isSignaturePending: boolean;
  isHardwareWallet: boolean;
}

class SigningStatusClass extends Component<StateProps> {
  public render() {
    const { isHardwareWallet, isSignaturePending } = this.props;

    const HWWalletPrompt: React.SFC<{}> = _ =>
      isHardwareWallet ? (
        <p>
          <b>Confirm transaction on hardware wallet</b>
        </p>
      ) : null;

    return isSignaturePending ? (
      <div className="container">
        <div className="row form-group text-center">
          <HWWalletPrompt />
          <Spinner size="x2" />
        </div>
      </div>
    ) : null;
  }
}

export const SigningStatus = connect((state: AppState) => signaturePending(state))(
  SigningStatusClass
);
