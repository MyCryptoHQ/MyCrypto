import React, { Component } from 'react';
import styled from 'styled-components';
import { COLORS } from 'v2/features/constants';
import _ from 'lodash';

const { PASTEL_RED } = COLORS;

const MainWrapper = styled.div`
  margin-bottom: 15px;
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
}

const CustomInput = styled.input`
  width: 100%;
  background: ${props => props.theme.controlBackground};
  border: 0.125em solid ${props => props.theme.controlBorder};
  border-radius: 0.125em;
  padding: 12px 12px;
  display: flex;
  :focus-within {
    outline: none;
    box-shadow: ${props => props.theme.outline};
  }
  border-color: ${(props: CustomInputProps) => (props.inputError ? PASTEL_RED : '')};
`;

const ErrorMessage = styled.div`
  width: 100%;
  text-align: left;
  color: ${PASTEL_RED};
`;

interface Props {
  type?: string;
  label?: string;
  value: string;
  inputError?: string | undefined;
  onChange(event: any): void;
  validate?(): void | undefined;
}

let validatorTimeout: any = null;

export class InputField extends Component<Props> {
  public render() {
    const { value, label, onChange, inputError, type } = this.props;
    return (
      <MainWrapper>
        {label && <Label>{label}</Label>}
        <CustomInput
          value={value}
          onChange={onChange}
          inputError={inputError}
          onKeyUp={this.handleKeyUp}
          type={type ? type : 'text'}
        />
        {inputError && <ErrorMessage>{inputError}</ErrorMessage>}
      </MainWrapper>
    );
  }

  public handleKeyUp = () => {
    const { validate } = this.props;
    clearTimeout(validatorTimeout);

    // Call validation function 500ms after the user stops typing
    validatorTimeout = setTimeout(() => {
      if (validate) {
        validate();
      }
    }, 500);
  };
}

export default InputField;
