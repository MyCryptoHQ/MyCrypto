import styled from 'styled-components';
import React, { useState } from 'react';

import { InputField, Dropdown, Button, Spinner, InlineErrorMsg, Typography } from 'v2/components';
import { StoreAccount, NetworkId, ITxConfig } from 'v2/types';
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
import { FieldLabel, BooleanOutputField } from './fields';
import WriteForm from './WriteForm';
import BooleanSelector from './fields/BooleanSelector';

const { LIGHT_GREY } = COLORS;

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

const Label = styled(Typography)`
  line-height: 1;
  margin-bottom: 9px;
  font-weight: bold;
`;

const ActionWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: left;
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

const HorizontalLine = styled.div`
  height: 1px;
  color: #000;
  background-color: ${LIGHT_GREY};
  width: 100%;
  margin: 20px 0;
`;

const ActionButton = styled(Button)`
  margin-top: 18px;
  width: fit-content;
`;

const WriteFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
interface Props {
  abi: ABIItem[];
  account: StoreAccount;
  networkId: NetworkId;
  rawTransaction: ITxConfig;
  handleInteractionFormSubmit(submitedFunction: ABIItem): Promise<object>;
  handleInteractionFormWriteSubmit(submitedFunction: ABIItem): Promise<object>;
  handleAccountSelected(account: StoreAccount | undefined): void;
  estimateGas(submitedFunction: ABIItem): Promise<void>;
  handleGasSelectorChange(payload: ITxConfig): void;
}

export default function GeneratedInteractionForm({
  abi,
  handleInteractionFormSubmit,
  account,
  networkId,
  rawTransaction,
  handleAccountSelected,
  handleInteractionFormWriteSubmit,
  estimateGas,
  handleGasSelectorChange
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<ABIItem | undefined>(undefined);

  const [error, setError] = useState(undefined);
  const [isAutoGasSet, setIsAutoGasSet] = useState(true);

  const functions = getFunctionsFromABI(abi);

  const estimateGasHandle = (forceEstimate: boolean = false) => {
    if (!currentFunction) {
      return;
    }

    if (isAutoGasSet || forceEstimate) {
      estimateGas(currentFunction);
    }
  };

  const handleFunctionSelected = (selectedFunction: ABIItem) => {
    if (!selectedFunction) {
      return;
    }

    const newFunction = generateFunctionFieldsDisplayNames(selectedFunction);
    setCurrentFunction(newFunction);
    setIsAutoGasSet(true);
    handleAccountSelected(undefined);
    setError(undefined);

    if (isReadOperation(newFunction) && newFunction.inputs.length === 0) {
      submitFormRead(newFunction);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    const updatedFunction = Object.assign({}, currentFunction);
    const inputIndexToChange = updatedFunction.inputs.findIndex(x => x.name === fieldName);
    updatedFunction.inputs[inputIndexToChange].value = value;
    setCurrentFunction(updatedFunction);
  };

  const submitFormRead = async (submitedFunction: ABIItem) => {
    if (!submitedFunction) {
      return;
    }
    setError(undefined);
    try {
      setIsLoading(true);
      const outputValues = await handleInteractionFormSubmit(submitedFunction);
      const functionWithOutputValues = setFunctionOutputValues(submitedFunction, outputValues);
      setCurrentFunction(functionWithOutputValues);
    } catch (e) {
      setError(e.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const submitFormWrite = async (submitedFunction: ABIItem) => {
    if (!submitedFunction) {
      return;
    }
    setError(undefined);
    try {
      setIsLoading(true);
      await handleInteractionFormWriteSubmit(submitedFunction);
    } catch (e) {
      setError(e.toString());
    } finally {
      setIsLoading(false);
    }
  };

  let isRead: boolean = true;
  let inputs: ABIField[] = [];
  let outputs: ABIField[] = [];

  if (currentFunction !== undefined) {
    isRead = isReadOperation(currentFunction);
    inputs = currentFunction.inputs;
    outputs = currentFunction.outputs;
  }

  return (
    <>
      <HorizontalLine />
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
                      {field.type === 'bool' ? (
                        <BooleanSelector
                          fieldName={field.name}
                          fieldType={field.type}
                          fieldDisplayName={field.displayName!}
                          handleInputChange={handleInputChange}
                          value={field.value}
                        />
                      ) : (
                        <InputField
                          label={
                            <FieldLabel fieldName={field.displayName!} fieldType={field.type} />
                          }
                          value={field.value}
                          onChange={({ target: { value } }) => handleInputChange(field.name, value)}
                          validate={!isRead ? estimateGasHandle : undefined}
                        />
                      )}
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
                        <BooleanOutputField
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
            <SpinnerWrapper>{isLoading && <Spinner size="x2" />}</SpinnerWrapper>
            {error && <InlineErrorMsg>{error}</InlineErrorMsg>}
            <ActionWrapper>
              {isRead &&
                (inputs.length > 0 && (
                  <ActionButton onClick={() => submitFormRead(currentFunction)}>Read</ActionButton>
                ))}
              {!isRead && (
                <WriteFormWrapper>
                  <HorizontalLine />
                  {currentFunction.payable && (
                    <FieldWrapper>
                      <InputField
                        label="Value"
                        value={currentFunction.payAmount}
                        onChange={({ target: { value } }) =>
                          setCurrentFunction({
                            ...currentFunction,
                            payAmount: value
                          })
                        }
                        validate={estimateGasHandle}
                      />
                    </FieldWrapper>
                  )}
                  <WriteForm
                    account={account}
                    networkId={networkId}
                    handleAccountSelected={handleAccountSelected}
                    handleSubmit={submitFormWrite}
                    currentFunction={currentFunction}
                    isAutoGasSet={isAutoGasSet}
                    setIsAutoGasSet={setIsAutoGasSet}
                    estimateGasHandle={estimateGasHandle}
                    rawTransaction={rawTransaction}
                    handleGasSelectorChange={handleGasSelectorChange}
                  />
                </WriteFormWrapper>
              )}
            </ActionWrapper>
          </>
        )}
      </FormFieldsWrapper>
    </>
  );
}
