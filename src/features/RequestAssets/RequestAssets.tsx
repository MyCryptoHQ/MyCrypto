import React, { useContext, useEffect, useState } from 'react';

import { Heading, Input, Tooltip } from '@mycrypto/ui';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { number, object } from 'yup';

import questionToolTip from '@assets/images/icn-question.svg';
import receiveIcon from '@assets/images/icn-receive.svg';
import {
  AccountSelector,
  AssetSelector,
  ContentPanel,
  CopyableCodeBlock,
  InlineMessage,
  QRCode
} from '@components';
import { ROUTE_PATHS } from '@config';
import { validateAmountField } from '@features/SendAssets/components';
import { getNetworkById, StoreContext, useAssets } from '@services/Store';
import translate, { translateRaw } from '@translations';
import { IAccount as IIAccount } from '@types';
import {
  buildEIP681EtherRequest,
  buildEIP681TokenRequest,
  filterDropdownAssets,
  filterValidAssets,
  isValidAmount,
  noOp,
  sanitizeDecimalSeparator,
  sortByTicker
} from '@utils';

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

export function RequestAssets({ history }: RouteComponentProps) {
  const { accounts, getDefaultAccount, networks } = useContext(StoreContext);
  const defaultAccount = getDefaultAccount(true);
  const { assets } = useAssets();
  const [networkId, setNetworkId] = useState(defaultAccount.networkId);
  const network = getNetworkById(networkId, networks);
  const relevantAssets = network ? filterValidAssets(assets, network.id) : [];
  const filteredAssets = sortByTicker(filterDropdownAssets(relevantAssets));

  const [chosenAssetUuid, setAssetUuid] = useState(
    filteredAssets.find((a) => a.type === 'base')?.uuid
  );
  const selectedAsset = filteredAssets.find((asset) => asset.uuid === chosenAssetUuid);

  useEffect(() => setAssetUuid(filteredAssets.find((a) => a.type === 'base')?.uuid), [networkId]);

  const FormSchema = object().shape({
    amount: number()
      .min(0, translateRaw('ERROR_0'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_0'))
      .test(validateAmountField())
  });

  const initialValues = {
    amount: '',
    asset: {},
    recipientAddress: defaultAccount
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
      <Formik initialValues={initialValues} onSubmit={noOp} validationSchema={FormSchema}>
        {({
          values: { amount, recipientAddress },
          errors,
          touched
        }: FormikProps<typeof initialValues>) => (
          <Form>
            <Fieldset>
              <SLabel htmlFor="recipientAddress">{translate('X_RECIPIENT')}</SLabel>
              <Field
                name="recipientAddress"
                component={({ field, form }: FieldProps) => (
                  <AccountSelector
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
                <Field name="amount" validate={validateAmount}>
                  {({ field, form }: FieldProps<string>) => (
                    <FullWidthInput
                      data-lpignore="true"
                      value={field.value}
                      onChange={({ target: { value } }) => {
                        form.setFieldTouched(field.name, true, true);
                        form.setFieldValue(field.name, sanitizeDecimalSeparator(value));
                      }}
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  )}
                </Field>
              </Amount>
              {errors.amount && touched.amount && <InlineMessage>{errors.amount}</InlineMessage>}
              <Asset>
                <SLabel htmlFor="asset">{translate('X_ASSET')}</SLabel>
                <Field
                  name="asset"
                  component={({ field, form }: FieldProps) => (
                    <AssetSelector
                      selectedAsset={selectedAsset ? selectedAsset : null}
                      assets={filteredAssets}
                      showAssetName={true}
                      searchable={true}
                      onSelect={(option) => {
                        form.setFieldValue(field.name, option);
                        if (option.uuid) {
                          setAssetUuid(option.uuid);
                        }
                      }}
                    />
                  )}
                />
              </Asset>
            </AssetFields>
            {!errors.amount &&
              selectedAsset &&
              recipientAddress.address &&
              network &&
              amount.length > 0 && (
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
                    <CopyableCodeBlock>
                      {isAssetToken(selectedAsset.type) &&
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
                          )}
                    </CopyableCodeBlock>
                  </Fieldset>
                </>
              )}
          </Form>
        )}
      </Formik>
    </ContentPanel>
  );
}

export default withRouter(RequestAssets);
