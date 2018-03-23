import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { signaturePending } from 'selectors/transaction';
import { Spinner } from 'components/ui';
import './SigningStatus.scss';
import { translate } from 'translations';
interface StateProps {
  isSignaturePending: boolean;
  isHardwareWallet: boolean;
}

class SigningStatusClass extends Component<StateProps> {
  public render() {
    const { isHardwareWallet, isSignaturePending } = this.props;

    const HWWalletPrompt: React.SFC<{}> = () =>
      isHardwareWallet ? (
        <p>
          <b>{translate('CONFIRM_HARDWARE_WALLET_TRANSACTION')}</b>
        </p>
      ) : null;

    return isSignaturePending ? (
      <div className="SigningStatus text-center">
        <HWWalletPrompt />
        <Spinner size="x2" />
      </div>
    ) : null;
  }
}

export const SigningStatus = connect((state: AppState) => signaturePending(state))(
  SigningStatusClass
);
