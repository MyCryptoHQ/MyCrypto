import { Component, ElementType, HTMLProps } from 'react';

import { Icon } from '@mycrypto/ui';
import styled from 'styled-components';

import { InlineMessage, Label, Spinner } from '@components';
import { COLORS } from '@theme';
import { InlineMessageType } from '@types';
import { sanitizeDecimalSeparator } from '@utils';

const MainWrapper = styled.div<WrapperProps>`
  margin-bottom: ${(props) => props.marginBottom};
  width: 100%;
`;

interface WrapperProps {
  marginBottom?: string;
}

interface CustomInputProps {
  inputError?: string | JSX.Element;
  inputErrorBorder?: boolean;
  showEye?: boolean;
  customIcon?: ElementType;
  height?: string;
  maxHeight?: string;
  resizable?: boolean;
}

const CustomInput = styled.input<CustomInputProps>`
  width: 100%;
  background: ${(props) => props.theme.controlBackground};
  border: 0.125em solid ${(props) => props.theme.controlBorder};
  border-radius: 0.125em;
  padding: ${(props) => (props.showEye || props.customIcon ? '12px 36px 12px 12px' : '12px 12px')};
  display: flex;
  :focus-within {
    outline: none;
    box-shadow: ${(props) => props.theme.outline};
  }
  ::placeholder {
    color: ${COLORS.GREY_LIGHT};
    opacity: 1;
  }
  border-color: ${(props) => (props.inputError && props.inputErrorBorder ? COLORS.PASTEL_RED : '')};
  ${(props) => props.height && `height: ${props.height}`};
`;

const CustomTextArea = styled.textarea<CustomInputProps>`
  width: 100%;
  background: ${(props) => props.theme.controlBackground};
  border: 0.125em solid ${(props) => props.theme.controlBorder};
  border-radius: 0.125em;
  padding: ${(props) => (props.showEye ? '12px 36px 12px 12px' : '12px 12px')};
  display: flex;
  :focus-within {
    outline: none;
    box-shadow: ${(props) => props.theme.outline};
  }
  ::placeholder {
    color: ${COLORS.GREY_LIGHT};
    opacity: 1;
  }
  border-color: ${(props) => (props.inputError ? COLORS.PASTEL_RED : '')};
  resize: ${(props) => (props.resizable ? 'default' : 'none')};
  ${(props) => props.height && `height: ${props.height}`};
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight}`};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    :disabled {
      background-color: ${COLORS.GREY_LIGHTER};
    }
  }
`;

interface CustomIconProps {
  showPassword?: boolean;
}

const EyeIcon = styled(Icon)`
  svg {
    margin-top: 6px;
    width: 23px;
    height: 23px;
    color: ${(props: CustomIconProps) => (props.showPassword ? COLORS.BLUE_BRIGHT : '')};
    cursor: pointer;
    user-select: none;
  }
`;

const DefaultIconWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 0;
`;

const CustomIconWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 0;
`;

const CustomIcon = styled.span`
  display: flex;
  img {
    margin-top: 2px;
    margin-bottom: 2px;
    margin-left: 8px;
    color: ${COLORS.BLUE_BRIGHT};
    cursor: pointer;
    user-select: none;
  }
`;

interface Props {
  name?: string;
  type?: string;
  inputMode?: HTMLProps<HTMLInputElement>['inputMode'];
  label?: string | JSX.Element;
  value: string | undefined;
  inputError?: string | JSX.Element | undefined;
  inputErrorType?: InlineMessageType;
  inputErrorBorder?: boolean;
  showEye?: boolean;
  customIcon?: ElementType;
  textarea?: boolean;
  placeholder?: string;
  height?: string;
  maxHeight?: string;
  marginBottom?: string;
  resizableTextArea?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onChange?(event: any): void;
  onBlur?(event: any): void;
  validate?(): Promise<void> | void | undefined;
  onFocus?(event: any): void;
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
      onFocus,
      inputError,
      inputErrorType,
      inputErrorBorder = false,
      type,
      showEye,
      customIcon,
      textarea,
      placeholder,
      height,
      resizableTextArea,
      disabled,
      isLoading,
      maxHeight,
      marginBottom = '15px',
      inputMode
    } = this.props;

    const IconComponent = customIcon as ElementType;

    return (
      <MainWrapper marginBottom={marginBottom}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <InputWrapper>
          {textarea ? (
            <CustomTextArea
              name={name}
              id={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              inputError={inputError}
              onKeyUp={this.handleKeyUp}
              placeholder={placeholder ? placeholder : ''}
              height={height}
              resizable={resizableTextArea}
              disabled={disabled}
              maxHeight={maxHeight}
            />
          ) : (
            <CustomInput
              name={name}
              id={name}
              value={value}
              onChange={(e) => {
                if (!onChange) return;

                if (inputMode === 'decimal') {
                  e.target.value = sanitizeDecimalSeparator(e.target.value);
                }
                onChange(e);
              }}
              onBlur={onBlur}
              onFocus={onFocus}
              inputError={inputError}
              inputErrorBorder={inputErrorBorder}
              onKeyUp={this.handleKeyUp}
              showEye={showEye}
              customIcon={customIcon}
              type={this.state.showPassword ? 'text' : type ? type : 'text'}
              placeholder={placeholder ? placeholder : ''}
              height={height}
              disabled={isLoading ?? disabled}
              inputMode={inputMode}
            />
          )}

          {customIcon && (
            <CustomIconWrapper>
              <CustomIcon>
                <IconComponent />
              </CustomIcon>
            </CustomIconWrapper>
          )}

          {showEye && (
            <DefaultIconWrapper onClick={this.handleEyeClick}>
              <EyeIcon icon={'showNetworks'} showPassword={this.state.showPassword} />
            </DefaultIconWrapper>
          )}

          {isLoading && (
            <DefaultIconWrapper>
              <Spinner />
            </DefaultIconWrapper>
          )}
        </InputWrapper>

        {inputError && <InlineMessage type={inputErrorType}>{inputError}</InlineMessage>}
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
