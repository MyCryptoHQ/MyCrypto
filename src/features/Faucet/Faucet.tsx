import React, { useContext, useState } from 'react';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import { Heading, Tooltip, Input, Icon } from '@mycrypto/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { utils } from 'ethers';

import {
  Button,
  ExtendedContentPanel,
  AccountDropdown,
  NewTabLink,
  InlineMessage,
  TxReceipt
} from '@components';
import { StoreContext } from '@services/Store';
import { AssetContext, getBaseAssetByNetwork } from '@services';
import { noOp } from '@utils';
import {
  Asset,
  IAccount as IIAccount,
  StoreAccount,
  InlineMessageType,
  ITxType,
  ITxStatus
} from '@types';
import { ROUTE_PATHS, KB_HELP_ARTICLE, getKBHelpArticle } from '@config';
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

const NoTestnetAccounts = styled(InlineMessage)`
  margin-bottom: 10px;
`;

const faucetNetworks = ['Ropsten', 'Rinkeby', 'Kovan', 'Goerli'];

export function Faucet({ history }: RouteComponentProps<{}>) {
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState({} as any);
  const [solution, setSolution] = useState('');
  const [txResult, setTxResult] = useState({} as any);
  const [error, setError] = useState('');

  const { accounts, networks } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);

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

  const txConfig = (() => {
    if (!('hash' in txResult)) {
      return {} as any;
    } else {
      const network: any = networks.find((n) => n.id === 'Ropsten');
      const baseAsset: Asset | undefined = getBaseAssetByNetwork({
        network,
        assets
      });
      return {
        rawTransaction: {
          to: txResult.to,
          value: utils.bigNumberify(txResult.value).toString(),
          gasLimit: utils.bigNumberify(txResult.gasLimit).toString(),
          data: txResult.data,
          gasPrice: utils.bigNumberify(txResult.gasPrice).toString(),
          nonce: txResult.nonce.toString(),
          chainId: txResult.chainId,
          from: txResult.from
        },
        amount: utils.formatEther(utils.bigNumberify(txResult.value).toString()),
        receiverAddress: txResult.to,
        senderAccount: validAccounts[0],
        from: txResult.from,
        asset: baseAsset,
        baseAsset,
        network,
        gasPrice: utils.bigNumberify(txResult.gasPrice).toString(),
        gasLimit: utils.bigNumberify(txResult.gasLimit).toString(),
        nonce: txResult.nonce.toString(),
        data: txResult.data,
        value: utils.bigNumberify(txResult.value).toString()
      };
    }
  })();

  const txReceipt = (() => {
    if (!('hash' in txResult)) {
      return {} as any;
    } else {
      const network: any = networks.find((n) => n.id === 'Ropsten');
      const baseAsset: Asset | undefined = getBaseAssetByNetwork({
        network,
        assets
      });
      return {
        asset: baseAsset,
        baseAsset,
        txType: ITxType.FAUCET,
        status: ITxStatus.BROADCASTED,
        receiverAddress: txResult.to,
        amount: utils.formatEther(utils.bigNumberify(txResult.value).toString()),
        data: txResult.data,
        gasPrice: utils.bigNumberify(txResult.gasPrice),
        gasLimit: utils.bigNumberify(txResult.gasLimit),
        to: txResult.to,
        from: txResult.from,
        value: utils.bigNumberify(txResult.value),
        nonce: txResult.nonce.toString(),
        hash: txResult.hash
      };
    }
  })();

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
          {validAccounts.length === 0 && (
            <NoTestnetAccounts type={InlineMessageType.ERROR}>
              {translate('FAUCET_NO_ACCOUNTS', {
                $link_add_account: ROUTE_PATHS.ADD_ACCOUNT.path,
                $link_create_account: ROUTE_PATHS.CREATE_WALLET.path
              })}
            </NoTestnetAccounts>
          )}
          <Button
            onClick={() => requestFunds(recipientAddress)}
            disabled={Object.keys(recipientAddress).length === 0}
            style={{ width: '100%' }}
          >
            {translate('REQUEST')}
          </Button>
          <Divider />
          {translate('FAUCET_NOT_SURE')}{' '}
          <NewTabLink href={getKBHelpArticle(KB_HELP_ARTICLE.WHERE_TO_GET_TESTNET_ETHER)}>
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
    <>
      {'hash' in txResult && (
        <TxReceipt
          txConfig={txConfig}
          txReceipt={txReceipt}
          onComplete={() => reset()}
          resetFlow={() => reset()}
          completeButtonText={translateRaw('FAUCET_REQUEST_MORE')}
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
