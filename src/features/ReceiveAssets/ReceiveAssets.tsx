import React, { useContext, useState } from 'react';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { Copyable, Heading, Input, Tooltip } from '@mycrypto/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import {
  buildEIP681EtherRequest,
  buildEIP681TokenRequest
} from '@services/EthService/utils/formatters';
import { ContentPanel, QRCode, AccountDropdown, AssetSelector } from '@components';
import { AssetContext, getNetworkById, StoreContext } from '@services/Store';
import { isValidAmount, sanitizeDecimalSeparator, noOp } from '@utils';
import { IAccount as IIAccount, StoreAccount } from '@types';
import { ROUTE_PATHS } from '@config';
import translate, { translateRaw } from '@translations';
import questionToolTip from '@assets/images/icn-question.svg';

// Legacy
import receiveIcon from '@assets/images/icn-receive.svg';

const isAssetToken = (tokenType: string) => {
  return tokenType !== 'base';
};

const QRDisplay = styled.div`
  margin: auto;
  width: 60%;
`;

const SLabel = styled.label`
  margin-bottom: 8px;
  color: #333333;
  font-weight: normal;
`;

const Fieldset = styled.fieldset`
  margin-bottom: 15px;
`;

const FieldsetBox = styled.div`
  padding: 12px 0;
  background: #f6f8fa;
  text-align: center;
`;

const AssetFields = styled.div`
  margin-bottom: 15px;
  align-items: center;
`;

const Divider = styled.div`
  height: 1px;
  margin: 30px 0;
  background: #e3edff;
`;

const FullWidthInput = styled(Input)`
  width: 100%;
`;

const Amount = styled.div`
  width: 100%;
`;

const Asset = styled.div`
  margin-top: 15px;
  width: 100%;

  .select-container {
    transition: box-shadow 0.12s;
    height: 54px;
  }

  .is-focused {
    border: none;
    outline: none;
    box-shadow: 0 0 0 0.25em rgba(0, 122, 153, 0.65);
  }
  .Select-menu-outer {
    max-height: 410px;
    border: none;
    box-shadow: 0 0 0 0.18em rgba(0, 122, 153, 0.65);
    .Select-menu {
      max-height: 400px;
    }
  }
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CodeHeading = styled(Heading)`
  margin-top: 8px;
`;

const ErrorMessage = styled.span`
  color: red;
  margin-top: 15px;
  display: block;
`;

export function ReceiveAssets({ history }: RouteComponentProps<{}>) {
  const { accounts, networks } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const [networkId, setNetworkId] = useState(accounts[0].networkId);
  const network = getNetworkById(networkId, networks);
  const filteredAssets = network
    ? assets
        .filter((asset) => asset.networkId === network.id)
        .filter((asset) => asset.type === 'base' || asset.type === 'erc20')
    : [];
  const assetOptions = filteredAssets.map((asset) => ({
    label: asset.name,
    id: asset.uuid,
    ...asset
  }));

  const [chosenAssetName, setAssetName] = useState(filteredAssets[0].name);
  const selectedAsset = filteredAssets.find((asset) => asset.name === chosenAssetName);

  const initialValues = {
    amount: '',
    asset: {},
    recipientAddress: {} as StoreAccount
  };

  const validateAmount = (amount: any) => {
    let error;
    if (selectedAsset) {
      const { decimal } = selectedAsset;
      if (isNaN(amount)) {
        error = translateRaw('REQUEST_FORM_ERROR_TYPE');
      } else if (decimal && !isValidAmount(decimal)(amount)) {
        error = translateRaw('REQUEST_FORM_ERROR_AMOUNT');
      }
    }

    return error;
  };

  return (
    <ContentPanel
      heading={translateRaw('REQUEST')}
      icon={receiveIcon}
      onBack={() => history.push(ROUTE_PATHS.DASHBOARD.path)}
      mobileMaxWidth="100%;"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={noOp}
        render={({
          values: { amount, recipientAddress },
          errors
        }: FormikProps<typeof initialValues>) => (
          <Form>
            <Fieldset>
              <SLabel htmlFor="recipientAddress">{translate('X_RECIPIENT')}</SLabel>
              <Field
                name="recipientAddress"
                component={({ field, form }: FieldProps) => (
                  <AccountDropdown
                    name={field.name}
                    value={field.value}
                    accounts={accounts}
                    onSelect={(option: IIAccount) => {
                      form.setFieldValue(field.name, option);
                      if (option.networkId) {
                        setNetworkId(option.networkId);
                      }
                    }}
                  />
                )}
              />
            </Fieldset>
            <AssetFields>
              <Amount>
                <SLabel htmlFor="amount">{translate('X_AMOUNT')}</SLabel>
                <Field
                  name="amount"
                  validate={validateAmount}
                  render={({ field, form }: FieldProps<string>) => (
                    <FullWidthInput
                      data-lpignore="true"
                      value={field.value}
                      onChange={({ target: { value } }) =>
                        form.setFieldValue(field.name, sanitizeDecimalSeparator(value))
                      }
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  )}
                />
              </Amount>
              {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
              <Asset>
                <SLabel htmlFor="asset">{translate('X_ASSET')}</SLabel>
                <Field
                  name="asset"
                  component={({ field, form }: FieldProps) => (
                    <AssetSelector
                      selectedAsset={field.value}
                      assets={assetOptions}
                      searchable={true}
                      onSelect={(option) => {
                        form.setFieldValue(field.name, option);
                        if (option.name) {
                          setAssetName(option.name);
                        }
                      }}
                    />
                  )}
                />
              </Asset>
            </AssetFields>
            {!errors.amount && selectedAsset && recipientAddress.address && network && (
              <>
                <Divider />
                <CodeHeader>
                  <CodeHeading as="h3">{translateRaw('REQUEST_FORM_CODE_HEADER')}</CodeHeading>
                  <Tooltip tooltip={translate('REQUEST_FORM_TOOLTIP')}>
                    <img className="Tool-tip-img" src={questionToolTip} />
                  </Tooltip>
                </CodeHeader>

                <Fieldset>
                  <SLabel>{translate('REQUEST_QR_CODE')}</SLabel>
                  <QRDisplay>
                    <QRCode
                      data={
                        isAssetToken(selectedAsset.type) &&
                        selectedAsset.contractAddress &&
                        selectedAsset.decimal
                          ? buildEIP681TokenRequest(
                              recipientAddress.address,
                              selectedAsset.contractAddress,
                              network.chainId,
                              amount,
                              selectedAsset.decimal
                            )
                          : buildEIP681EtherRequest(
                              recipientAddress.address,
                              network.chainId,
                              amount
                            )
                      }
                    />
                  </QRDisplay>
                </Fieldset>
                <Fieldset>
                  <SLabel>{translate('REQUEST_PAYMENT_CODE')}</SLabel>
                  <FieldsetBox>
                    <Copyable
                      text={
                        isAssetToken(selectedAsset.type) &&
                        selectedAsset.contractAddress &&
                        selectedAsset.decimal
                          ? buildEIP681TokenRequest(
                              recipientAddress.address,
                              selectedAsset.contractAddress,
                              network.chainId,
                              amount,
                              selectedAsset.decimal
                            )
                          : buildEIP681EtherRequest(
                              recipientAddress.address,
                              network.chainId,
                              amount
                            )
                      }
                      isCopyable={true}
                    />
                  </FieldsetBox>
                </Fieldset>
              </>
            )}
          </Form>
        )}
      />
    </ContentPanel>
  );
}

export default withRouter(ReceiveAssets);
