import React, { Component } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { InputField } from '../components/InputField';

import mainImage from 'common/assets/images/icn-unlock-wallet.svg';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
`;

const PrimaryButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.div`
  margin-top: 14px;
`;

const BottomActions = styled.div`
  margin-top: 35px;
  line-height: 2.5;
`;
type Props = RouteComponentProps<{}>;

export class ScreenLockLocked extends Component<Props> {
  public state = { password: '', passwordError: '' };

  public onPasswordChanged = (event: any) => {
    this.setState({ password: event.target.value, passwordError: '' });
  };

  public handleUnlockWalletClick = () => {
    this.setState({ passwordError: 'The password you have entered is incorrect.' });
  };

  public render() {
    return (
      <Layout centered={true}>
        <ExtendedContentPanel
          onBack={this.props.history.goBack}
          heading="Unlock Your Screen"
          description="We’ve detected that you have a MyCrypto wallet already.  Type in your password to continue."
          image={mainImage}
          showImageOnTop={true}
          centered={true}
          className=""
        >
          <ContentWrapper>
            <FormWrapper>
              <InputField
                label={'Password'}
                value={this.state.password}
                onChange={this.onPasswordChanged}
                inputError={this.state.passwordError}
                type={'password'}
              />
              <PrimaryButton onClick={this.handleUnlockWalletClick}>Unlock Wallet</PrimaryButton>
            </FormWrapper>
            <BottomActions>
              <div>
                Forgot Password?{' '}
                <Link to="/screen-lock/forgot-password">Import your settings.</Link>
              </div>
              <div>
                Why do we recommend screen lock? <Link to="/dashboard">Learn more.</Link>
              </div>
            </BottomActions>
          </ContentWrapper>
        </ExtendedContentPanel>
      </Layout>
    );
  }
}

export default withRouter<Props>(ScreenLockLocked);
