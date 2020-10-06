import React, { useContext, useState } from 'react';

import { Heading, Icon, Input, Tooltip } from '@mycrypto/ui';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import questionToolTip from '@assets/images/icn-question.svg';
import receiveIcon from '@assets/images/icn-receive.svg';
import {
  AccountSelector,
  Button,
  ExtendedContentPanel,
  InlineMessage,
  NewTabLink,
  TxReceipt
} from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, ROUTE_PATHS } from '@config';
import { StoreContext } from '@services/Store';
import translate, { translateRaw } from '@translations';
import { IAccount as IIAccount, InlineMessageType, StoreAccount } from '@types';
import { noOp } from '@utils';

import { Error } from './components';
import {
  makeTxConfig,
  makeTxReceipt,
  possibleSolution,
  regenerateChallenge,
  requestChallenge,
  solveChallenge
} from './helpers';

// Legacy

const SLabel = styled.label`
  margin-bottom: 8px;
  color: #333333;
  font-weight: normal;
`;

const Fieldset = styled.fieldset`
  margin-bottom: 15px;
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CodeHeading = styled(Heading)`
  margin-top: 8px;
`;

const LearnMoreArrowWrapper = styled.span`
  vertical-align: middle;
  margin-left: 2px;
`;

const LearnMoreArrow = styled(Icon)`
  transform: rotate(180deg);
  width: 14px;
  height: 14px;
`;

const NoTestnetAccounts = styled(InlineMessage)`
  margin-bottom: 20px;
  a {
    color: var(--color-link-color);
    text-decoration: none;
  }
  a:hover {
    color: var(--color-link-color);
  }
`;

const IncorrectResponse = styled(InlineMessage)`
  margin-top: 10px;
`;

const Description = styled.p`
  margin-bottom: 30px;
`;

const CenterText = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const RequestButton = styled(Button)`
  width: 100%;
`;

const SubmitCaptchaButton = styled(Button)`
  width: 100%;
  margin-top: 30px;
`;

const faucetNetworks = ['Ropsten', 'Rinkeby', 'Kovan', 'Goerli'];

export function Faucet({ history }: RouteComponentProps<{}>) {
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState({} as any);
  const [solution, setSolution] = useState('');
  const [txResult, setTxResult] = useState({} as any);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { accounts } = useContext(StoreContext);

  const initialValues = {
    recipientAddress: {} as StoreAccount
  };

  const reset = () => {
    setChallenge({});
    setSolution('');
    setTxResult({});
    setError('');
    setStep(0);
  };

  const requestFunds = (recipientAddress: StoreAccount) => {
    requestChallenge(recipientAddress)
      .then((result) => {
        setChallenge(result);
        setStep(1);
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const finalizeRequestFunds = (solutionInput: string) => {
    setLoading(true);
    solveChallenge(challenge.id, solutionInput)
      .then((result) => {
        setLoading(false);
        setTxResult(result);
        setStep(2);
      })
      .catch((e) => {
        if (e.message === 'INVALID_SOLUTION') {
          regenerateChallenge(challenge.id)
            .then((result) => {
              setSolution('');
              setChallenge(result);
              setError(e.message);
              setLoading(false);
            })
            .catch((err) => {
              setError(err.message);
            });
        } else {
          setLoading(false);
          setError(e.message);
        }
      });
  };

  const validAccounts = accounts.filter((account) => faucetNetworks.includes(account.network.name));

  const txConfig: any = 'hash' in txResult ? makeTxConfig(txResult) : {};
  const txReceipt: any = 'hash' in txResult ? makeTxReceipt(txResult) : {};

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
                  }}
                />
              )}
            />
          </Fieldset>
          {validAccounts.length === 0 && (
            <NoTestnetAccounts type={InlineMessageType.ERROR}>
              {translate('FAUCET_NO_ACCOUNTS', {
                $link_add_account: ROUTE_PATHS.ADD_ACCOUNT.path,
                $link_create_account: ROUTE_PATHS.CREATE_WALLET.path
              })}
            </NoTestnetAccounts>
          )}
          <RequestButton
            onClick={() => requestFunds(recipientAddress)}
            disabled={Object.keys(recipientAddress).length === 0}
          >
            {translate('REQUEST')}
          </RequestButton>
          <CenterText>
            {translate('FAUCET_NOT_SURE')}{' '}
            <NewTabLink href={getKBHelpArticle(KB_HELP_ARTICLE.WHERE_TO_GET_TESTNET_ETHER)}>
              {translate('LEARN_MORE')}{' '}
              <LearnMoreArrowWrapper>
                <LearnMoreArrow icon="backArrow" />
              </LearnMoreArrowWrapper>
            </NewTabLink>
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
      {'challenge' in challenge && (
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <img style={{ width: '100%' }} src={`data:image/png;base64,${challenge.challenge}`} />
        </div>
      )}
      <Input
        value={solution}
        placeholder={translateRaw('FAUCET_ENTER_RESPONSE')}
        onChange={(e) => {
          setSolution(e.target.value);
        }}
      />
      {error && error === 'INVALID_SOLUTION' && (
        <IncorrectResponse type={InlineMessageType.ERROR}>
          Incorrect captcha response. Please try again.
        </IncorrectResponse>
      )}
      <SubmitCaptchaButton
        onClick={() => finalizeRequestFunds(solution)}
        disabled={loading || !possibleSolution(solution)}
      >
        Submit
      </SubmitCaptchaButton>
    </>,
    <>
      {'hash' in txResult && (
        <TxReceipt
          txConfig={txConfig}
          txReceipt={txReceipt}
          onComplete={() => reset()}
          resetFlow={() => reset()}
        />
      )}
    </>
  ];

  return (
    <ExtendedContentPanel
      heading={translateRaw('FAUCET')}
      icon={receiveIcon}
      onBack={() => history.push(ROUTE_PATHS.DASHBOARD.path)}
      stepper={{ current: step + 1, total: steps.length }}
      width="750px"
    >
      {error && error !== 'INVALID_SOLUTION' ? <Error type={error} /> : steps[step]}
    </ExtendedContentPanel>
  );
}

export default withRouter(Faucet);
