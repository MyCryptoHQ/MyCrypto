import React, { useEffect, useState, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  NetworkSelectDropdown,
  InputField,
  Dropdown,
  InlineErrorMsg,
  Button,
  AddressField
} from 'v2/components';
import {
  Contract,
  StoreAccount,
  ITxConfig,
  ExtendedContract,
  Network,
  IReceiverAddress
} from 'v2/types';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import { isValidETHAddress, isCreationAddress } from 'v2/services/EthService/validators';
import { getNetworkById, NetworkContext } from 'v2/services';

import ContractDropdownOption from './ContractDropdownOption';
import ContractDropdownValue from './ContractDropdownValue';
import GeneratedInteractionForm from './GeneratedInteractionForm';
import { CUSTOM_CONTRACT_ADDRESS } from '../constants';
import { ABIItem } from '../types';
import { getParsedQueryString } from '../utils';
import { isValidENSName } from 'v2/services/EthService';

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
  network: Network;
  contractAddress: string;
  addressOrDomainInput: string;
  resolvingDomain: boolean;
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
  handleAddressOrDomainChanged(value: string): void;
  handleAbiChanged(abi: string): void;
  handleCustomContractNameChanged(customContractName: string): void;
  updateNetworkContractOptions(): void;
  displayGeneratedForm(visible: boolean): void;
  handleInteractionFormSubmit(submitedFunction: ABIItem): any;
  goToNextStep(): void;
  handleInteractionFormWriteSubmit(submitedFunction: ABIItem): Promise<object>;
  handleAccountSelected(account: StoreAccount): void;
  handleSaveContractSubmit(): void;
  handleGasSelectorChange(payload: ITxConfig): void;
  handleDeleteContract(contractUuid: string): void;
}

const FormSchema = Yup.object().shape({
  address: Yup.object({
    value: Yup.string().test(
      'check-eth-address',
      translateRaw('TO_FIELD_ERROR'),
      value => isValidETHAddress(value) || isValidENSName(value)
    )
  }).required(translateRaw('REQUIRED'))
});

type CombinedProps = RouteComponentProps<{}> & Props;

function Interact(props: CombinedProps) {
  const {
    network,
    contractAddress,
    abi,
    contract,
    contracts,
    showGeneratedForm,
    addressOrDomainInput,
    resolvingDomain,
    handleNetworkSelected,
    handleContractSelected,
    handleAddressOrDomainChanged,
    handleAbiChanged,
    handleCustomContractNameChanged,
    updateNetworkContractOptions,
    displayGeneratedForm,
    handleInteractionFormSubmit,
    account,
    customContractName,
    handleAccountSelected,
    handleInteractionFormWriteSubmit,
    handleSaveContractSubmit,
    rawTransaction,
    handleGasSelectorChange,
    handleDeleteContract
  } = props;

  const [error, setError] = useState<string | undefined>(undefined);
  const [areFieldsPopulatedFromUrl, setAreFieldsPopulatedFromUrl] = useState(false);
  const [wasAbiEditedManually, setWasAbiEditedManually] = useState(false);
  const [wasContractInteracted, setWasContractInteracted] = useState(false);
  const [interactionDataFromURL, setInteractionDataFromURL] = useState<any>({});
  const { networks } = useContext(NetworkContext);
  const { networkIdFromUrl, addressFromUrl, functionFromUrl, inputsFromUrl } = getParsedQueryString(
    props.location.search
  );
  const networkAndAddressMatchURL =
    network.id === networkIdFromUrl && contractAddress === addressFromUrl;

  useEffect(() => {
    updateNetworkContractOptions();
    setWasContractInteracted(false);
  }, [network]);

  useEffect(() => {
    displayGeneratedForm(false);
    setWasContractInteracted(false);

    if (areFieldsPopulatedFromUrl && networkAndAddressMatchURL && !wasAbiEditedManually) {
      submitInteract();
      setInteractionDataFromURL({
        ...interactionDataFromURL,
        functionName: functionFromUrl,
        inputs: inputsFromUrl
      });
    }
  }, [abi]);

  useEffect(() => {
    // If contract network id doesn't match the selected network id, set contract to custom and keep the address from the URL.
    if (contract && contract.networkId !== network.id) {
      handleAddressOrDomainChanged(contractAddress);
    }

    setError(undefined);
  }, [contract]);

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
      displayGeneratedForm(true);
      setWasContractInteracted(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const tryAbiParse = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (getNetworkById(networkIdFromUrl, networks)) {
      handleNetworkSelected(networkIdFromUrl);
    } else if (networkIdFromUrl) {
      setError(translateRaw('INTERACT_ERROR_INVALID_NETWORK'));
    }
  }, []);

  useEffect(() => {
    if (
      !getNetworkById(networkIdFromUrl, networks) ||
      areFieldsPopulatedFromUrl ||
      contracts.length === 0 ||
      !addressFromUrl
    ) {
      return;
    }

    if (addressFromUrl) {
      handleAddressOrDomainChanged(addressFromUrl);
    }
    setAreFieldsPopulatedFromUrl(true);
  }, [contracts]);

  const customEditingMode = contract && contract.address === CUSTOM_CONTRACT_ADDRESS;

  const initialFormikValues: { address: IReceiverAddress } = {
    address: {
      display: '',
      value: ''
    }
  };

  return (
    <Formik
      initialValues={initialFormikValues}
      validationSchema={FormSchema}
      // Hack as we don't really use Formik for this flow
      onSubmit={() => undefined}
      render={({ errors, touched, setFieldValue }) => {
        const isValid =
          Object.values(errors).filter(e => e !== undefined && e.value !== undefined).length === 0;
        return (
          <>
            <NetworkSelectorWrapper>
              <NetworkSelectDropdown
                network={network.id}
                onChange={networkId => {
                  handleNetworkSelected(networkId);
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
                    onChange={option => {
                      if (option.address !== 'custom') {
                        setFieldValue('address', {
                          display: option.address,
                          value: option.address
                        });
                      } else {
                        setFieldValue('address', initialFormikValues.address);
                      }
                      handleContractSelected(option);
                    }}
                    optionComponent={ContractDropdownOption}
                    valueComponent={ContractDropdownValue}
                    searchable={true}
                  />
                </DropdownContainer>
              </FieldWrapper>
              <Separator />
              <FieldWrapper>
                <label htmlFor="address" className="input-group-header">
                  {translateRaw('CONTRACT_TITLE')}
                </label>
                <InputWrapper>
                  <AddressField
                    fieldName="address"
                    error={errors && errors.address && errors.address.value}
                    network={network}
                    placeholder={translateRaw('CONTRACT_ADDRESS_PLACEHOLDER')}
                    isLoading={resolvingDomain}
                    touched={touched}
                    onChange={({ target: { value } }) => handleAddressOrDomainChanged(value)}
                    isError={!isValid}
                  />
                </InputWrapper>
                {contractAddress &&
                  (isValidETHAddress(contractAddress) || isCreationAddress(contractAddress)) &&
                  !isValidETHAddress(addressOrDomainInput) && (
                    <div>
                      {translateRaw('INTERACT_RESOLVED_ADDRESS')} {contractAddress}
                    </div>
                  )}
              </FieldWrapper>
            </ContractSelectionWrapper>
            <FieldWrapper>
              <InputWrapper onClick={() => setWasContractInteracted(false)}>
                <InputField
                  label={translateRaw('CONTRACT_JSON')}
                  value={abi}
                  placeholder={`[{"type":"constructor","inputs":[{"name":"param1","type":"uint256","indexed":true}],"name":"Event"},{"type":"function","inputs":[{"name":"a","type":"uint256"}],"name":"foo","outputs":[]}]`}
                  onChange={({ target: { value } }) => {
                    handleAbiChanged(value);
                    setWasAbiEditedManually(true);
                  }}
                  textarea={true}
                  resizableTextArea={true}
                  height={'108px'}
                  maxHeight={wasContractInteracted ? '108px' : 'none'}
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
                </>
              )}
              {error && (
                <ErrorWrapper>
                  <InlineErrorMsg>{error}</InlineErrorMsg>
                </ErrorWrapper>
              )}
            </FieldWrapper>

            <ButtonWrapper>
              <Button disabled={wasContractInteracted} onClick={submitInteract}>
                {translateRaw('INTERACT_WITH_CONTRACT')}
              </Button>
            </ButtonWrapper>
            {showGeneratedForm && abi && (
              <GeneratedInteractionForm
                abi={tryAbiParse(abi)}
                handleInteractionFormSubmit={handleInteractionFormSubmit}
                account={account}
                handleAccountSelected={handleAccountSelected}
                handleInteractionFormWriteSubmit={handleInteractionFormWriteSubmit}
                network={network}
                rawTransaction={rawTransaction}
                handleGasSelectorChange={handleGasSelectorChange}
                contractAddress={contractAddress}
                interactionDataFromURL={interactionDataFromURL}
              />
            )}
          </>
        );
      }}
    />
  );
}

export default withRouter(Interact);
