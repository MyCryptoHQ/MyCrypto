import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, InlineMessage, InputField, Selector, Spinner, Typography } from '@components';
import { COLORS, monospace, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ITxConfig, Network, StoreAccount } from '@types';

import {
  constructGasCallProps,
  generateFunctionFieldsDisplayNames,
  getFunctionsFromABI,
  isPayable,
  isReadOperation,
  setFunctionOutputValues
} from '../helpers';
import { ABIField, ABIItem } from '../types';
import { BooleanOutputField, BooleanSelector, FieldLabel } from './fields';
import FunctionDropdownItem from './FunctionDropdownItem';
import WriteForm from './WriteForm';

const { GREY_LIGHTER, WHITE } = COLORS;

interface FieldWraperProps {
  isOutput?: boolean;
}

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const FieldWrapper = styled.div<FieldWraperProps>`
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isOutput ? '30px' : 0)};

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
`;

const WriteFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ErrorMessage = styled(InlineMessage)`
  padding-top: ${SPACING.XS};
`;

interface Props {
  abi: ABIItem[];
  account: StoreAccount;
  network: Network;
  nonce: string;
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;

  contractAddress: string;
  interactionDataFromURL: { functionName?: string; inputs: { name: string; value: string }[] };
  handleInteractionFormSubmit(submitedFunction: ABIItem): Promise<TObject>;
  handleInteractionFormWriteSubmit(submitedFunction: ABIItem): Promise<TObject>;
  handleAccountSelected(account: StoreAccount | undefined): void;
  handleGasSelectorChange(payload: ITxConfig): void;
  handleGasLimitChange(payload: string): void;
  handleNonceChange(payload: string): void;
}

export default function GeneratedInteractionForm({
  abi,
  handleInteractionFormSubmit,
  account,
  network,
  nonce,
  gasLimit,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  contractAddress,
  handleAccountSelected,
  handleInteractionFormWriteSubmit,
  handleGasSelectorChange,
  handleNonceChange,
  handleGasLimitChange,
  interactionDataFromURL
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<ABIItem | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [gasCallProps, setGasCallProps] = useState({});
  const [isFormFilledFromURL, setIsFormFilledFromURL] = useState(false);
  const functions = getFunctionsFromABI(abi);

  const updateGasCallProps = () => {
    if (!account || !currentFunction) return;
    setGasCallProps(constructGasCallProps(contractAddress, currentFunction, account));
  };

  useEffect(updateGasCallProps, [account]);

  const handleFunctionSelected = (selectedFunction?: ABIItem) => {
    if (!selectedFunction) return;

    const newFunction = generateFunctionFieldsDisplayNames(selectedFunction);
    setCurrentFunction(newFunction);
    setError(undefined);

    if (isReadOperation(newFunction) && newFunction.inputs.length === 0) {
      submitFormRead(newFunction);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    const updatedFunction = Object.assign({}, currentFunction);
    const inputIndexToChange = updatedFunction.inputs.findIndex((x) => x.name === fieldName);

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
      setError(e.reason ? e.reason : e.message);
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
      setError(e.reason ? e.reason : e.message);
    } finally {
      setIsLoading(false);
    }
  };

  let isRead = true;
  let inputs: ABIField[] = [];
  let outputs: ABIField[] = [];

  if (currentFunction !== undefined) {
    isRead = isReadOperation(currentFunction);
    inputs = currentFunction.inputs;
    outputs = currentFunction.outputs;
  }

  const { functionName: functionNameFromURL, inputs: inputsFromURL } = interactionDataFromURL;
  const functionFromURL = functions.find((x) => x.name === functionNameFromURL);

  if (functionFromURL && !currentFunction) {
    handleFunctionSelected(functionFromURL);
  }

  useEffect(() => {
    if (!isFormFilledFromURL && currentFunction && functionNameFromURL === currentFunction.name) {
      inputsFromURL.forEach((inputFromURL) => {
        handleInputChange(inputFromURL.name, inputFromURL.value);
      });
      setIsFormFilledFromURL(true);
      //if all inputs are prefilled then trigger read button
      if (isRead && currentFunction.inputs.every((input) => input.value)) {
        submitFormRead(currentFunction);
      }
    }
  }, [currentFunction]);

  return (
    <>
      <HorizontalLine />
      <DropdownWrapper>
        <Label>{translateRaw('CONTRACT_INTERACT_TITLE')}</Label>
        <Selector
          value={currentFunction}
          options={functions}
          onChange={(selectedFunction) => {
            handleFunctionSelected(selectedFunction);
          }}
          optionComponent={({ data, selectOption }) => (
            <FunctionDropdownItem option={data} onSelect={selectOption} paddingLeft={SPACING.SM} />
          )}
          valueComponent={({ value }) => <FunctionDropdownItem option={value} />}
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
                          name={field.name}
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
            <ActionWrapper>
              {isRead && inputs.length > 0 && (
                <ActionButton
                  color={WHITE}
                  onClick={() => submitFormRead(currentFunction)}
                  fullwidth={true}
                >
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
                    handleGasSelectorChange={handleGasSelectorChange}
                    handleGasLimitChange={handleGasLimitChange}
                    handleNonceChange={handleNonceChange}
                    estimateGasCallProps={gasCallProps}
                    nonce={nonce}
                    gasLimit={gasLimit}
                    gasPrice={gasPrice}
                    maxFeePerGas={maxFeePerGas}
                    maxPriorityFeePerGas={maxPriorityFeePerGas}
                  />
                </WriteFormWrapper>
              )}
            </ActionWrapper>
            <SpinnerWrapper>{isLoading && <Spinner size={2} />}</SpinnerWrapper>
            {error && (
              <ErrorMessage>
                {translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', { $error: error })}
              </ErrorMessage>
            )}
          </>
        )}
      </FormFieldsWrapper>
    </>
  );
}
