import React, { useContext, useState } from 'react';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import noop from 'lodash/noop';
import { Copyable, Input } from '@mycrypto/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Select, { Option } from 'react-select';
import styled from 'styled-components';

import { buildEIP681EtherRequest, buildEIP681TokenRequest } from 'v2/libs/formatters';
import { ContentPanel, QRCode } from 'v2/components';
import { AccountContext, AssetContext } from 'v2/providers';
import { getNetworkByName } from 'v2/libs/networks/networks';
import { isValidAmount, truncate } from 'v2/utils';
import { ExtendedAccount as IExtendedAccount } from 'v2/services';
import { translateRaw } from 'translations';

import { AccountDropdown } from './components';
// Legacy
import receiveIcon from 'common/assets/images/icn-receive.svg';

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

const ReceivePanel = styled(ContentPanel)`
  width: 100%;
  min-width: 500px;
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

const StyledSelect = styled(Select)`
  width: 100%;
  border-radius: 0.125em;
  border: 0.125em solid rgba(63, 63, 68, 0.05);
  outline: 0 0 0 0.25em rgba(0, 122, 153, 0.65);
`;

const Amount = styled.div`
  width: 100%;
`;

const Asset = styled.div`
  margin-top: 15px;
  width: 100%;

  .is-focused {
    border-color: none;
    outline: none;
    box-shadow: 0 0 0 0.25em rgba(0, 122, 153, 0.65);
  }
`;

const ErrorMessage = styled.span`
  color: red;
`;

export function ReceiveAssets({ history }: RouteComponentProps<{}>) {
  const { accounts } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const [networkName, setNetworkName] = useState(accounts[0].network);
  const network = getNetworkByName(networkName);
  const filteredAssets = network
    ? assets
        .filter(asset => asset.networkId === network.id)
        .filter(asset => asset.type === 'base' || asset.type === 'erc20')
    : [];
  const assetOptions = filteredAssets.map(asset => ({ label: asset.name, id: asset.uuid }));
  const [chosenAssetName, setAssetName] = useState(assetOptions[0].label);
  const selectedAsset = filteredAssets.find(asset => asset.name === chosenAssetName);

  const initialValues = {
    amount: '0',
    asset: { label: 'Ethereum', id: '7bbf42b1-9275-120b-0d0a-a788abd75ea0' },
    chainId: network ? network.chainId : 1,
    recipientAddress: accounts[0]
  };

  const validateAmount = (amount: any) => {
    let error;
    if (selectedAsset) {
      const { decimal } = selectedAsset;
      if (decimal && !isValidAmount(decimal)(amount)) {
        error = 'Please enter a valid amount';
      }
      if (isNaN(+amount)) {
        error = 'Please enter a number';
      }
    }

    return error;
  };

  return (
    <ReceivePanel heading="Receive Assets" icon={receiveIcon} onBack={() => history.push('/')}>
      <Formik
        initialValues={initialValues}
        onSubmit={noop}
        render={({
          values: { amount, chainId, recipientAddress },
          errors
        }: FormikProps<typeof initialValues>) => (
          <Form>
            <Fieldset>
              <SLabel htmlFor="recipientAddress">Recipient Address</SLabel>
              <Field
                name="recipientAddress"
                component={({ field, form }: FieldProps) => (
                  <AccountDropdown
                    name={field.name}
                    value={field.value}
                    accounts={accounts}
                    onSelect={(option: IExtendedAccount) => {
                      form.setFieldValue(field.name, option);
                      if (option.network) {
                        setNetworkName(option.network);
                      }
                    }}
                  />
                )}
              />
            </Fieldset>
            <AssetFields>
              <Amount>
                <SLabel htmlFor="amount">Amount</SLabel>
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
                <SLabel htmlFor="asset">Asset</SLabel>
                <Field
                  name="asset"
                  render={({ field, form }: FieldProps<typeof initialValues>) => (
                    <StyledSelect
                      name="Assets"
                      className="select-container"
                      options={assetOptions}
                      value={field.value}
                      onChange={(option: Option) => {
                        form.setFieldValue(field.name, option);
                        if (option.label) {
                          setAssetName(option.label);
                        }
                      }}
                    />
                  )}
                />
              </Asset>
            </AssetFields>
            {errors.amount ? (
              <ErrorMessage>{' ' + translateRaw('RECEIVE_FORM_ERROR')}</ErrorMessage>
            ) : (
              !errors.amount &&
              selectedAsset &&
              recipientAddress.address &&
              network && (
                <>
                  <Divider />
                  <Fieldset>
                    <SLabel>Payment Code</SLabel>
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
                            : buildEIP681EtherRequest(recipientAddress.address, chainId, amount)
                        }
                        truncate={truncate}
                      />
                    </FieldsetBox>
                  </Fieldset>
                  <Fieldset>
                    <SLabel>QR Code</SLabel>
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
                            : buildEIP681EtherRequest(recipientAddress.address, chainId, amount)
                        }
                      />
                    </QRDisplay>
                  </Fieldset>
                </>
              )
            )}
          </Form>
        )}
      />
    </ReceivePanel>
  );
}

export default withRouter(ReceiveAssets);
