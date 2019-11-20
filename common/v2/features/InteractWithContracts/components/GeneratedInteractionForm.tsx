import React, { useState } from 'react';
import styled from 'styled-components';

import { InputField, Dropdown, Button, Spinner, InlineErrorMsg } from 'v2/components';
import { COLORS, monospace } from 'v2/theme';

import FunctionDropdownOption from './FunctionDropdownOption';
import FunctionDropdownValue from './FunctionDropdownValue';
import { ABIItem, ABIField } from '../types';
import {
  isReadOperation,
  generateFunctionFieldsDisplayNames,
  getFunctionsFromABI,
  setFunctionOutputValues
} from '../helpers';
import { FieldLabel, BooleanField } from './fields';

const { LIGHT_GREY } = COLORS;

const Wrapper = styled.div`
  margin-top: 16px;
`;

interface FieldWraperProps {
  isOutput?: boolean;
}

// TODO: Fix the dropdown component instead of overriding styles
const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  .is-open > .Select-control > .Select-multi-value-wrapper > .Select-input:only-child {
    transform: translateY(0%);
    padding: 12px 15px;
    position: inherit;
  }
`;

const FieldWrapper = styled.div<FieldWraperProps>`
  display: flex;
  flex-direction: column;
  padding-left: ${props => (props.isOutput ? '30px' : 0)};

  flex: 1;
  p {
    font-size: 16px;
  }
`;

const Label = styled.p`
  line-height: 1;
  margin-bottom: 9px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: left;
  margin-top: 9px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const FormFieldsWrapper = styled.div`
  input {
    font-family: ${monospace};
    :disabled {
      background-color: ${LIGHT_GREY};
    }
  }
`;

interface Props {
  abi: ABIItem[];
  handleInteractionFormSubmit(submitedFunction: ABIItem): Promise<object>;
}

export default function GeneratedInteractionForm({ abi, handleInteractionFormSubmit }: Props) {
  const [loadingOutputs, setLoadingOutputs] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<ABIItem | undefined>(undefined);
  const [error, setError] = useState(undefined);

  const functions = getFunctionsFromABI(abi);

  const handleFunctionSelected = (selectedFunction: ABIItem) => {
    if (!selectedFunction) {
      return;
    }

    const newFunction = generateFunctionFieldsDisplayNames(selectedFunction);
    setCurrentFunction(newFunction);

    if (isReadOperation(newFunction) && newFunction.inputs.length === 0) {
      submitForm(newFunction);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    const updatedFunction = Object.assign({}, currentFunction);
    const inputIndexToChange = updatedFunction.inputs.findIndex(x => x.name === fieldName);
    updatedFunction.inputs[inputIndexToChange].value = value;
    setCurrentFunction(updatedFunction);
  };

  const submitForm = async (submitedFunction: ABIItem) => {
    if (!submitedFunction) {
      return;
    }
    setError(undefined);
    try {
      setLoadingOutputs(true);
      const outputValues = await handleInteractionFormSubmit(submitedFunction);
      const functionWithOutputValues = setFunctionOutputValues(submitedFunction, outputValues);
      setCurrentFunction(functionWithOutputValues);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoadingOutputs(false);
    }
  };

  let isRead;
  let inputs: ABIField[] = [];
  let outputs: ABIField[] = [];

  if (currentFunction !== undefined) {
    isRead = isReadOperation(currentFunction);
    inputs = currentFunction.inputs;
    outputs = currentFunction.outputs;
  }

  return (
    <Wrapper>
      <hr />
      <DropdownWrapper>
        <Label>Read / Write Contract</Label>
        <Dropdown
          value={currentFunction}
          options={functions}
          onChange={handleFunctionSelected}
          optionComponent={FunctionDropdownOption}
          valueComponent={FunctionDropdownValue}
          searchable={true}
        />
      </DropdownWrapper>

      <FormFieldsWrapper>
        {currentFunction && (
          <>
            {inputs.length > 0 && (
              <div>
                {inputs.map((field, index) => {
                  return (
                    <FieldWrapper key={`${field.displayName}${index}${currentFunction.name}`}>
                      <InputField
                        label={<FieldLabel fieldName={field.displayName!} fieldType={field.type} />}
                        value={field.value}
                        onChange={({ target: { value } }) => handleInputChange(field.name, value)}
                      />
                    </FieldWrapper>
                  );
                })}
              </div>
            )}

            {isRead && (
              <div>
                {outputs.map((field, index) => {
                  return (
                    <FieldWrapper
                      isOutput={true}
                      key={`${field.displayName}${index}${currentFunction.name}`}
                    >
                      {field.value !== undefined && field.type === 'bool' ? (
                        <BooleanField
                          fieldName={field.displayName!}
                          fieldType={field.type}
                          fieldValue={field.value}
                        />
                      ) : (
                        <InputField
                          label={
                            <FieldLabel
                              fieldName={field.displayName!}
                              fieldType={field.type}
                              isOutput={true}
                            />
                          }
                          value={field.value}
                          disabled={true}
                        />
                      )}
                    </FieldWrapper>
                  );
                })}
              </div>
            )}
            <SpinnerWrapper>{loadingOutputs && <Spinner size="x2" />}</SpinnerWrapper>
            {error && <InlineErrorMsg>{error}</InlineErrorMsg>}
            <ButtonWrapper>
              {isRead &&
                (inputs.length > 0 && (
                  <Button onClick={() => submitForm(currentFunction)}>Read</Button>
                ))}
              {!isRead && <Button onClick={() => submitForm(currentFunction)}>Write</Button>}
            </ButtonWrapper>
          </>
        )}
      </FormFieldsWrapper>
    </Wrapper>
  );
}
