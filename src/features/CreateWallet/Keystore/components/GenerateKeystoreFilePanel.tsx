import React, { Component } from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import zxcvbn from 'zxcvbn';

import { ExtendedContentPanel, InputField, Spinner } from '@components';
import { PanelProps } from '@features/CreateWallet';
import translate, { translateRaw } from '@translations';

const DescriptionItem = styled.div`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px;

  strong {
    font-weight: 900;
  }
`;

const PasswordForm = styled.form`
  margin-top: 22px;
`;

const FormItem = styled.fieldset`
  margin-top: 15px;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  font-size: 18px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  width: 100%;
  height: 51px;
`;

const Description = () => {
  return (
    <React.Fragment>
      <DescriptionItem>{translate('NEW_WALLET_KEYSTORE_DESCRIPTION_1')}</DescriptionItem>
      <DescriptionItem>{translate('NEW_WALLET_KEYSTORE_DESCRIPTION_2')}</DescriptionItem>
    </React.Fragment>
  );
};

interface Props extends PanelProps {
  generateWalletAndContinue(password: string): void;
}

export default class GenerateKeystoreFilePanel extends Component<Props> {
  public state = {
    password1: '',
    password2: '',
    password1Error: '',
    password2Error: '',
    generatingKeystore: false
  };

  public onPassword1Changed = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password1: event.target.value });
  };

  public onPassword2Changed = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password2: event.target.value });
  };

  public validateForm = (): boolean => {
    const { password1, password2 } = this.state;
    const minLength = 8;

    if (password1.length < minLength) {
      this.setState({
        password1Error: translate('INPUT_ERROR_PASSWORD_TOO_SHORT'),
        password2Error: ''
      });
      return false;
    }

    const passwordValidation = password1 ? zxcvbn(password1) : null;
    if (passwordValidation && passwordValidation.score < 3) {
      this.setState({
        password1Error: `${translateRaw('WEAK_PASSWORD')} ${passwordValidation.feedback.warning}`,
        password2Error: ''
      });
      return false;
    }

    if (password1 !== password2) {
      this.setState({
        password1Error: '',
        password2Error: translate('INPUT_ERROR_PASSWORDS_DONT_MATCH')
      });
      return false;
    }

    this.setState({ password1Error: '', password2Error: '' });
    return true;
  };

  public handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { generateWalletAndContinue } = this.props;

    if (this.validateForm()) {
      try {
        this.setState({ generatingKeystore: true });
        await generateWalletAndContinue(this.state.password1);
      } catch (e) {
        console.debug(e);
      }
    }
  };

  public render() {
    const { onBack, totalSteps, currentStep } = this.props;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('NEW_WALLET_KEYSTORE_TITLE')}
        description={<Description />}
      >
        <PasswordForm onSubmit={this.handleFormSubmit}>
          <FormItem>
            <InputField
              label={translateRaw('INPUT_PASSWORD_LABEL')}
              value={this.state.password1}
              onChange={this.onPassword1Changed}
              inputError={this.state.password1Error}
              showEye={true}
              type={'password'}
            />
          </FormItem>
          <FormItem>
            <InputField
              label={translateRaw('INPUT_CONFIRM_PASSWORD_LABEL')}
              value={this.state.password2}
              onChange={this.onPassword2Changed}
              inputError={this.state.password2Error}
              showEye={true}
              type={'password'}
            />
          </FormItem>
          <DescriptionItem>{translate('NEW_WALLET_KEYSTORE_DESCRIPTION_3')}</DescriptionItem>
          <ButtonWrapper>
            {this.state.generatingKeystore ? (
              <Spinner size={'x2'} />
            ) : (
              <SubmitButton type="submit">{translate('NEW_WALLET_KEYSTORE_BUTTON')}</SubmitButton>
            )}
          </ButtonWrapper>
        </PasswordForm>
      </ExtendedContentPanel>
    );
  }
}
