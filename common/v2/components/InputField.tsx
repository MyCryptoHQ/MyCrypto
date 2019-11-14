import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from '@mycrypto/ui';

import { COLORS } from 'v2/theme';
import { InlineErrorMsg, Spinner } from 'v2/components';

const { PASTEL_RED, BRIGHT_SKY_BLUE, DARK_SILVER } = COLORS;

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
  height?: string;
  resizable?: boolean;
}

const CustomInput = styled.input<CustomInputProps>`
  width: 100%;
  background: ${props => props.theme.controlBackground};
  border: 0.125em solid ${props => props.theme.controlBorder};
  border-radius: 0.125em;
  padding: ${props => (props.showEye ? '12px 36px 12px 12px' : '12px 12px')};
  display: flex;
  :focus-within {
    outline: none;
    box-shadow: ${props => props.theme.outline};
  }
  ::placeholder {
    color: ${DARK_SILVER};
    opacity: 1;
  }
  border-color: ${props => (props.inputError ? PASTEL_RED : '')};
  ${props => props.height && `height: ${props.height}`}
`;

const CustomTextArea = styled.textarea<CustomInputProps>`
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
  ::placeholder {
    color: ${DARK_SILVER};
    opacity: 1;
  }
  border-color: ${props => (props.inputError ? PASTEL_RED : '')};
  resize:  ${props => (props.resizable ? 'default' : 'none')};
  ${props => props.height && `height: ${props.height}`}
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
  name?: string;
  type?: string;
  label?: string | JSX.Element;
  value: string | undefined;
  inputError?: string | undefined;
  showEye?: boolean;
  textarea?: boolean;
  placeholder?: string;
  height?: string;
  isLoading?: boolean;
  resizableTextArea?: boolean;
  disabled?: boolean;
  onChange?(event: any): void;
  onBlur?(event: any): void;
  validate?(): void | undefined;
}

export class InputField extends Component<Props> {
  public state = { showPassword: false };
  private validatorTimeout: any = null;

  public handleEyeClick = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  public render() {
    const {
      name,
      value,
      label,
      onChange,
      onBlur,
      inputError,
      type,
      showEye,
      textarea,
      placeholder,
      height,
      isLoading,
      resizableTextArea,
      disabled
    } = this.props;
    return (
      <MainWrapper>
        {label && <Label>{label}</Label>}
        <InputWrapper>
          {textarea ? (
            <CustomTextArea
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputError={inputError}
              onKeyUp={this.handleKeyUp}
              placeholder={placeholder ? placeholder : ''}
              height={height}
              resizable={resizableTextArea}
              disabled={disabled}
            />
          ) : (
            <CustomInput
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputError={inputError}
              onKeyUp={this.handleKeyUp}
              showEye={showEye}
              type={this.state.showPassword ? 'text' : type ? type : 'text'}
              placeholder={placeholder ? placeholder : ''}
              height={height}
              disabled={isLoading}
            />
          )}

          {showEye && (
            <CustomIconWrapper onClick={this.handleEyeClick}>
              <CustomIcon icon={'showNetworks'} showPassword={this.state.showPassword} />
            </CustomIconWrapper>
          )}

          {isLoading && (
            <CustomIconWrapper>
              <Spinner />
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
