import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Identicon, Button } from '@mycrypto/ui';

import { NetworkSelectDropdown, InputField, Dropdown } from 'v2/components';

import { BREAK_POINTS } from 'v2/theme';
import { ContractContext, getNetworkById } from 'v2/services/Store';
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
  setContract(contract: Contract | undefined): void;
  setNetworkId(networkId: string): void;
  setContractAddress(address: string): void;
  setAbi(abi: string): void;
  goToNextStep(): void;
}

export default function Interact(props: Props) {
  const {
    goToNextStep,
    networkId,
    setNetworkId,
    contractAddress,
    setContractAddress,
    abi,
    setAbi,
    contract,
    setContract
  } = props;

  const customContract: Contract = {
    name: 'Custom',
    networkId,
    address: 'custom',
    abi: ''
  };

  const [contracts, setContracts] = useState<Contract[]>([]);

  const { getContractsByIds } = useContext(ContractContext);

  const handleContractAddressChanged = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget;
    setContractAddress(value);
  };

  const handleAbiChanged = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget;
    setAbi(value);
  };

  const handleContractChange = (selectedContract: Contract) => {
    setContract(selectedContract);

    if (selectedContract.address === 'custom') {
      setContractAddress('');
    } else {
      setContractAddress(selectedContract.address);
    }

    setAbi(selectedContract.abi);
  };

  const clearFields = () => {
    setContract(undefined);
    setContractAddress('');
    setAbi('');
  };

  useEffect(() => {
    const contractIds = getNetworkById(networkId)!.contracts;
    const networkContracts = getContractsByIds(contractIds);
    setContracts([customContract, ...networkContracts]);
  }, [networkId]);

  return (
    <>
      <NetworkSelectorWrapper>
        <NetworkSelectDropdown
          network={networkId}
          onChange={network => {
            clearFields();
            setNetworkId(network);
          }}
        />
      </NetworkSelectorWrapper>
      <ContractSelectionWrapper>
        <FieldWrapper>
          <Label>Select Existing Contract</Label>
          <Dropdown
            value={contract}
            options={contracts}
            onChange={handleContractChange}
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
              onChange={handleContractAddressChanged}
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
            onChange={handleAbiChanged}
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
