import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Identicon, Button } from '@mycrypto/ui';

import { NetworkSelectDropdown, InputField, Dropdown, InlineErrorMsg } from 'v2/components';
import { NetworkId, Contract, StoreAccount } from 'v2/types';

import ContractDropdownOption from './ContractDropdownOption';
import ContractDropdownValue from './ContractDropdownValue';
import GeneratedInteractionForm from './GeneratedInteractionForm';
import { CUSTOM_CONTRACT_ADDRESS } from '../constants';
import { ABIItem } from '../types';

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
    font-size: 16px;
  }
`;

const Separator = styled.div`
  width: 22px;
`;

const Label = styled.p`
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
`;

const SaveButtonWrapper = styled.div`
  width: 300px;
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-left: 8px;
  justify-content: flex-end;
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

interface Props {
  networkId: NetworkId;
  contractAddress: string;
  abi: string;
  contract: Contract;
  contracts: Contract[];
  showGeneratedForm: boolean;
  account: StoreAccount;
  customContractName: string;
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
    handleSaveContractSubmit
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

  const isCustomContract = contract && contract.address === CUSTOM_CONTRACT_ADDRESS;

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
          <Label>Select Existing Contract</Label>
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
              label={'Contract Address'}
              value={contractAddress}
              placeholder="ensdomain.eth or Ox4bbeEB066eDfk..."
              onChange={({ target: { value } }) => handleContractAddressChanged(value)}
            />
            {contractAddress && <IdenticonIcon address={contractAddress} />}
          </InputWrapper>
        </FieldWrapper>
      </ContractSelectionWrapper>
      <FieldWrapper>
        <InputWrapper>
          <InputField
            label={'ABI / JSON Interface'}
            value={abi}
            placeholder={`[{"type":"constructor","inputs":[{"name":"param1","type":"uint256","indexed":true}],"name":"Event"},{"type":"function","inputs":[{"name":"a","type":"uint256"}],"name":"foo","outputs":[]}]`}
            onChange={({ target: { value } }) => handleAbiChanged(value)}
            textarea={true}
            resizableTextArea={true}
            height={'108px'}
            disabled={!isCustomContract}
          />
        </InputWrapper>
        {isCustomContract && (
          <>
            <SaveContractWrapper>
              <InputField
                label={'Contract name'}
                value={customContractName}
                placeholder="Custom contract name"
                onChange={({ target: { value } }) => handleCustomContractNameChanged(value)}
              />
              <SaveButtonWrapper>
                <Button large={false} secondary={true} onClick={saveContract}>
                  Save contract
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
        <Button onClick={submitInteract}>Interact with Contract</Button>
      </ButtonWrapper>
      {showGeneratedForm && abi && (
        <GeneratedInteractionForm
          abi={JSON.parse(abi)}
          handleInteractionFormSubmit={handleInteractionFormSubmit}
          account={account}
          handleAccountSelected={handleAccountSelected}
          handleInteractionFormWriteSubmit={handleInteractionFormWriteSubmit}
          networkId={networkId}
        />
      )}
    </>
  );
}
