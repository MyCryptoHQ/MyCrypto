import { useEffect, useState } from 'react';

import { Heading, Input, Tooltip } from '@mycrypto/ui';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import questionToolTip from '@assets/images/icn-question.svg';
import receiveIcon from '@assets/images/icn-receive.svg';
import {
  AccountSelector,
  Button,
  ExtendedContentPanel,
  InlineMessage,
  LinkApp,
  TxReceipt
} from '@components';
import { FaucetReceiptBanner } from '@components/TransactionFlow/displays';
import {
  FAUCET_NETWORKS,
  getKBHelpArticle,
  KB_HELP_ARTICLE,
  MYCRYPTO_FAUCET_LINK,
  ROUTE_PATHS
} from '@config';
import { getStoreAccount, useAccounts, useAssets, useContacts, useNetworks } from '@services/Store';
import { getStoreAccounts, useSelector } from '@store';
import { COLORS, SPACING } from '@theme';
import translate, { Trans, translateRaw } from '@translations';
import { IAccount as IIAccount, InlineMessageType, Network, StoreAccount } from '@types';
import { generateTweet, noOp, useStateReducer } from '@utils';

import { Error as ErrorComponent } from './components';
import { makeTxConfig, makeTxReceipt, possibleSolution } from './helpers';
import FaucetFactory from './stateFactory';

// Legacy

const SLabel = styled.label`
  margin-bottom: ${SPACING.SM};
  color: ${COLORS.GREY_DARKEST};
  font-weight: normal;
`;

const Fieldset = styled.fieldset`
  margin-bottom: ${SPACING.BASE};
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CodeHeading = styled(Heading)`
  margin-top: ${SPACING.SM};
`;

const NoTestnetAccounts = styled(InlineMessage)`
  margin-bottom: ${SPACING.BASE};
`;

const IncorrectResponse = styled(InlineMessage)`
  margin-top: ${SPACING.SM};
`;

const Description = styled.p`
  margin-bottom: ${SPACING.MD};
`;

const CenterText = styled.div`
  margin-top: ${SPACING.MD};
  text-align: center;
`;

const RequestButton = styled(Button)`
  width: 100%;
`;

const SubmitCaptchaButton = styled(Button)`
  width: 100%;
  margin-top: ${SPACING.MD};
`;

const initialFaucetState = () => ({
  step: 0,
  loading: false
});

export default function Faucet() {
  const history = useHistory();

  const { faucetState, reset, setSolution, requestFunds, finalizeRequestFunds } = useStateReducer(
    FaucetFactory,
    initialFaucetState
  );

  const accounts = useSelector(getStoreAccounts);

  const { addTxToAccount } = useAccounts();

  const initialValues = {
    recipientAddress: {} as StoreAccount
  };

  const validAccounts = accounts.filter((account) => FAUCET_NETWORKS.includes(account.network.id));

  const { networks, getNetworkById } = useNetworks();
  const { assets } = useAssets();
  const { getContactByAddressAndNetworkId } = useContacts();

  const [network, setNetwork] = useState<Network | undefined>(undefined);

  const txConfig =
    faucetState.txResult &&
    makeTxConfig(faucetState.txResult, networks, assets, accounts, getContactByAddressAndNetworkId);

  const txReceipt = txConfig && makeTxReceipt(faucetState.txResult, txConfig);

  useEffect(() => {
    if (txReceipt) {
      const recipientAccount = getStoreAccount(accounts)(
        txReceipt.to,
        txReceipt.baseAsset.networkId
      );
      if (recipientAccount) {
        addTxToAccount(recipientAccount, txReceipt);
      }
    }
  }, [faucetState.txResult]);

  const steps = [
    <Formik
      key="recipient"
      initialValues={initialValues}
      onSubmit={noOp}
      render={({ values: { recipientAddress } }: FormikProps<typeof initialValues>) => (
        <Form>
          <Description>{translate('FAUCET_DESCRIPTION')}</Description>
          <Fieldset>
            <SLabel htmlFor="recipientAddress">{translate('X_RECIPIENT')}</SLabel>
            <Field
              name="recipientAddress"
              component={({ field, form }: FieldProps) => (
                <AccountSelector
                  name={field.name}
                  value={field.value}
                  accounts={validAccounts}
                  onSelect={(option: IIAccount) => {
                    form.setFieldValue(field.name, option);
                    setNetwork(getNetworkById(option.networkId));
                  }}
                />
              )}
            />
          </Fieldset>
          {validAccounts.length === 0 && (
            <NoTestnetAccounts type={InlineMessageType.ERROR}>
              <Trans
                id="FAUCET_NO_ACCOUNTS"
                variables={{
                  $link_add_account: () => (
                    <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT.path}>
                      {translateRaw('FAUCET_ADD_ACCOUNT_LINK')}
                    </LinkApp>
                  ),
                  $link_create_account: () => (
                    <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT.path}>
                      {translateRaw('FAUCET_CREATE_ACCOUNT_LINK')}
                    </LinkApp>
                  )
                }}
              />
            </NoTestnetAccounts>
          )}
          <RequestButton
            name="requestFunds"
            onClick={() => requestFunds(recipientAddress)}
            disabled={Object.keys(recipientAddress).length === 0}
          >
            {translate('REQUEST')}
          </RequestButton>
          <CenterText>
            {translate('FAUCET_NOT_SURE')}
            <br />
            <LinkApp
              href={getKBHelpArticle(KB_HELP_ARTICLE.WHERE_TO_GET_TESTNET_ETHER)}
              isExternal={true}
            >
              {translate('VISIT_KB')}
            </LinkApp>
          </CenterText>
        </Form>
      )}
    />,
    <>
      <CodeHeader>
        <CodeHeading as="h3">{translateRaw('CAPTCHA')}</CodeHeading>
        <Tooltip tooltip={translate('CAPTCHA_TOOLTIP')}>
          <img className="Tool-tip-img" src={questionToolTip} />
        </Tooltip>
      </CodeHeader>
      {faucetState.challenge && (
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <img
            style={{ width: '100%' }}
            src={`data:image/png;base64,${faucetState.challenge.challenge}`}
          />
        </div>
      )}
      <Input
        value={faucetState.solution}
        name="captcha"
        placeholder={translateRaw('FAUCET_ENTER_RESPONSE')}
        onChange={(e) => {
          setSolution(e.target.value);
        }}
      />
      {faucetState.error && faucetState.error === 'INVALID_SOLUTION' && (
        <IncorrectResponse type={InlineMessageType.ERROR}>
          {translateRaw('CAPTCHA_INCORRECT_RESPONSE')}
        </IncorrectResponse>
      )}
      <SubmitCaptchaButton
        name="submitCaptcha"
        onClick={() => finalizeRequestFunds(faucetState.solution)}
        disabled={faucetState.loading || !possibleSolution(faucetState.solution)}
      >
        {translateRaw('CAPTCHA_SUBMIT')}
      </SubmitCaptchaButton>
    </>,
    <>
      {faucetState.txResult && (
        <TxReceipt
          txConfig={txConfig}
          txReceipt={txReceipt}
          onComplete={() => reset()}
          resetFlow={() => reset()}
          queryStringsDisabled={true}
          customBroadcastText={translateRaw('FAUCET_SUCCESS')}
          disablePendingState={true}
          customComponent={() => (
            <FaucetReceiptBanner network={network!} received={faucetState.txResult.value} />
          )}
          completeButton={() => (
            <LinkApp
              href={generateTweet(
                translateRaw('FAUCET_TWEET', {
                  $faucet_url: MYCRYPTO_FAUCET_LINK
                })
              )}
              isExternal={true}
            >
              <Button
                colorScheme={'inverted'}
                fullwidth={true}
                className="TransactionReceipt-tweet"
              >
                <i className="sm-icon sm-logo-twitter TransactionReceipt-tweet-icon" />{' '}
                <span className="TransactionReceipt-tweet-text">{translate('FAUCET_SHARE')}</span>
              </Button>
            </LinkApp>
          )}
        />
      )}
    </>
  ];

  return (
    <ExtendedContentPanel
      heading={translateRaw('FAUCET')}
      icon={receiveIcon}
      onBack={() => history.push(ROUTE_PATHS.DASHBOARD.path)}
      stepper={{ current: faucetState.step + 1, total: steps.length }}
      width="750px"
    >
      {faucetState.error && faucetState.error !== 'INVALID_SOLUTION' ? (
        <ErrorComponent type={faucetState.error} />
      ) : (
        steps[faucetState.step]
      )}
    </ExtendedContentPanel>
  );
}
