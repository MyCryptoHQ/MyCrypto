import { MouseEventHandler, useCallback, useState } from 'react';

import { Tooltip, Button as UIButton } from '@mycrypto/ui';
import { DEFAULT_ETH } from '@mycrypto/wallets';
import { Field, FieldProps, Form, Formik } from 'formik';
import styled from 'styled-components';
import { boolean, lazy, object, string } from 'yup';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import {
  Button,
  Checkbox,
  DashboardPanel,
  InputField,
  LinkApp,
  NetworkSelector
} from '@components';
import {
  DEFAULT_NETWORK,
  ETHPLORER_URL,
  EXT_URLS,
  GITHUB_RELEASE_NOTES_URL,
  LETS_ENCRYPT_URL
} from '@config';
import { useAssets } from '@services';
import { ProviderHandler } from '@services/EthService/network';
import { NetworkUtils, useNetworks } from '@services/Store/Network';
import { canDeleteNode as canDeleteNodeSelector, useSelector } from '@store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Trans, translateRaw } from '@translations';
import {
  CustomNodeConfig,
  ExtendedAsset,
  Network,
  NetworkId,
  NodeType,
  TTicker,
  WalletId
} from '@types';
import { generateAssetUUID, makeExplorer } from '@utils';

const AddToNetworkNodePanel = styled(DashboardPanel)`
  padding: 0 ${SPACING.MD} ${SPACING.SM};
`;

const BackButton = styled(UIButton)`
  margin-right: ${SPACING.BASE};
`;

const Row = styled.div<{ hidden?: boolean }>`
  flex-direction: column;
  ${({ hidden }) => `display: ${hidden ? 'none' : 'flex'};`};

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: row;
    align-items: flex-start;
    padding-left: ${SPACING.LG};
  }
`;

const SubtitleRow = styled(Row)`
  margin-top: -${SPACING.BASE};
  padding-bottom: ${SPACING.BASE};
`;

const Column = styled.div<{ alignSelf?: string }>`
  flex: 1;

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    ${({ alignSelf = 'auto' }) => `align-self: ${alignSelf};`};

    &:not(:first-child) {
      padding-left: ${SPACING.BASE};
    }

    &:not(:last-child) {
      padding-right: ${SPACING.BASE};
    }
  }

  label {
    padding-left: ${SPACING.XS};
  }
`;

const AddressFieldset = styled.fieldset`
  margin-bottom: ${SPACING.SM};

  label {
    display: block;
    margin-bottom: ${SPACING.SM};
    color: ${COLORS.BLUE_DARK_SLATE};
  }
  input,
  textarea {
    display: block;
    width: 100%;
  }
`;

const NetworkNodeFieldsButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${SPACING.BASE};
  button {
    text-transform: capitalize;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: 0;
  }
`;

const SNetworkSelector = styled(NetworkSelector)`
  margin-bottom: ${SPACING.SM};
`;

const SCheckbox = styled(Checkbox)`
  margin-bottom: 0;
  ${({ checked }) => checked && `margin-bottom: ${SPACING.BASE};`};
  ${({ checked }) =>
    checked && `@media (min-width: ${BREAK_POINTS.SCREEN_SM}) {margin-bottom: 0;}`};
`;

const SError = styled.div`
  margin-top: ${SPACING.SM};
  color: ${COLORS.PASTEL_RED};
`;

const DeleteButton = styled(Button)<{ disabled: boolean }>`
  ${(props) =>
    !props.disabled &&
    `
    background-color: ${COLORS.PASTEL_RED};


  :hover {
    background-color: ${COLORS.ERROR_RED};
  }
  `}
`;

const ReferralLink = styled.div`
  margin-bottom: ${SPACING.BASE};

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    margin-bottom: 0px;
    margin-top: ${SPACING.BASE};
  }
`;

interface NetworkNodeFields {
  name: string;
  networkId: NetworkId;
  url: string;
  auth: boolean;
  username: string;
  password: string;

  // CUSTOM NETWORK
  networkName?: string;
  baseUnit?: string;
  chainId?: string;
}

interface Props {
  networkId: NetworkId;
  editNode: CustomNodeConfig | undefined;
  isAddingCustomNetwork: boolean;
  onComplete(): void;
}

export default function AddOrEditNetworkNode({
  networkId,
  isAddingCustomNetwork,
  onComplete,
  editNode
}: Props) {
  const {
    addNetwork,
    addNodeToNetwork,
    isNodeNameAvailable,
    getNetworkById,
    updateNode,
    deleteNodeOrNetwork
  } = useNetworks();
  const { createAsset } = useAssets();
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [editMode] = useState(!!editNode);
  const canDeleteNode = useSelector(canDeleteNodeSelector(networkId)) && editMode;
  const initialState = useCallback((): NetworkNodeFields => {
    if (editNode) {
      return {
        networkId,
        name: editNode.service,
        url: editNode.url,
        auth: !!editNode.auth,
        username: editNode.auth ? editNode.auth.username : '',
        password: editNode.auth ? editNode.auth.password : ''
      };
    }

    return {
      name: '',
      networkId: networkId || DEFAULT_NETWORK,
      url: '',
      auth: false,
      username: '',
      password: ''
    };
  }, []);

  const onDeleteNodeClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    deleteNodeOrNetwork(networkId, editNode!.name);

    onComplete();
  };

  const Schema = lazy((values: NetworkNodeFields) =>
    object().shape({
      name: string()
        .required(translateRaw('REQUIRED'))
        .test('check-name-available', 'Duplicated name, please change name!', (name) => {
          return isNodeNameAvailable(values.networkId, name, editNode ? [editNode.name] : []);
        }),
      networkId: string().required(translateRaw('REQUIRED')),
      url: string().required(translateRaw('REQUIRED')),
      auth: boolean().nullable(false),
      username: string().test('auth-required', translateRaw('REQUIRED'), (username) => {
        return values.auth ? !!username : true;
      }),
      password: string().test('auth-required', translateRaw('REQUIRED'), (password) => {
        return values.auth ? !!password : true;
      })
    })
  );

  return (
    <AddToNetworkNodePanel
      heading={
        <>
          <BackButton basic={true} onClick={onComplete}>
            <img src={backArrowIcon} alt="Back" />
          </BackButton>
          {editMode ? translateRaw('CUSTOM_NODE_EDIT') : translateRaw('CUSTOM_NODE_ADD')}
        </>
      }
      padChildren={true}
    >
      <SubtitleRow>
        <Column>
          {((t) => {
            const tSplit = t.split(/\$myCryptoRepo|\$letsEncrypt/);
            if (tSplit.length === 3) {
              return (
                <>
                  {tSplit[0]}
                  <LinkApp href={GITHUB_RELEASE_NOTES_URL} isExternal={true}>
                    {translateRaw('CUSTOM_NODE_SUBTITLE_REPO')}
                  </LinkApp>
                  {tSplit[1]}
                  <LinkApp href={LETS_ENCRYPT_URL} isExternal={true}>
                    LetsEncrypt
                  </LinkApp>
                  {tSplit[2]}
                </>
              );
            }
            return t;
          })(translateRaw('CUSTOM_NODE_SUBTITLE'))}
        </Column>
      </SubtitleRow>
      <Formik
        validationSchema={Schema}
        initialValues={initialState()}
        onSubmit={async (values: NetworkNodeFields, { setSubmitting }) => {
          const {
            url,
            username,
            password,
            name,
            auth,
            networkId: formSelectedNetworkId,
            networkName,
            chainId,
            baseUnit
          } = values;

          const selectedNetworkId = isAddingCustomNetwork
            ? (networkName! as NetworkId)
            : formSelectedNetworkId;

          const node = Object.assign(
            {
              url,
              service: name,
              name: NetworkUtils.makeNodeName(selectedNetworkId, name),
              isCustom: true,
              type: NodeType.MYC_CUSTOM
            },
            auth ? { auth: { username, password } } : {}
          ) as CustomNodeConfig;

          try {
            const network: Network = !isAddingCustomNetwork
              ? getNetworkById(selectedNetworkId)
              : {
                  id: selectedNetworkId,
                  name: networkName!,
                  chainId: parseInt(chainId!, 10),
                  baseUnit: baseUnit as TTicker,
                  baseAsset: generateAssetUUID(chainId!),
                  isCustom: true,
                  nodes: [node],
                  dPaths: {
                    [WalletId.TREZOR]: DEFAULT_ETH,
                    [WalletId.LEDGER_NANO_S]: DEFAULT_ETH,
                    default: DEFAULT_ETH
                  },
                  gasPriceSettings: {
                    min: 1,
                    max: 100,
                    initial: 1
                  },
                  shouldEstimateGasPrice: false,
                  color: undefined,
                  selectedNode: node.name,
                  blockExplorer: makeExplorer({
                    name: networkName!,
                    origin: ETHPLORER_URL
                  })
                };
            const provider = new ProviderHandler({ ...network, nodes: [node] }, false);
            await provider.getLatestBlockNumber();

            if (isAddingCustomNetwork) {
              const baseAsset: ExtendedAsset = {
                uuid: network.baseAsset,
                name: network.baseUnit,
                ticker: network.baseUnit,
                type: 'base',
                networkId: network.id,
                isCustom: true
              };
              createAsset(baseAsset);
              addNetwork(network);
            } else if (editNode) {
              updateNode(node, selectedNetworkId, editNode.name);
            } else {
              addNodeToNetwork(node, selectedNetworkId);
            }

            setIsConnectionError(false);
            onComplete();
          } catch (e) {
            console.error(e);
            setIsConnectionError(true);
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting, errors }) => (
          <Form>
            <Row>
              <Column>
                <AddressFieldset>
                  <label htmlFor="name">{translateRaw('CUSTOM_NODE_FORM_NODE_NAME')}</label>
                  <Field name="name">
                    {({ field }: FieldProps<string>) => (
                      <InputField
                        {...field}
                        inputError={errors && errors.name}
                        placeholder={translateRaw('CUSTOM_NODE_FORM_NODE_NAME')}
                      />
                    )}
                  </Field>
                </AddressFieldset>
              </Column>
              {!isAddingCustomNetwork && (
                <Column>
                  <AddressFieldset>
                    <Field name="networkId">
                      {({ field, form }: FieldProps<NetworkId>) => (
                        <SNetworkSelector
                          network={field.value}
                          onChange={(e) => form.setFieldValue(field.name, e)}
                          disabled={editMode}
                        />
                      )}
                    </Field>
                  </AddressFieldset>
                </Column>
              )}
            </Row>
            {isAddingCustomNetwork && (
              <Row>
                <Column>
                  <AddressFieldset>
                    <label htmlFor="networkName">
                      {translateRaw('CUSTOM_NODE_FORM_NETWORK_NAME')}
                    </label>
                    <Field name="networkName">
                      {({ field }: FieldProps<string>) => (
                        <InputField
                          {...field}
                          inputError={errors && errors.networkName}
                          placeholder={translateRaw('CUSTOM_NODE_FORM_NETWORK_NAME_PLACEHOLDER')}
                        />
                      )}
                    </Field>
                  </AddressFieldset>
                </Column>
                <Column>
                  <AddressFieldset>
                    <label htmlFor="baseUnit"> {translateRaw('CUSTOM_NODE_FORM_BASE_UNIT')}</label>
                    <Field name="baseUnit">
                      {({ field }: FieldProps<string>) => (
                        <InputField
                          {...field}
                          inputError={errors && errors.baseUnit}
                          placeholder={translateRaw('BASE_UNIT')}
                        />
                      )}
                    </Field>
                  </AddressFieldset>
                </Column>
                <Column>
                  <AddressFieldset>
                    <label htmlFor="chainId">{translateRaw('CUSTOM_NODE_FORM_CHAIN_ID')}</label>
                    <Field name="chainId">
                      {({ field }: FieldProps<string>) => (
                        <InputField
                          {...field}
                          inputError={errors && errors.chainId}
                          placeholder={translateRaw('CUSTOM_NODE_FORM_CHAIN_ID_PLACEHOLDER')}
                        />
                      )}
                    </Field>
                  </AddressFieldset>
                </Column>
              </Row>
            )}
            <Row>
              <Column>
                <AddressFieldset>
                  <label htmlFor="url">{translateRaw('CUSTOM_NODE_FORM_NODE_ADDRESS')}</label>
                  <Field name="url">
                    {({ field }: FieldProps<string>) => (
                      <InputField
                        inputError={errors && errors.url}
                        placeholder={translateRaw('CUSTOM_NODE_FORM_NODE_ADDRESS_PLACEHOLDER')}
                        {...field}
                      />
                    )}
                  </Field>
                </AddressFieldset>
              </Column>
              <Column alignSelf="center">
                <Field name="auth">
                  {({ field, form }: FieldProps<boolean>) => (
                    <SCheckbox
                      {...field}
                      onChange={() => form.setFieldValue(field.name, !field.value)}
                      checked={field.value}
                      label={translateRaw('CUSTOM_NODE_FORM_AUTH_TOGGLE')}
                    />
                  )}
                </Field>
              </Column>
            </Row>
            <Row hidden={!values.auth}>
              <Column>
                <AddressFieldset>
                  <label htmlFor="username">{translateRaw('CUSTOM_NODE_FORM_USERNAME')}</label>
                  <Field name="username">
                    {({ field }: FieldProps<string>) => (
                      <InputField
                        {...field}
                        inputError={errors && errors.username}
                        placeholder={translateRaw('CUSTOM_NODE_FORM_USERNAME_PLACEHOLDER')}
                      />
                    )}
                  </Field>
                </AddressFieldset>
              </Column>
              <Column>
                <AddressFieldset>
                  <label htmlFor="password">{translateRaw('CUSTOM_NODE_FORM_PASSWORD')}</label>
                  <Field name="password">
                    {({ field }: FieldProps<string>) => (
                      <InputField
                        {...field}
                        inputError={errors && errors.password}
                        type="password"
                        placeholder={translateRaw('CUSTOM_NODE_FORM_PASSWORD')}
                      />
                    )}
                  </Field>
                </AddressFieldset>
              </Column>
            </Row>
            <Row>
              <ReferralLink>
                <Trans
                  id="CUSTOM_NODE_QUICKNODE_LINK"
                  variables={{
                    $link: () => (
                      <LinkApp href={EXT_URLS.QUICKNODE_REFERRAL.url} isExternal={true}>
                        {translateRaw('CUSTOM_NODE_QUICKNODE_TEXT')}
                      </LinkApp>
                    )
                  }}
                />
              </ReferralLink>
            </Row>
            <Row>
              <Column>
                <NetworkNodeFieldsButtons>
                  <Button type="submit" disabled={isSubmitting}>
                    {translateRaw('CUSTOM_NODE_SAVE_NODE')}
                  </Button>
                  {editMode && (
                    <Tooltip tooltip={translateRaw('DELETE_NETWORK_TOOLTIP')}>
                      <DeleteButton
                        type="button"
                        onClick={onDeleteNodeClick}
                        disabled={!canDeleteNode}
                        data-testid="deleteButton"
                      >
                        {translateRaw('CUSTOM_NODE_REMOVE_NODE')}
                      </DeleteButton>
                    </Tooltip>
                  )}
                </NetworkNodeFieldsButtons>
              </Column>
            </Row>
            <Row hidden={!isConnectionError}>
              <Column>
                <SError>{translateRaw('CUSTOM_NODE_ERROR_CONNECTION')}</SError>
              </Column>
            </Row>
          </Form>
        )}
      </Formik>
    </AddToNetworkNodePanel>
  );
}
