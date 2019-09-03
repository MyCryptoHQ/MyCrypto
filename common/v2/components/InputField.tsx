import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from '@mycrypto/ui';

import { COLORS } from 'v2/theme';
import { InlineErrorMsg } from 'v2/components';

const { PASTEL_RED, BRIGHT_SKY_BLUE } = COLORS;

const MainWrapper = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.p`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
`;

interface CustomInputProps {
  inputError?: string;
  showEye?: boolean;
}

const CustomInput = styled.input`
  width: 100%;
  background: ${props => props.theme.controlBackground};
  border: 0.125em solid ${props => props.theme.controlBorder};
  border-radius: 0.125em;
  padding: ${props => (props.showEye ? '12px 36px 12px 12px' : '12px 12px')}
  display: flex;
  :focus-within {
    outline: none;
    box-shadow: ${props => props.theme.outline};
  }
  border-color: ${(props: CustomInputProps) => (props.inputError ? PASTEL_RED : '')};
  height: 40px;
`;

const CustomTextArea = styled.textarea`
  width: 100%;
  background: ${props => props.theme.controlBackground};
  border: 0.125em solid ${props => props.theme.controlBorder};
  border-radius: 0.125em;
  padding: ${props => (props.showEye ? '12px 36px 12px 12px' : '12px 12px')}
  display: flex;
  :focus-within {
    outline: none;
    box-shadow: ${props => props.theme.outline};
  }
  border-color: ${(props: CustomInputProps) => (props.inputError ? PASTEL_RED : '')};
  resize: none;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

interface CustomIconProps {
  showPassword?: boolean;
}

const CustomIcon = styled(Icon)`
  svg {
    margin-top: 6px;
    width: 23px;
    height: 23px;
    color: ${(props: CustomIconProps) => (props.showPassword ? BRIGHT_SKY_BLUE : '')};
    cursor: pointer;
    user-select: none;
  }
`;

const CustomIconWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 0;
`;

interface Props {
  type?: string;
  label?: string;
  value: string;
  inputError?: string | undefined;
  showEye?: boolean;
  textarea?: boolean;
  placeholder?: string;
  onChange(event: any): void;
  validate?(): void | undefined;
}

export class InputField extends Component<Props> {
  public state = { showPassword: false };
  private validatorTimeout: any = null;

  public handleEyeClick = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  public render() {
    const { value, label, onChange, inputError, type, showEye, textarea, placeholder } = this.props;
    return (
      <MainWrapper>
        {label && <Label>{label}</Label>}
        <InputWrapper>
          {textarea ? (
            <CustomTextArea
              value={value}
              onChange={onChange}
              inputError={inputError}
              onKeyUp={this.handleKeyUp}
            />
          ) : (
            <CustomInput
              value={value}
              onChange={onChange}
              inputError={inputError}
              onKeyUp={this.handleKeyUp}
              showEye={showEye}
              type={this.state.showPassword ? 'text' : type ? type : 'text'}
              placeholder={placeholder}
            />
          )}

          {showEye && (
            <CustomIconWrapper onClick={this.handleEyeClick}>
              <CustomIcon icon={'showNetworks'} showPassword={this.state.showPassword} />
            </CustomIconWrapper>
          )}
        </InputWrapper>

        {inputError && <InlineErrorMsg>{inputError}</InlineErrorMsg>}
      </MainWrapper>
    );
  }

  public handleKeyUp = () => {
    const { validate } = this.props;
    if (!validate) {
      return;
    }

    clearTimeout(this.validatorTimeout);

    // Call validation function 500ms after the user stops typing
    this.validatorTimeout = setTimeout(() => {
      validate();
    }, 500);
  };
}

export default InputField;
