import noop from 'lodash/noop';
import React, { useContext, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { ComboBox, Copyable, Input } from '@mycrypto/ui';
import styled from 'styled-components';
import { buildEIP681EtherRequest, buildEIP681TokenRequest } from 'v2/libs/formatters';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AccountContext, AssetContext } from 'v2/providers';
import { getNetworkByName } from 'v2/libs/networks/networks';
import { validPositiveNumber, validDecimal } from 'v2/libs/validators';
import { ExtendedAccount as IExtendedAccount } from 'v2/services';
import { translateRaw } from 'translations';

import QRCode from './components/QRCode';
import AccountDropdown from './components/AccountDropdown';
// Legacy
import receiveIcon from 'common/assets/images/icn-receive.svg';

const truncate = (children: string) => {
  return [children.substring(0, 15), '…', children.substring(children.length - 10)].join('');
};

const isAssetToken = (tokenType: string) => {
  if (tokenType === 'base') {
    return false;
  }
  return true;
};

const QRDisplay = styled.div`
  margin: auto;
  width: 60%;
`;

const Label = styled.label`
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
  display: flex;
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

const FullWidthComboBox = styled(ComboBox)`
  width: 100%;
`;

const Amount = styled.div`
  flex: 2;
  margin-right: 15px;
`;

const Asset = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.span`
  color: red;
`;

export function ReceiveAssets({ history }: RouteComponentProps<{}>) {
  const { accounts } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const network = getNetworkByName(accounts[0].network);
  const filteredAssets = network
    ? assets
        .filter(asset => asset.networkId === network.id)
        .filter(asset => asset.type === 'base' || asset.type === 'erc20')
    : [];
  const assetNames = filteredAssets.map(asset => asset.name);
  const [chosenAssetName, setAssetName] = useState(assetNames[0]);
  const selectedAsset = filteredAssets.find(asset => asset.name === chosenAssetName);

  const [requestAddress, setRequestAddress] = useState('');

  const initialValues = {
    amount: '0',
    asset: 'ETH',
    chainId: network ? network.chainId : 1
  };

  const isValidAmount = (decimal: number) => (amount: string) =>
    validPositiveNumber(+amount) && validDecimal(amount, decimal);

  const validateAmount = (amount: any) => {
    let error;
    if (selectedAsset) {
      const { decimal } = selectedAsset;
      if (decimal && !isValidAmount(decimal)(amount)) {
        error = 'Please enter a valid amount';
      }
    }

    return error;
  };

  return (
    <Layout centered={true}>
      <ContentPanel heading="Receive Assets" icon={receiveIcon} onBack={history.goBack}>
        <Formik
          initialValues={initialValues}
          onSubmit={noop}
          render={({ values: { amount, chainId }, errors }: FormikProps<typeof initialValues>) => (
            <Form>
              <Fieldset>
                <Label htmlFor="recipientAddress">Recipient Address</Label>
                <Field
                  name="recipientAddress"
                  component={({ field, form }: FieldProps) => (
                    <AccountDropdown
                      name={field.name}
                      value={field.value}
                      accounts={accounts}
                      onSelect={(option: IExtendedAccount) => {
                        form.setFieldValue(field.name, option);
                        setRequestAddress(option.address);
                      }}
                    />
                  )}
                />
              </Fieldset>
              <AssetFields>
                <Amount>
                  <Label htmlFor="amount">Amount</Label>
                  <Field
                    name="amount"
                    validate={validateAmount}
                    render={({ field, form }: FieldProps<typeof initialValues>) => (
                      <FullWidthInput
                        value={field.value}
                        onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                        placeholder="0.00"
                      />
                    )}
                  />
                </Amount>
                <Asset>
                  <Label htmlFor="asset">Asset</Label>
                  <Field
                    name="asset"
                    render={({ field, form }: FieldProps<typeof initialValues>) => (
                      <FullWidthComboBox
                        value={field.value}
                        items={new Set(assetNames)}
                        onChange={({ target: { value } }) => {
                          form.setFieldValue(field.name, value);
                          setAssetName(value);
                        }}
                      />
                    )}
                  />
                </Asset>
              </AssetFields>
              {errors.amount && (
                <ErrorMessage>{' ' + translateRaw('RECEIVE_FORM_ERROR')}</ErrorMessage>
              )}
              {parseFloat(amount) >= 0 &&
                selectedAsset &&
                requestAddress &&
                network && (
                  <>
                    <Divider />
                    <Fieldset>
                      <Label>Payment Code</Label>
                      <FieldsetBox>
                        <Copyable
                          text={
                            isAssetToken(selectedAsset.type) &&
                            selectedAsset.contractAddress &&
                            selectedAsset.decimal
                              ? buildEIP681TokenRequest(
                                  requestAddress,
                                  selectedAsset.contractAddress,
                                  network.chainId,
                                  amount,
                                  selectedAsset.decimal
                                )
                              : buildEIP681EtherRequest(requestAddress, chainId, amount)
                          }
                          truncate={truncate}
                        />
                      </FieldsetBox>
                    </Fieldset>
                    <Fieldset>
                      <Label>QR Code</Label>
                      <QRDisplay>
                        <QRCode
                          data={
                            isAssetToken(selectedAsset.type) &&
                            selectedAsset.contractAddress &&
                            selectedAsset.decimal
                              ? buildEIP681TokenRequest(
                                  requestAddress,
                                  selectedAsset.contractAddress,
                                  network.chainId,
                                  amount,
                                  selectedAsset.decimal
                                )
                              : buildEIP681EtherRequest(requestAddress, chainId, amount)
                          }
                        />
                      </QRDisplay>
                    </Fieldset>
                  </>
                )}
            </Form>
          )}
        />
      </ContentPanel>
    </Layout>
  );
}

export default withRouter(ReceiveAssets);
