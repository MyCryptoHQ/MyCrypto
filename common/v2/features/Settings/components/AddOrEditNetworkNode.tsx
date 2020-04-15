import React, { useCallback, useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS, COLORS } from 'v2/theme';
import { Checkbox, DashboardPanel, InputField, NetworkSelectDropdown } from 'v2/components';
import { CustomNodeConfig, Network, NetworkId, NodeOptions, NodeType } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { DEFAULT_NETWORK, GITHUB_RELEASE_NOTES_URL, LET_ENCRYPT_URL } from 'v2/config';
import { NetworkUtils } from 'v2/services/Store/Network';
import { ProviderHandler } from 'v2/services/EthService/network';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

const AddToNetworkNodePanel = styled(DashboardPanel)`
  padding: 0 30px 15px;
`;

const BackButton = styled(Button)`
  margin-right: 16px;
`;

const Row = styled.div<{ hidden?: boolean }>`
  flex-direction: column;
  ${({ hidden }) => `display: ${hidden ? 'none' : 'flex'};`};

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: row;
    align-items: flex-start;
    padding-left: 40px;
  }
`;

const SubtitleRow = styled(Row)`
  margin-top: -25px;
  padding-bottom: 20px;
`;

const Column = styled.div<{ alignSelf?: string }>`
  flex: 1;

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    ${({ alignSelf }) => `align-self: ${alignSelf || 'auto'};`};

    &:not(:first-child) {
      padding-left: 25px;
    }

    &:not(:last-child) {
      padding-right: 25px;
    }
  }

  label {
    padding-left: 3px;
  }
`;

const AddressFieldset = styled.fieldset`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 9px;
    color: #163150;
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
  margin-top: 20px;
  button {
    text-transform: capitalize;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: 0;
  }
`;

const SNetworkSelectDropdown = styled(NetworkSelectDropdown)`
  margin-bottom: 15px;
`;

const SCheckbox = styled(Checkbox)`
  margin-bottom: 0;
  ${({ checked }) => checked && `margin-bottom: 20px;`};
  ${({ checked }) =>
    checked && `@media (min-width: ${BREAK_POINTS.SCREEN_SM}) {margin-bottom: 0;}`};
`;

const SError = styled.div`
  margin-top: 10px;
  color: ${COLORS.PASTEL_RED};
`;

const DeleteButton = styled(Button)`
  background-color: ${COLORS.PASTEL_RED};
  :hover {
    background-color: ${COLORS.ERROR_RED};
  }
`;

interface NetworkNodeFields {
  name: string;
  networkId: NetworkId;
  url: string;
  auth: boolean;
  username: string;
  password: string;
}

interface Props {
  networkId: NetworkId;
  editNode: CustomNodeConfig | undefined;
  toggleFlipped(): void;
  addNodeToNetwork(node: NodeOptions, network: Network | NetworkId): void;
  isNodeNameAvailable(networkId: NetworkId, nodeName: string, ignoreNames?: string[]): boolean;
  getNetworkById(networkId: NetworkId): Network;
  updateNode(node: NodeOptions, network: Network | NetworkId, nodeName: string): void;
  deleteNode(nodeName: string, network: Network | NetworkId): void;
}

export default function AddOrEditNetworkNode({
  networkId,
  toggleFlipped,
  addNodeToNetwork,
  isNodeNameAvailable,
  getNetworkById,
  editNode,
  updateNode,
  deleteNode
}: Props) {
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [editMode] = useState(!!editNode);
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

  const onDeleteNodeClick = useCallback(
    e => {
      e.preventDefault();

      deleteNode(editNode!.name, networkId);
      toggleFlipped();
    },
    [deleteNode, toggleFlipped]
  );

  const Schema = Yup.lazy((values: NetworkNodeFields) =>
    Yup.object().shape({
      name: Yup.string()
        .required(translateRaw('REQUIRED'))
        .test('check-name-available', 'Duplicated name, please change name!', name => {
          return isNodeNameAvailable(values.networkId, name, editNode ? [editNode.name] : []);
        }),
      networkId: Yup.string().required(translateRaw('REQUIRED')),
      url: Yup.string().required(translateRaw('REQUIRED')),
      auth: Yup.boolean().nullable(false),
      username: Yup.string().test('auth-required', translateRaw('REQUIRED'), username => {
        return values.auth ? !!username : true;
      }),
      password: Yup.string().test('auth-required', translateRaw('REQUIRED'), password => {
        return values.auth ? !!password : true;
      })
    })
  );

  return (
    <AddToNetworkNodePanel
      heading={
        <>
          <BackButton basic={true} onClick={toggleFlipped}>
            <img src={backArrowIcon} alt="Back" />
          </BackButton>
          {editMode ? translateRaw('CUSTOM_NODE_EDIT') : translateRaw('CUSTOM_NODE_ADD')}
        </>
      }
      padChildren={true}
    >
      <SubtitleRow>
        <Column>
          {(t => {
            const tSplit = t.split(/\$myCryptoRepo|\$letsEncrypt/);
            if (tSplit.length === 3) {
              return (
                <>
                  {tSplit[0]}
                  <a href={GITHUB_RELEASE_NOTES_URL} rel="noopener noreferrer" target="_blank">
                    {translateRaw('CUSTOM_NODE_SUBTITLE_REPO')}
                  </a>
                  {tSplit[1]}
                  <a href={LET_ENCRYPT_URL} rel="noopener noreferrer" target="_blank">
                    LetsEncrypt
                  </a>
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
          const { url, username, password, name, auth, networkId: selectedNetworkId } = values;

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
            const network = getNetworkById(selectedNetworkId);
            const provider = new ProviderHandler({ ...network, nodes: [node] }, false);
            await provider.getCurrentBlock();

            if (editNode) {
              updateNode(node, selectedNetworkId, editNode.name);
            } else {
              addNodeToNetwork(node, selectedNetworkId);
            }

            setIsConnectionError(false);
            toggleFlipped();
          } catch (e) {
            setIsConnectionError(true);
          } finally {
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
                  <Field
                    name="name"
                    render={({ field }: FieldProps<NetworkNodeFields>) => (
                      <InputField
                        {...field}
                        inputError={errors && errors.name}
                        placeholder={translateRaw('CUSTOM_NODE_FORM_NODE_NAME')}
                      />
                    )}
                  />
                </AddressFieldset>
              </Column>
              <Column>
                <AddressFieldset>
                  <Field
                    name="networkId"
                    render={({ field, form }: FieldProps<NetworkNodeFields>) => (
                      <SNetworkSelectDropdown
                        network={field.value}
                        onChange={e => form.setFieldValue(field.name, e)}
                        disabled={editMode}
                      />
                    )}
                  />
                </AddressFieldset>
              </Column>
            </Row>
            <Row>
              <Column>
                <AddressFieldset>
                  <label htmlFor="url">{translateRaw('CUSTOM_NODE_FORM_NODE_ADDRESS')}</label>
                  <Field
                    name="url"
                    render={({ field }: FieldProps<NetworkNodeFields>) => (
                      <InputField
                        inputError={errors && errors.url}
                        placeholder={translateRaw('CUSTOM_NODE_FORM_NODE_ADDRESS_PLACEHOLDER')}
                        {...field}
                      />
                    )}
                  />
                </AddressFieldset>
              </Column>
              <Column alignSelf="center">
                <Field
                  name="auth"
                  render={({ field, form }: FieldProps<NetworkNodeFields>) => (
                    <SCheckbox
                      {...field}
                      onChange={() => form.setFieldValue(field.name, !field.value)}
                      checked={field.value}
                      label={translateRaw('CUSTOM_NODE_FORM_AUTH_TOGGLE')}
                    />
                  )}
                />
              </Column>
            </Row>
            <Row hidden={!values.auth}>
              <Column>
                <AddressFieldset>
                  <label htmlFor="username">{translateRaw('CUSTOM_NODE_FORM_USERNAME')}</label>
                  <Field
                    name="username"
                    render={({ field }: FieldProps<NetworkNodeFields>) => (
                      <InputField
                        {...field}
                        inputError={errors && errors.username}
                        placeholder={translateRaw('CUSTOM_NODE_FORM_USERNAME_PLACEHOLDER')}
                      />
                    )}
                  />
                </AddressFieldset>
              </Column>
              <Column>
                <AddressFieldset>
                  <label htmlFor="password">{translateRaw('CUSTOM_NODE_FORM_PASSWORD')}</label>
                  <Field
                    name="password"
                    render={({ field }: FieldProps<NetworkNodeFields>) => (
                      <InputField
                        {...field}
                        inputError={errors && errors.password}
                        type="password"
                        placeholder={translateRaw('CUSTOM_NODE_FORM_PASSWORD')}
                      />
                    )}
                  />
                </AddressFieldset>
              </Column>
            </Row>
            <Row>
              <Column>
                <NetworkNodeFieldsButtons>
                  <Button type="submit" disabled={isSubmitting}>
                    {translateRaw('CUSTOM_NODE_SAVE_NODE')}
                  </Button>
                  {editMode && (
                    <DeleteButton type="button" onClick={onDeleteNodeClick}>
                      {translateRaw('CUSTOM_NODE_REMOVE_NODE')}
                    </DeleteButton>
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
