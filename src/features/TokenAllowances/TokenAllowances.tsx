import React, { useContext, useState } from 'react';

import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Error as ErrorComponent } from './components';
import receiveIcon from '@assets/images/icn-receive.svg';
import {
  AccountSelector,
  Button,
  ExtendedContentPanel,
} from '@components';
import {
  ROUTE_PATHS
} from '@config';
import { StoreContext, useNetworks } from '@services/Store';
import { COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { IAccount as IIAccount, Network, StoreAccount } from '@types';
import { noOp, useStateReducer } from '@utils';

import TokenAllowancesFactory from './stateFactory';
import MyTokens from './MyTokens';

// Legacy

const SLabel = styled.label`
  margin-bottom: ${SPACING.SM};
  color: ${COLORS.GREY_DARKEST};
  font-weight: normal;
`;

const Fieldset = styled.fieldset`
  margin-bottom: ${SPACING.BASE};
`;

const Description = styled.p`
  margin-bottom: ${SPACING.MD};
`;

const CheckAllowancesButton = styled(Button)`
  width: 100%;
`;

const initialTokenAllowancesState = () => ({
  step: 0
});

export default function TokenAllowances() {
  const history = useHistory();

  const { tokenAllowancesState, getTokenAllowancesForAccount } = useStateReducer(
    TokenAllowancesFactory,
    initialTokenAllowancesState
  );

  const { accounts } = useContext(StoreContext);

  const initialValues = {
    tokenAllowanceAddress: {} as StoreAccount
  };


  const { getNetworkById } = useNetworks();

  const [network, setNetwork] = useState<Network | undefined>(undefined);

  const steps = [
    <Formik
      key="recipient"
      initialValues={initialValues}
      onSubmit={noOp}
      render={({ values: { tokenAllowanceAddress } }: FormikProps<typeof initialValues>) => (
        <Form>
          <Description>{translate('TOKEN_ALLOWANCES_DESC')}</Description>
          <Fieldset>
            <SLabel htmlFor="tokenAllowanceAddress">{translate('ACCOUNT_LIST_ADDRESS')}</SLabel>
            <Field
              name="tokenAllowanceAddress"
              component={({ field, form }: FieldProps) => (
                <AccountSelector
                  name={field.name}
                  value={field.value}
                  accounts={accounts}
                  onSelect={(option: IIAccount) => {
                    form.setFieldValue(field.name, option);
                    setNetwork(getNetworkById(option.networkId));
                  }}
                />
              )}
            />
          </Fieldset>
          <CheckAllowancesButton
            name="getTokenAllowancesForAccount"
            onClick={() => getTokenAllowancesForAccount(tokenAllowanceAddress)}
            disabled={Object.keys(tokenAllowanceAddress).length === 0}
          >
            {translate('TOKEN_ALLOWANCES_INSPECT_TOKENS')}
          </CheckAllowancesButton>
        </Form>
      )}
    />,
    <>
      <MyTokens
        assets={tokenAllowancesState.assets}
        address={tokenAllowancesState.address}
        network={network}
      />
    </>,
    <>
      Fin.
    </>
  ];

  return (
    <ExtendedContentPanel
      heading={translateRaw('TOKEN_ALLOWANCES')}
      icon={receiveIcon}
      onBack={() => history.push(ROUTE_PATHS.DASHBOARD.path)}
      stepper={{ current: tokenAllowancesState.step + 1, total: steps.length }}
      centered={true}
      width="850px"
    >

      {tokenAllowancesState.error ? (
        <ErrorComponent type={tokenAllowancesState.error} />
      ) : (
          steps[tokenAllowancesState.step]
        )}
    </ExtendedContentPanel>
  );
}
