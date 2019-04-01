import React, { Component } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import translate, { translateRaw } from 'translations';

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
    this.setState({ passwordError: translate('SCREEN_LOCK_LOCKED_WRONG_PASSWORD') });
  };

  public render() {
    return (
      <Layout centered={true}>
        <ExtendedContentPanel
          onBack={this.props.history.goBack}
          heading={translateRaw('SCREEN_LOCK_LOCKED_HEADING')}
          description={translateRaw('SCREEN_LOCK_LOCKED_DESCRIPTION')}
          image={mainImage}
          showImageOnTop={true}
          centered={true}
          className=""
        >
          <ContentWrapper>
            <FormWrapper>
              <InputField
                label={translateRaw('SCREEN_LOCK_LOCKED_PASSWORD_LABEL')}
                value={this.state.password}
                onChange={this.onPasswordChanged}
                inputError={this.state.passwordError}
                type={'password'}
              />
              <PrimaryButton onClick={this.handleUnlockWalletClick}>
                {translate('SCREEN_LOCK_LOCKED_UNLOCK')}
              </PrimaryButton>
            </FormWrapper>
            <BottomActions>
              <div>
                {translate('SCREEN_LOCK_LOCKED_FORGOT_PASSWORD')}{' '}
                <Link to="/screen-lock/forgot-password">
                  {translate('SCREEN_LOCK_LOCKED_IMPORT_SETTINGS')}
                </Link>
              </div>
              <div>
                {translate('SCREEN_LOCK_LOCKED_RECOMMEND_LOCK')}{' '}
                <Link to="/dashboard">{translate('SCREEN_LOCK_LOCKED_LEARN_MORE')}</Link>
              </div>
            </BottomActions>
          </ContentWrapper>
        </ExtendedContentPanel>
      </Layout>
    );
  }
}

export default withRouter<Props>(ScreenLockLocked);
