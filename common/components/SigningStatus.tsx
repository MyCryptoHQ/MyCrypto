import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from 'translations';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { Spinner } from 'components/ui';
import './SigningStatus.scss';

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

export const SigningStatus = connect((state: AppState) => selectors.signaturePending(state))(
  SigningStatusClass
);
