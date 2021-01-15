import React, { useContext } from 'react';

import { Button, Icon } from '@mycrypto/ui';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { object } from 'yup';

import { AccountSelector, AssetSelector, ContentPanel, InlineMessage } from '@components';
import {
  BUY_MYCRYPTO_WEBSITE,
  ETHUUID,
  MOONPAY_API_QUERYSTRING,
  MOONPAY_ASSET_UUIDS,
  ROUTE_PATHS
} from '@config';
import { MoonpaySignerService } from '@services/ApiService/MoonpaySigner';
import { isAccountInNetwork } from '@services/Store/Account/helpers';
import { getAssetByUUID, useAssets } from '@services/Store/Asset';
import { StoreContext } from '@services/Store/StoreProvider';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, IAccount, StoreAccount, TURL } from '@types';
import { openLink } from '@utils';

const FormFieldItem = styled.fieldset`
  margin-bottom: ${SPACING.LG};
`;

const FormFieldLabel = styled.label`
  display: flex;
  font-size: ${FONT_SIZE.BASE};
  margin-bottom: ${SPACING.SM};
  font-weight: 400;
  align-items: center;
  flex-wrap: wrap;
`;

const FormFieldSubmitButton = styled(Button)`
  width: 100%;
  display: inline-block;
  margin-bottom: ${SPACING.BASE};
  &:disabled {
    background-color: ${COLORS.BLUE_MYC};
  }
`;

const NavigationWarning = styled.div`
  color: ${COLORS.GREY};
  margin-bottom: ${SPACING.SM};
  display: flex;
  justify-content: center;
`;

const WarningIcon = styled(Icon)`
  margin-right: ${SPACING.XS};
  vertical-align: middle;

  svg {
    color: ${COLORS.GREY};
  }
`;

interface IBuyFormState {
  account: StoreAccount;
  asset: Asset;
}

enum SubmissionType {
  SEND_TO_SELF,
  SEND_TO_OTHER
}

export const BuyAssetsForm = () => {
  const history = useHistory();
  const { accounts, getDefaultAccount } = useContext(StoreContext);
  const { assets } = useAssets();
  const ethAsset = getAssetByUUID(assets)(ETHUUID) as Asset;

  const initialFormikValues: IBuyFormState = {
    account: getDefaultAccount(),
    asset: ethAsset
  };

  const BuyFormSchema = object().shape({
    account: object().required(translateRaw('REQUIRED')),
    asset: object().required(translateRaw('REQUIRED'))
  });

  const filteredAssets = assets.filter(({ uuid }) => MOONPAY_ASSET_UUIDS.includes(uuid));

  const handleSubmission = (values: IBuyFormState, typeOfSubmission: SubmissionType) => {
    if (typeOfSubmission === SubmissionType.SEND_TO_SELF) {
      const urlQuery = `${MOONPAY_API_QUERYSTRING}&currencyCode=${values.asset.ticker}&walletAddress=${values.account.address}`;

      MoonpaySignerService.instance
        .signUrlQuery(urlQuery)
        .then((signature: any) => {
          const redirectQueryParams = `?currencyCode=${values.asset.ticker}&walletAddress=${
            values.account.address
          }&signature=${encodeURIComponent(signature)}`;
          openLink(`${BUY_MYCRYPTO_WEBSITE}${redirectQueryParams}` as TURL);
        })
        .catch(() => {
          openLink(BUY_MYCRYPTO_WEBSITE);
        });
    } else {
      openLink(BUY_MYCRYPTO_WEBSITE);
    }
  };

  const goBack = () => history.push(ROUTE_PATHS.DASHBOARD.path);

  return (
    <ContentPanel
      onBack={goBack}
      backBtnText={translateRaw('DASHBOARD')}
      heading={translateRaw('DASHBOARD_ACTIONS_BUY_TITLE')}
    >
      <Formik
        initialValues={initialFormikValues}
        validationSchema={BuyFormSchema}
        onSubmit={(vals) => handleSubmission(vals, SubmissionType.SEND_TO_SELF)}
      >
        {({ values, errors, touched, setFieldValue }) => {
          const relevantAccounts = accounts.filter((account) => {
            return values.asset && values.asset.networkId
              ? isAccountInNetwork(account, values.asset.networkId)
              : true;
          });

          return (
            <Form>
              <FormFieldItem>
                <FormFieldLabel htmlFor="account">{translate('X_RECIPIENT')}</FormFieldLabel>
                <Field
                  name="account"
                  value={values.account}
                  component={({ field }: FieldProps) => (
                    <AccountSelector
                      name={field.name}
                      value={field.value}
                      accounts={relevantAccounts}
                      onSelect={(option: IAccount) => {
                        setFieldValue('account', option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                      }}
                    />
                  )}
                />
                {errors && errors.account && touched && touched.account && (
                  <InlineMessage className="SendAssetsForm-errors">{errors.asset}</InlineMessage>
                )}
              </FormFieldItem>
              <FormFieldItem>
                <FormFieldLabel htmlFor="asset">
                  {translate('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
                </FormFieldLabel>
                <Field
                  name="asset"
                  value={values.asset}
                  component={({ field, form }: FieldProps) => (
                    <AssetSelector
                      selectedAsset={field.value}
                      assets={filteredAssets}
                      onSelect={(option: Asset) => {
                        form.setFieldValue('asset', option || {}); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                      }}
                    />
                  )}
                />
                {errors && errors.asset && touched && touched.asset && (
                  <InlineMessage className="SendAssetsForm-errors">{errors.asset}</InlineMessage>
                )}
              </FormFieldItem>
              <NavigationWarning>
                <WarningIcon icon="warning" />
                {translateRaw('EXTERNAL_NAVIGATION_WARNING')}
              </NavigationWarning>
              <FormFieldSubmitButton
                onClick={() => handleSubmission(values, SubmissionType.SEND_TO_SELF)}
              >
                {translateRaw('CHECKOUT_CTA')}
              </FormFieldSubmitButton>

              <FormFieldSubmitButton
                secondary={true}
                onClick={() => handleSubmission(values, SubmissionType.SEND_TO_OTHER)}
              >
                {translateRaw('CHECKOUT_OTHER_CTA')}
              </FormFieldSubmitButton>
            </Form>
          );
        }}
      </Formik>
    </ContentPanel>
  );
};

export default BuyAssetsForm;
