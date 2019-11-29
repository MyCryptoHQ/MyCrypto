import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Identicon, Button } from '@mycrypto/ui';

import { NetworkSelectDropdown, InputField, Dropdown, InlineErrorMsg } from 'v2/components';
import { NetworkId, Contract, StoreAccount, ITxConfig, ExtendedContract } from 'v2/types';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { translateRaw } from 'v2/translations';

import ContractDropdownOption from './ContractDropdownOption';
import ContractDropdownValue from './ContractDropdownValue';
import GeneratedInteractionForm from './GeneratedInteractionForm';
import { CUSTOM_CONTRACT_ADDRESS } from '../constants';
import { ABIItem } from '../types';

const { BRIGHT_SKY_BLUE } = COLORS;
const { SCREEN_SM } = BREAK_POINTS;

const NetworkSelectorWrapper = styled.div`
  margin-bottom: 12px;
  label {
    font-weight: normal;
  }
`;

const ContractSelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  flex: 1;
  p {
    font-size: 1em;
  }
`;

const Separator = styled.div`
  width: 22px;
`;

const Label = styled.div`
  line-height: 1;
  margin-bottom: 9px;
`;
const IdenticonIcon = styled(Identicon)`
  margin-left: 12px;
  margin-top: 8px;

  img {
    width: 48px;
    height: 48px;
    max-width: none;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
`;

const SaveContractWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: ${SCREEN_SM}) {
    flex-direction: column;
  }
`;

const SaveButtonWrapper = styled.div`
  width: 310px;
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-left: 8px;
  justify-content: flex-end;

  @media (max-width: ${SCREEN_SM}) {
    justify-content: flex-start;
    padding-left: 0px;
    padding-bottom: 8px;
  }
`;

// TODO: Fix the dropdown component instead of overriding styles
const DropdownContainer = styled.div`
  .is-open > .Select-control > .Select-multi-value-wrapper > .Select-input:only-child {
    transform: translateY(0%);
    padding: 12px 15px;
    position: inherit;
  }
`;

const ErrorWrapper = styled.div`
  margin-bottom: 12px;
`;

const ContractSelectLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteLabel = styled(Label)`
  color: ${BRIGHT_SKY_BLUE};
  cursor: pointer;
`;

interface Props {
  networkId: NetworkId;
  contractAddress: string;
  abi: string;
  contract: ExtendedContract;
  contracts: Contract[];
  showGeneratedForm: boolean;
  account: StoreAccount;
  customContractName: string;
  rawTransaction: ITxConfig;
  handleContractSelected(contract: Contract | undefined): void;
  handleNetworkSelected(networkId: string): void;
  handleContractAddressChanged(address: string): void;
  handleAbiChanged(abi: string): void;
  handleCustomContractNameChanged(customContractName: string): void;
  updateNetworkContractOptions(networkId: NetworkId): void;
  setGeneratedFormVisible(visible: boolean): void;
  handleInteractionFormSubmit(submitedFunction: ABIItem): any;
  goToNextStep(): void;
  handleInteractionFormWriteSubmit(submitedFunction: ABIItem): Promise<object>;
  handleAccountSelected(account: StoreAccount): void;
  handleSaveContractSubmit(): void;
  estimateGas(submitedFunction: ABIItem): Promise<void>;
  handleGasSelectorChange(payload: ITxConfig): void;
  handleDeleteContract(contractUuid: string): void;
}

export default function Interact(props: Props) {
  const {
    networkId,
    contractAddress,
    abi,
    contract,
    contracts,
    showGeneratedForm,
    handleNetworkSelected,
    handleContractSelected,
    handleContractAddressChanged,
    handleAbiChanged,
    handleCustomContractNameChanged,
    updateNetworkContractOptions,
    setGeneratedFormVisible,
    handleInteractionFormSubmit,
    account,
    customContractName,
    handleAccountSelected,
    handleInteractionFormWriteSubmit,
    handleSaveContractSubmit,
    estimateGas,
    rawTransaction,
    handleGasSelectorChange,
    handleDeleteContract
  } = props;

  const [error, setError] = useState(undefined);

  useEffect(() => {
    updateNetworkContractOptions(networkId);
  }, [networkId]);

  useEffect(() => {
    setGeneratedFormVisible(false);
  }, [abi]);

  const saveContract = () => {
    setError(undefined);
    try {
      handleSaveContractSubmit();
    } catch (e) {
      setError(e.message);
    }
  };

  const submitInteract = () => {
    setError(undefined);
    try {
      setGeneratedFormVisible(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const customEditingMode = contract && contract.address === CUSTOM_CONTRACT_ADDRESS;

  return (
    <>
      <NetworkSelectorWrapper>
        <NetworkSelectDropdown
          network={networkId}
          onChange={network => {
            handleNetworkSelected(network);
          }}
        />
      </NetworkSelectorWrapper>
      <ContractSelectionWrapper>
        <FieldWrapper>
          <ContractSelectLabelWrapper>
            <Label>{translateRaw('CONTRACT_TITLE_2')}</Label>
            {contract && contract.isCustom && (
              <DeleteLabel onClick={() => handleDeleteContract(contract.uuid)}>
                {translateRaw('ACTION_15')}
              </DeleteLabel>
            )}
          </ContractSelectLabelWrapper>

          <DropdownContainer>
            <Dropdown
              value={contract}
              options={contracts}
              onChange={handleContractSelected}
              optionComponent={ContractDropdownOption}
              valueComponent={ContractDropdownValue}
              searchable={true}
            />
          </DropdownContainer>
        </FieldWrapper>
        <Separator />
        <FieldWrapper>
          <InputWrapper>
            <InputField
              label={translateRaw('CONTRACT_TITLE')}
              value={contractAddress}
              placeholder={translateRaw('CONTRACT_ADDRESS_PLACEHOLDER')}
              onChange={({ target: { value } }) => handleContractAddressChanged(value)}
            />
            {contractAddress && <IdenticonIcon address={contractAddress} />}
          </InputWrapper>
        </FieldWrapper>
      </ContractSelectionWrapper>
      <FieldWrapper>
        <InputWrapper>
          <InputField
            label={translateRaw('CONTRACT_JSON')}
            value={abi}
            placeholder={`[{"type":"constructor","inputs":[{"name":"param1","type":"uint256","indexed":true}],"name":"Event"},{"type":"function","inputs":[{"name":"a","type":"uint256"}],"name":"foo","outputs":[]}]`}
            onChange={({ target: { value } }) => handleAbiChanged(value)}
            textarea={true}
            resizableTextArea={true}
            height={'108px'}
            disabled={!customEditingMode}
          />
        </InputWrapper>
        {customEditingMode && (
          <>
            <SaveContractWrapper>
              <InputField
                label={translateRaw('CONTRACT_NAME')}
                value={customContractName}
                placeholder={translateRaw('CONTRACT_NAME_PLACEHOLDER')}
                onChange={({ target: { value } }) => handleCustomContractNameChanged(value)}
              />
              <SaveButtonWrapper>
                <Button large={false} secondary={true} onClick={saveContract}>
                  {translateRaw('SAVE_CONTRACT')}
                </Button>
              </SaveButtonWrapper>
            </SaveContractWrapper>
            {error && (
              <ErrorWrapper>
                <InlineErrorMsg>{error}</InlineErrorMsg>
              </ErrorWrapper>
            )}
          </>
        )}
      </FieldWrapper>

      <ButtonWrapper>
        <Button onClick={submitInteract}>{translateRaw('INTERACT_WITH_CONTRACT')}</Button>
      </ButtonWrapper>
      {showGeneratedForm && abi && (
        <GeneratedInteractionForm
          abi={JSON.parse(abi)}
          handleInteractionFormSubmit={handleInteractionFormSubmit}
          account={account}
          handleAccountSelected={handleAccountSelected}
          handleInteractionFormWriteSubmit={handleInteractionFormWriteSubmit}
          networkId={networkId}
          estimateGas={estimateGas}
          rawTransaction={rawTransaction}
          handleGasSelectorChange={handleGasSelectorChange}
        />
      )}
    </>
  );
}
