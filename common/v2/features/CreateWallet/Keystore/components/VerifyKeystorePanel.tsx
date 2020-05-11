import React, { Component } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel, InputField, InlineMessage } from '@components';
import { PanelProps } from '@features/CreateWallet';
import translate, { translateRaw } from '@translations';

const ButtonsWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
`;
const StyledButton = styled(Button)`
  font-size: 18px;
  margin-bottom: 16px;
  width: 100%;
`;

const FormItemWrapper = styled.div`
  font-size: 20px;
  margin-top: 28px;
`;

const Divider = styled.div`
  margin-top: 28px;
  margin-bottom: 22px;
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: ${(props) => props.theme.headline};
`;

const FileName = styled.div`
  color: #999;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 18px;
`;

const UploadZone = styled.label`
  width: 100%;
  font-size: 13px;
  text-transform: uppercase;
  border: solid 1px #e5ecf3;
  background-color: rgba(247, 247, 247, 0.4);
  word-wrap: break-word;
  padding: 16px 4px;
  margin-top: 8px;
  text-align: center;
  cursor: pointer;
`;

const HiddenUploadZone = styled.input`
  &[type='file'] {
    display: none;
  }
`;

const ErrorWrapper = styled.div`
  margin-top: 26px;
`;

interface Props extends PanelProps {
  privateKey: string;
  verifyKeystore(keystore: string, password: string): Promise<boolean>;
  verifyPrivateKey(key: string, password: string): boolean;
  addCreatedAccountAndRedirectToDashboard(): void;
}

class VerifyKeystorePanel extends Component<Props> {
  public state = {
    validating: false,
    submited: false,
    keystore: null,
    password: '',
    privateKey: '',
    fileName: '',
    passwordError: '',
    privateKeyError: '',
    emptyFormError: false
  };

  public validating = false;

  public validate = async () => {
    const {
      verifyKeystore,
      verifyPrivateKey,
      privateKey: generatedPrivateKey,
      addCreatedAccountAndRedirectToDashboard
    } = this.props;
    const { keystore, password, privateKey } = this.state;
    this.validating = true;

    this.setState({ passwordError: '', privateKeyError: '', emptyFormError: false });

    if (!keystore && !privateKey) {
      this.setState({ emptyFormError: true });
      return;
    }

    if (keystore) {
      const isValid = await verifyKeystore(keystore!, password);
      if (!isValid) {
        this.setState({ passwordError: translateRaw('WRONG_PASSWORD') });
        return;
      } else {
        addCreatedAccountAndRedirectToDashboard();
      }
    } else if (privateKey) {
      const isValid = verifyPrivateKey(privateKey, password) && generatedPrivateKey === privateKey;
      if (!isValid) {
        this.setState({ privateKeyError: translateRaw('INVALID_PRIVATE_KEY') });
        return;
      } else {
        addCreatedAccountAndRedirectToDashboard();
      }
    }
    this.setState({ submited: true });
    this.validating = false;
  };

  public handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    this.setState({ fileName: e.target.files[0].name });

    fileReader.onload = () => {
      this.setState({ keystore: fileReader.result });
    };
  };

  public handlePasswordInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  public handlePrivateKeyInputChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ privateKey: e.target.value });
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
        heading={translateRaw('VERIFY_KEYSTORE_TITLE')}
        description={translateRaw('VERIFY_KEYSTORE_DESCRIPTION')}
      >
        <FormItemWrapper>
          <InputField
            label={translateRaw('YOUR_PRIVATE_KEY_LABEL')}
            value={this.state.privateKey}
            onChange={this.handlePrivateKeyInputChanged}
            inputError={this.state.privateKeyError}
            textarea={true}
          />
        </FormItemWrapper>
        <Divider>- {translateRaw('OR')} -</Divider>
        <FormItemWrapper>
          {translate('YOUR_KEYSTORE_LABEL')}
          <UploadZone htmlFor="uploadZone">{translateRaw('UPLOAD_KEYSTORE_LABEL')}</UploadZone>
          {this.state.fileName && <FileName>{this.state.fileName}</FileName>}
          <HiddenUploadZone type="file" id="uploadZone" onChange={this.handleFileSelection} />
        </FormItemWrapper>
        <FormItemWrapper>
          <InputField
            label={translateRaw('INPUT_PASSWORD_LABEL')}
            value={this.state.password}
            onChange={this.handlePasswordInputChanged}
            inputError={this.state.passwordError}
            showEye={true}
            type={'password'}
          />
        </FormItemWrapper>

        {this.state.emptyFormError && (
          <ErrorWrapper>
            <InlineMessage>{translateRaw('VERIFY_KEYSTORE_EMPTY_FORM_ERROR')}</InlineMessage>
          </ErrorWrapper>
        )}

        <ButtonsWrapper>
          <StyledButton onClick={this.validate}>{translate('DONE_AND_RETURN_LABEL')}</StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}

export default VerifyKeystorePanel;
