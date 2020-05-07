import React, { Component } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';
import { ExtendedContentPanel, InputField } from 'v2/components';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { ScreenLockContext } from './ScreenLockProvider';

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

const FormWrapper = styled.form`
  margin-top: 15px;
  max-width: 320px;

  @media (min-width: 700px) {
    max-width: 420px;
  }
`;

const BottomActions = styled.div`
  margin-top: 35px;
  line-height: 2.5;
`;
type Props = RouteComponentProps<{}>;

class ScreenLockLocked extends Component<Props> {
  public state = { password: '', passwordError: '' };

  public onPasswordChanged = (event: any) => {
    this.setState({ password: event.target.value, passwordError: '' });
  };

  public handleUnlockWalletClick = async (decryptWithPassword: any, e: any) => {
    e.preventDefault();
    const response = await decryptWithPassword(this.state.password);
    if (response === false) {
      this.setState({ passwordError: translate('SCREEN_LOCK_LOCKED_WRONG_PASSWORD') });
    }
  };

  public trackRecomendationClick = () => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.SCREEN_LOCK,
      'Why do we recommend link clicked'
    );
  };

  public render() {
    return (
      <ScreenLockContext.Consumer>
        {({ decryptWithPassword }) => (
          <ExtendedContentPanel
            heading={translateRaw('SCREEN_LOCK_LOCKED_HEADING')}
            description={translateRaw('SCREEN_LOCK_LOCKED_DESCRIPTION')}
            image={mainImage}
            showImageOnTop={true}
            centered={true}
            className=""
          >
            <ContentWrapper>
              <FormWrapper onSubmit={(e) => this.handleUnlockWalletClick(decryptWithPassword, e)}>
                <InputField
                  label={translateRaw('SCREEN_LOCK_LOCKED_PASSWORD_LABEL')}
                  value={this.state.password}
                  onChange={this.onPasswordChanged}
                  inputError={this.state.passwordError}
                  type={'password'}
                />
                <PrimaryButton type="submit">
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
                  <Link onClick={this.trackRecomendationClick} to="/dashboard">
                    {translate('SCREEN_LOCK_LOCKED_LEARN_MORE')}
                  </Link>
                </div>
              </BottomActions>
            </ContentWrapper>
          </ExtendedContentPanel>
        )}
      </ScreenLockContext.Consumer>
    );
  }
}

export default withRouter(ScreenLockLocked);
