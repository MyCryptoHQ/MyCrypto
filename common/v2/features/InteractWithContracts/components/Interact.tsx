import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Identicon, Button } from '@mycrypto/ui';

import { NetworkSelectDropdown, InputField, Dropdown } from 'v2/components';

import { BREAK_POINTS } from 'v2/theme';
import { NetworkId, Contract } from 'v2/types';
import ContractDropdownOption from './ContractDropdownOption';
import ContractDropdownValue from './ContractDropdownValue';

const NetworkSelectorWrapper = styled.div`
  margin-bottom: 12px;
  label {
    font-weight: normal;
  }
`;

const ContractSelectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
  }
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
  justify-content: center;
`;

interface Props {
  networkId: NetworkId;
  contractAddress: string;
  abi: string;
  contract: Contract;
  contracts: Contract[];
  handleContractSelected(contract: Contract | undefined): void;
  handleNetworkSelected(networkId: string): void;
  handleContractAddressChanged(address: string): void;
  handleAbiChanged(abi: string): void;
  updateNetworkContractOptions(networkId: NetworkId): void;
  goToNextStep(): void;
}

export default function Interact(props: Props) {
  const {
    goToNextStep,
    networkId,
    contractAddress,
    abi,
    contract,
    contracts,
    handleNetworkSelected,
    handleContractSelected,
    handleContractAddressChanged,
    handleAbiChanged,
    updateNetworkContractOptions
  } = props;

  useEffect(() => {
    updateNetworkContractOptions(networkId);
  }, [networkId]);

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
          <Dropdown
            value={contract}
            options={contracts}
            onChange={handleContractSelected}
            optionComponent={ContractDropdownOption}
            valueComponent={ContractDropdownValue}
            searchable={true}
          />
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
          />
        </InputWrapper>
      </FieldWrapper>
      <ButtonWrapper>
        <Button onClick={goToNextStep}>Access</Button>
      </ButtonWrapper>
    </>
  );
}
