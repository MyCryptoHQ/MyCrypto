import React, { useContext, useState } from 'react';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { Heading, Tooltip, Input, Icon } from '@mycrypto/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { Button, ExtendedContentPanel, AccountDropdown, NewTabLink } from '@components';
import { StoreContext } from '@services/Store';
import { noOp } from '@utils';
import { IAccount as IIAccount, StoreAccount } from '@types';
import { ROUTE_PATHS } from '@config';
import translate, { translateRaw } from '@translations';
import questionToolTip from '@assets/images/icn-question.svg';

import { Error } from './components';
import { possibleSolution, requestChallenge, solveChallenge } from './helpers';

// Legacy
import receiveIcon from '@assets/images/icn-receive.svg';

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

const Divider = styled.div`
  height: 1px;
  margin: 30px 0;
  background: #e3edff;
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

const faucetNetworks = ['Ropsten', 'Rinkeby', 'Kovan', 'Goerli'];

export function Faucet({ history }: RouteComponentProps<{}>) {
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState({} as any);
  const [solution, setSolution] = useState('');
  const [txResult, setTxResult] = useState({} as any);
  const [error, setError] = useState('');

  const { accounts } = useContext(StoreContext);

  const initialValues = {
    recipientAddress: {} as StoreAccount
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
    solveChallenge(challenge.id, solutionInput)
      .then((result) => {
        setTxResult(result);
        setStep(2);
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const validAccounts = accounts.filter((account) => faucetNetworks.includes(account.network.name));

  const steps = [
    <Formik
      key="recipient"
      initialValues={initialValues}
      onSubmit={noOp}
      render={({ values: { recipientAddress } }: FormikProps<typeof initialValues>) => (
        <Form>
          <p>{translate('FAUCET_DESCRIPTION')}</p>
          <Divider />
          <Fieldset>
            <SLabel htmlFor="recipientAddress">{translate('X_RECIPIENT')}</SLabel>
            <Field
              name="recipientAddress"
              component={({ field, form }: FieldProps) => (
                <AccountDropdown
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
          <Button
            onClick={() => requestFunds(recipientAddress)}
            disabled={Object.keys(recipientAddress).length === 0}
            style={{ width: '100%' }}
          >
            {translate('REQUEST')}
          </Button>
          <Divider />
          {translate('FAUCET_NOT_SURE')}{' '}
          <NewTabLink href="https://support.mycrypto.com/how-to/getting-started/where-to-get-testnet-ether">
            {translate('LEARN_MORE')}{' '}
            <LearnMoreArrowWrapper>
              <LearnMoreArrow icon="backArrow" />
            </LearnMoreArrowWrapper>
          </NewTabLink>
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
          <img
            style={{ width: '50%' }}
            src={`data:image/svg+xml;base64,${Buffer.from(challenge.challenge).toString('base64')}`}
          />
        </div>
      )}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '70%' }}>
          <Input
            value={solution}
            type="number"
            onChange={(e) => {
              setSolution(e.target.value);
            }}
          />
        </div>
        <Button
          style={{ flex: 1 }}
          onClick={() => finalizeRequestFunds(solution)}
          disabled={!possibleSolution(solution)}
        >
          Solve
        </Button>
      </div>
    </>,
    <>{'hash' in txResult && <p>{txResult.hash}</p>}</>
  ];

  return (
    <ExtendedContentPanel
      heading={translateRaw('FAUCET')}
      icon={receiveIcon}
      onBack={() => history.push(ROUTE_PATHS.DASHBOARD.path)}
      stepper={{ current: step + 1, total: steps.length }}
      width="750px"
    >
      {error ? (
        <>
          <Divider />
          <Error type={error} />
        </>
      ) : (
        steps[step]
      )}
    </ExtendedContentPanel>
  );
}

export default withRouter(Faucet);
