import { useEffect, useState } from 'react';

import { Formik } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { object, string } from 'yup';

import {
  Button,
  ContractLookupField,
  Icon,
  InlineMessage,
  InputField,
  LinkApp,
  NetworkSelector
} from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { getNetworkById, isValidENSName, isValidETHAddress, useNetworks } from '@services';
import { BREAK_POINTS, COLORS } from '@theme';
import { translateRaw } from '@translations';
import {
  Contract,
  ExtendedContract,
  IReceiverAddress,
  ISimpleTxForm,
  Network,
  StoreAccount,
  TAddress
} from '@types';
import { isSameAddress } from '@utils';

import { CUSTOM_CONTRACT_ADDRESS } from '../constants';
import { ABIItem } from '../types';
import { getParsedQueryString } from '../utils';
import GeneratedInteractionForm from './GeneratedInteractionForm';

const { BLUE_BRIGHT, WHITE, BLUE_LIGHT } = COLORS;
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

const ErrorWrapper = styled.div`
  margin-bottom: 12px;
`;

const ContractSelectLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteLabel = styled(Label)`
  color: ${BLUE_BRIGHT};
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
  nonce: string;
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
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
  handleInteractionFormWriteSubmit(submitedFunction: ABIItem): Promise<TObject>;
  handleAccountSelected(account: StoreAccount): void;
  handleSaveContractSubmit(): void;
  handleGasSelectorChange(
    payload: Partial<Pick<ISimpleTxForm, 'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'>>
  ): void;
  handleDeleteContract(contractUuid: string): void;
  handleGasLimitChange(payload: string): void;
  handleNonceChange(payload: string): void;
}

const FormSchema = object().shape({
  address: object({
    value: string().test(
      'check-eth-address',
      translateRaw('TO_FIELD_ERROR'),
      (value) => isValidETHAddress(value) || isValidENSName(value)
    )
  }).required(translateRaw('REQUIRED'))
});

type CombinedProps = RouteComponentProps & Props;

function Interact(props: CombinedProps) {
  const {
    network,
    contractAddress,
    abi,
    contract,
    contracts,
    showGeneratedForm,
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
    nonce,
    gasLimit,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    handleGasSelectorChange,
    handleDeleteContract,
    handleGasLimitChange,
    handleNonceChange
  } = props;

  const [error, setError] = useState<string | undefined>(undefined);
  const [isResolvingName, setIsResolvingDomain] = useState(false);
  const [areFieldsPopulatedFromUrl, setAreFieldsPopulatedFromUrl] = useState(false);
  const [wasAbiEditedManually, setWasAbiEditedManually] = useState(false);
  const [wasContractInteracted, setWasContractInteracted] = useState(false);
  const [interactionDataFromURL, setInteractionDataFromURL] = useState<any>({});
  const { networks } = useNetworks();
  const { networkIdFromUrl, addressFromUrl, functionFromUrl, inputsFromUrl } = getParsedQueryString(
    props.location.search
  );
  const networkAndAddressMatchURL =
    network.id === networkIdFromUrl &&
    isSameAddress(contractAddress as TAddress, addressFromUrl as TAddress);

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

  const customEditingMode = contract && isSameAddress(contract.address, CUSTOM_CONTRACT_ADDRESS);

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
    >
      {({ values, errors, touched, setFieldValue, setFieldError, setFieldTouched, resetForm }) => {
        /* eslint-disable react-hooks/rules-of-hooks */
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

        useEffect(() => {
          // If contract network id doesn't match the selected network id, set contract to custom and keep the address from the URL.
          if (contract && contract.networkId !== network.id) {
            handleAddressOrDomainChanged(contractAddress);
          }

          if (contract && contract.address !== CUSTOM_CONTRACT_ADDRESS) {
            setFieldValue('address', {
              display: contract.name,
              value: contract.address
            });
          }

          setError(undefined);
        }, [contract]);
        /* eslint-enable react-hooks/rules-of-hooks */

        return (
          <>
            <NetworkSelectorWrapper>
              <NetworkSelector
                network={network.id}
                onChange={(networkId) => {
                  handleNetworkSelected(networkId);
                  resetForm();
                }}
              />
            </NetworkSelectorWrapper>
            <ContractSelectionWrapper>
              <FieldWrapper>
                <ContractSelectLabelWrapper>
                  <label htmlFor="address" className="input-group-header">
                    {translateRaw('CONTRACT_TITLE')}
                  </label>
                  {contract && contract.isCustom && (
                    <DeleteLabel onClick={() => handleDeleteContract(contract.uuid)}>
                      {translateRaw('ACTION_15')}
                    </DeleteLabel>
                  )}
                </ContractSelectLabelWrapper>
                <ContractLookupField
                  name="address"
                  contracts={contracts}
                  error={errors && touched.address && errors.address && errors.address.value}
                  network={network}
                  isResolvingName={isResolvingName}
                  setIsResolvingDomain={setIsResolvingDomain}
                  onSelect={(option) => {
                    // @ts-expect-error: Contract vs IReceiverAddress. @todo: this is a bug.
                    handleContractSelected(option);

                    handleAddressOrDomainChanged(option.value);
                  }}
                  onChange={(address) => handleAddressOrDomainChanged(address)}
                  value={values.address}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                />
              </FieldWrapper>
            </ContractSelectionWrapper>
            <FieldWrapper>
              <InputWrapper onClick={() => setWasContractInteracted(false)}>
                <InputField
                  name="abi"
                  label={
                    <>
                      {translateRaw('CONTRACT_JSON')}
                      <LinkApp
                        href={getKBHelpArticle(KB_HELP_ARTICLE.WHAT_IS_CONTRACT_ABI)}
                        isExternal={true}
                      >
                        <Icon width="16px" type="questionBlack" />
                      </LinkApp>
                    </>
                  }
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
                      <Button
                        color={BLUE_LIGHT}
                        large={false}
                        secondary={true}
                        onClick={saveContract}
                      >
                        {translateRaw('SAVE_CONTRACT')}
                      </Button>
                    </SaveButtonWrapper>
                  </SaveContractWrapper>
                </>
              )}
              {error && (
                <ErrorWrapper>
                  <InlineMessage>{error}</InlineMessage>
                </ErrorWrapper>
              )}
            </FieldWrapper>

            <ButtonWrapper>
              <Button
                color={WHITE}
                disabled={wasContractInteracted}
                onClick={submitInteract}
                fullwidth={true}
              >
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
                handleGasSelectorChange={handleGasSelectorChange}
                contractAddress={contractAddress}
                interactionDataFromURL={interactionDataFromURL}
                nonce={nonce}
                gasLimit={gasLimit}
                gasPrice={gasPrice}
                maxFeePerGas={maxFeePerGas}
                maxPriorityFeePerGas={maxPriorityFeePerGas}
                handleNonceChange={handleNonceChange}
                handleGasLimitChange={handleGasLimitChange}
              />
            )}
          </>
        );
      }}
    </Formik>
  );
}

export default withRouter(Interact);
