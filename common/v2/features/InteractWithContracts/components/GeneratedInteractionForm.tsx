import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { InputField, Dropdown, Button, Spinner, InlineErrorMsg, Typography } from 'v2/components';
import { StoreAccount, ITxConfig, Network } from 'v2/types';
import { COLORS, monospace } from 'v2/theme';
import { translateRaw } from 'v2/translations';

import FunctionDropdownOption from './FunctionDropdownOption';
import FunctionDropdownValue from './FunctionDropdownValue';
import { ABIItem, ABIField } from '../types';
import {
  isReadOperation,
  generateFunctionFieldsDisplayNames,
  getFunctionsFromABI,
  setFunctionOutputValues,
  constructGasCallProps,
  isPayable
} from '../helpers';
import { FieldLabel, BooleanOutputField, BooleanSelector } from './fields';
import WriteForm from './WriteForm';

const { GREY_LIGHTER } = COLORS;

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
    font-size: 1em;
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
      background-color: ${GREY_LIGHTER};
    }
  }
`;

const HorizontalLine = styled.div`
  height: 1px;
  color: #000;
  background-color: ${GREY_LIGHTER};
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
  network: Network;
  rawTransaction: ITxConfig;
  contractAddress: string;
  interactionDataFromURL: { functionName?: string; inputs: { name: string; value: string }[] };
  handleInteractionFormSubmit(submitedFunction: ABIItem): Promise<object>;
  handleInteractionFormWriteSubmit(submitedFunction: ABIItem): Promise<object>;
  handleAccountSelected(account: StoreAccount | undefined): void;
  handleGasSelectorChange(payload: ITxConfig): void;
}

export default function GeneratedInteractionForm({
  abi,
  handleInteractionFormSubmit,
  account,
  network,
  rawTransaction,
  contractAddress,
  handleAccountSelected,
  handleInteractionFormWriteSubmit,
  handleGasSelectorChange,
  interactionDataFromURL
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<ABIItem | undefined>(undefined);
  const [error, setError] = useState(undefined);
  const [gasCallProps, setGasCallProps] = useState({});
  const [isFormFilledFromURL, setIsFormFilledFromURL] = useState(false);
  const functions = getFunctionsFromABI(abi);

  const updateGasCallProps = () => {
    if (!account || !currentFunction) return;
    setGasCallProps(constructGasCallProps(contractAddress, currentFunction, account));
  };

  useEffect(updateGasCallProps, [account]);

  const handleFunctionSelected = (selectedFunction: ABIItem) => {
    if (!selectedFunction) return;

    const newFunction = generateFunctionFieldsDisplayNames(selectedFunction);
    setCurrentFunction(newFunction);
    handleAccountSelected(undefined);
    setError(undefined);

    if (isReadOperation(newFunction) && newFunction.inputs.length === 0) {
      submitFormRead(newFunction);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    const updatedFunction = Object.assign({}, currentFunction);
    const inputIndexToChange = updatedFunction.inputs.findIndex(x => x.name === fieldName);

    if (updatedFunction.inputs[inputIndexToChange]) {
      updatedFunction.inputs[inputIndexToChange].value = value;
    }

    setCurrentFunction(updatedFunction);
  };

  const submitFormRead = async (submitedFunction: ABIItem) => {
    if (!submitedFunction) return;

    setError(undefined);
    try {
      setIsLoading(true);
      const outputValues = await handleInteractionFormSubmit(submitedFunction);
      const functionWithOutputValues = setFunctionOutputValues(submitedFunction, outputValues);
      setCurrentFunction(functionWithOutputValues);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFormWrite = async (submitedFunction: ABIItem) => {
    if (!submitedFunction) return;

    setError(undefined);
    try {
      setIsLoading(true);
      await handleInteractionFormWriteSubmit(submitedFunction);
    } catch (e) {
      setError(e.message);
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

  const { functionName: functionNameFromURL, inputs: inputsFromURL } = interactionDataFromURL;
  const functionFromURL = functions.find(x => x.name === functionNameFromURL);

  if (functionFromURL && !currentFunction) {
    handleFunctionSelected(functionFromURL);
  }

  useEffect(() => {
    if (!isFormFilledFromURL && currentFunction && functionNameFromURL === currentFunction.name) {
      inputsFromURL.forEach(inputFromURL => {
        handleInputChange(inputFromURL.name, inputFromURL.value);
      });
      setIsFormFilledFromURL(true);
      //if all inputs are prefilled then trigger read button
      if (isRead && currentFunction.inputs.every(input => input.value)) {
        submitFormRead(currentFunction);
      }
    }
  }, [currentFunction]);

  return (
    <>
      <HorizontalLine />
      <DropdownWrapper>
        <Label>{translateRaw('CONTRACT_INTERACT_TITLE')}</Label>
        <Dropdown
          value={currentFunction}
          options={functions}
          onChange={selectedFunction => {
            handleFunctionSelected(selectedFunction);
          }}
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
                          validate={updateGasCallProps}
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
              {isRead && inputs.length > 0 && (
                <ActionButton onClick={() => submitFormRead(currentFunction)}>
                  {translateRaw('ACTION_16')}
                </ActionButton>
              )}
              {!isRead && (
                <WriteFormWrapper>
                  <HorizontalLine />
                  {isPayable(currentFunction) && (
                    <FieldWrapper>
                      <InputField
                        label={translateRaw('VALUE')}
                        value={currentFunction.payAmount}
                        onChange={({ target: { value } }) =>
                          setCurrentFunction({
                            ...currentFunction,
                            payAmount: value
                          })
                        }
                        validate={updateGasCallProps}
                      />
                    </FieldWrapper>
                  )}
                  <WriteForm
                    account={account}
                    network={network}
                    handleAccountSelected={handleAccountSelected}
                    handleSubmit={submitFormWrite}
                    currentFunction={currentFunction}
                    rawTransaction={rawTransaction}
                    handleGasSelectorChange={handleGasSelectorChange}
                    estimateGasCallProps={gasCallProps}
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
