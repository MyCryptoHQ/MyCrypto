import React, { Component } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import translate, { translateRaw } from 'v2/translations';

import { ExtendedContentPanel, InputField } from 'v2/components';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { ScreenLockContext } from './ScreenLockProvider';

// Legacy
import mainImage from 'common/assets/images/icn-create-pw.svg';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
`;

const ActionButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.form`
  margin-top: 15px;
  max-width: 420px;
`;

const BottomActions = styled.div`
  margin-top: 30px;
  line-height: 2.5;
`;

type Props = RouteComponentProps<{}>;

class ScreenLockNew extends Component<Props> {
  public state = { password1: '', password2: '', password1Error: '', password2Error: '' };

  public validateForm = () => {
    this.setState({ password1Error: '', password2Error: '' });
    const { password1, password2 } = this.state;
    const minLength = 8;

    if (password1.length > 0 && password1.length < minLength) {
      this.setState({
        password1Error: translate('INPUT_ERROR_PASSWORD_TOO_SHORT')
      });
    }

    if (password1 !== password2) {
      if (password2.length > 0) {
        this.setState({
          password2Error: translate('INPUT_ERROR_PASSWORDS_DONT_MATCH')
        });
      }
    }
  };

  public onPassword1Changed = (event: any) => {
    this.setState({ password1: event.target.value });
  };

  public onPassword2Changed = (event: any) => {
    this.setState({ password2: event.target.value });
  };

  public handleCreatePasswordClicked = (
    encryptWithPassword: (password: string, hashed: boolean) => void
  ) => (e: any) => {
    e.preventDefault();

    const { password1, password2, password1Error, password2Error } = this.state;
    if (
      !(password1Error || password2Error) &&
      !(password1.length === 0 || password2.length === 0) &&
      password1 === password2
    ) {
      encryptWithPassword(password1, false);
      AnalyticsService.instance.track(
        ANALYTICS_CATEGORIES.SCREEN_LOCK,
        'User created a screenlock'
      );
    }
  };

  public onBack = () => {
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.SCREEN_LOCK, 'Back button clicked');
    this.props.history.goBack();
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
        {({ encryptWithPassword }) => (
          <ExtendedContentPanel
            onBack={this.onBack}
            heading={translateRaw('SCREEN_LOCK_NEW_HEADING')}
            description={translateRaw('SCREEN_LOCK_NEW_DESCRIPTION')}
            image={mainImage}
            showImageOnTop={true}
            centered={true}
            className=""
          >
            <ContentWrapper>
              <FormWrapper onSubmit={this.handleCreatePasswordClicked(encryptWithPassword)}>
                <InputField
                  label={translateRaw('SCREEN_LOCK_NEW_PASSWORD_LABEL')}
                  value={this.state.password1}
                  onChange={this.onPassword1Changed}
                  validate={this.validateForm}
                  inputError={this.state.password1Error}
                  type={'password'}
                />
                <InputField
                  label={translateRaw('SCREEN_LOCK_NEW_CONFIRM_PASSWORD_LABEL')}
                  value={this.state.password2}
                  onChange={this.onPassword2Changed}
                  validate={this.validateForm}
                  inputError={this.state.password2Error}
                  type={'password'}
                />
                <ActionButton type="submit">
                  {translate('SCREEN_LOCK_NEW_CREATE_PASSWORD_BUTTON')}
                </ActionButton>
              </FormWrapper>
              <BottomActions>
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

export default withRouter(ScreenLockNew);
