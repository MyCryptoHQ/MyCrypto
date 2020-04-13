import React, { useContext } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, Icon } from '@mycrypto/ui';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import translate, { translateRaw } from 'v2/translations';
import { SPACING, COLORS } from 'v2/theme';
import { IAccount, StoreAccount, Asset } from 'v2/types';
import { EtherUUID, MOONPAY_ASSET_UUIDS } from 'v2/utils';
import { ROUTE_PATHS, MOONPAY_API_QUERYSTRING, BUY_MYCRYPTO_WEBSITE } from 'v2/config';
import { AccountDropdown, AssetDropdown, InlineMessage, ContentPanel } from 'v2/components';
import { isAccountInNetwork } from 'v2/services/Store/Account/helpers';
import { MoonpaySignerService } from 'v2/services/ApiService/MoonpaySigner';
import { StoreContext } from 'v2/services/Store/StoreProvider';
import { AssetContext } from 'v2/services/Store/Asset';

const FormFieldItem = styled.fieldset`
  margin-bottom: ${SPACING.LG};
`;

const FormFieldLabel = styled.label`
  display: flex;
  font-size: 1rem;
  margin-bottom: ${SPACING.SM};
  font-weight: 400;
  align-items: center;
  flex-wrap: wrap;
`;

const FormFieldSubmitButton = styled(Button)`
  width: 100%;
  display: inline-block;
  margin-bottom: 15px;
  &:disabled {
    background-color: rgba(0, 122, 153, 0.3);
  }
`;

const NavigationWarning = styled.div`
  color: ${COLORS.GREY};
  margin-bottom: ${SPACING.SM};
  display: flex;
  justify-content: center;
`;

const WarningIcon = styled(Icon)`
  margin-right: 5px;
  vertical-align: middle;

  svg {
    color: ${COLORS.GREY};
  }
`;

const Divider = styled.div`
  height: 1px;
  margin-bottom: 20px;
  background: #e3edff;
`;

interface IBuyFormState {
  account: StoreAccount;
  asset: Asset;
}

enum SubmissionType {
  SEND_TO_SELF = 'SEND_TO_SELF',
  SEND_TO_OTHER = 'SEND_TO_OTHER'
}

export const BuyAssetsForm = ({}: any) => {
  const history = useHistory();
  const { accounts } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const ethAsset = assets.find(asset => asset.uuid === EtherUUID) as Asset;

  const initialFormikValues: IBuyFormState = {
    account: {} as StoreAccount,
    asset: ethAsset
  };

  const BuyFormSchema = Yup.object().shape({
    account: Yup.object().required(translateRaw('REQUIRED')),
    asset: Yup.object().required(translateRaw('REQUIRED'))
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
          window.open(`${BUY_MYCRYPTO_WEBSITE}${redirectQueryParams}`, '_blank');
        })
        .catch(err => {
          console.debug('err detected: ', err);
          window.open(`${BUY_MYCRYPTO_WEBSITE}`, '_blank');
        });
    } else {
      window.open(`${BUY_MYCRYPTO_WEBSITE}`, '_blank');
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
        onSubmit={vals => handleSubmission(vals, SubmissionType.SEND_TO_SELF)}
        render={({ values, errors, touched, setFieldValue }) => {
          const relevantAccounts = accounts.filter(account => {
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
                    <AccountDropdown
                      name={field.name}
                      value={field.value}
                      accounts={relevantAccounts}
                      onSelect={(option: IAccount) => {
                        setFieldValue('account', option); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object
                      }}
                    />
                  )}
                />
                {errors && errors.account && touched && touched.account ? (
                  <InlineMessage className="SendAssetsForm-errors">{errors.asset}</InlineMessage>
                ) : null}
              </FormFieldItem>
              <FormFieldItem>
                <FormFieldLabel htmlFor="asset">
                  {translate('SEND_ASSETS_ASSET_SELECTION_PLACEHOLDER')}
                </FormFieldLabel>
                <Field
                  name="asset"
                  value={values.asset}
                  component={({ field, form }: FieldProps) => (
                    <AssetDropdown
                      selectedAsset={field.value}
                      assets={filteredAssets}
                      onSelect={(option: Asset) => {
                        form.setFieldValue('asset', option || {}); //if this gets deleted, it no longer shows as selected on interface (find way to not need this)
                      }}
                    />
                  )}
                />
                {errors && errors.asset && touched && touched.asset ? (
                  <InlineMessage className="SendAssetsForm-errors">{errors.asset}</InlineMessage>
                ) : null}
              </FormFieldItem>
              <Divider />
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
      />
    </ContentPanel>
  );
};

export default BuyAssetsForm;
