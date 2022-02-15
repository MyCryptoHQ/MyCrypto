import { useEffect } from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useFormik } from 'formik';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { Overwrite } from 'utility-types';
import { number, object } from 'yup';

import {
  AccountSelector,
  AmountInput,
  Box,
  Button,
  DemoGatewayBanner,
  InlineMessage,
  Label,
  OptionType,
  TextSelector,
  Tooltip
} from '@components';
import { ETHUUID } from '@config';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';
import { fetchUniversalGasPriceEstimate } from '@services/ApiService';
import { getNonce } from '@services/EthService';
import { useAssets, useNetworks } from '@services/Store';
import { isEthereumAccount } from '@services/Store/Account/helpers';
import { AppState, getDefaultAccount, getIsDemoMode, getStoreAccounts, useSelector } from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  Asset,
  ExtendedAsset,
  IAccount,
  ISimpleTxFormFull,
  MigrationType,
  Network,
  StoreAccount
} from '@types';
import { isFormValid as checkFormValid, noOp } from '@utils';

import { MIGRATION_CONFIGS } from '../config';

export interface TokenMigrationProps extends ISimpleTxFormFull {
  isSubmitting: boolean;
  error?: Error;
  migration: MigrationType;
  changeMigration(migration: MigrationType): void;
  onComplete(fields: any): void;
  handleUserInputFormSubmit(fields: any): void;
}

interface UIProps {
  network: Network;
  relevantAccounts: StoreAccount[];
  storeDefaultAccount?: StoreAccount;
  defaultAsset: ExtendedAsset;
  isSubmitting: boolean;
  error?: CustomError;
  migration: MigrationType;
  isDemoMode: boolean;
  changeMigration(migration: MigrationType): void;
  onComplete(fields: any): void;
}

const FormFieldSubmitButton = styled(Button)`
  width: 100%;
  display: inline-block;
  &:disabled {
    background-color: rgba(0, 122, 153, 0.3);
  }
`;

const TokenMigrationForm = ({
  migration,
  isSubmitting,
  error,
  isDemoMode,
  changeMigration,
  onComplete
}: Props) => {
  const accounts = useSelector(getStoreAccounts);
  const { networks } = useNetworks();
  const { getAssetByUUID } = useAssets();
  const network = networks.find((n) => n.baseAsset === ETHUUID) as Network;
  const defaultStoreAccount = useSelector(getDefaultAccount());
  const relevantAccounts = accounts.filter(isEthereumAccount);
  const tokenMigrationConfig = MIGRATION_CONFIGS[migration];
  const defaultAsset = (getAssetByUUID(tokenMigrationConfig.fromAssetUuid) ?? {}) as Asset;
  const defaultAccount = accounts.find((a) =>
    a.assets.find(({ uuid }) => uuid === tokenMigrationConfig.fromAssetUuid)
  );
  return (
    <TokenMigrationFormUI
      isSubmitting={isSubmitting}
      network={network}
      relevantAccounts={relevantAccounts}
      storeDefaultAccount={defaultAccount ?? defaultStoreAccount}
      defaultAsset={defaultAsset}
      error={error}
      migration={migration}
      changeMigration={changeMigration}
      onComplete={onComplete}
      isDemoMode={isDemoMode}
    />
  );
};

export const TokenMigrationFormUI = ({
  isSubmitting,
  error,
  network,
  relevantAccounts,
  storeDefaultAccount,
  defaultAsset,
  migration,
  onComplete,
  changeMigration,
  isDemoMode
}: UIProps) => {
  const getInitialFormikValues = (
    storeDefaultAcc?: StoreAccount
  ): Overwrite<ISimpleTxFormFull, { account?: StoreAccount }> => ({
    account: storeDefaultAcc,
    amount: '0',
    asset: defaultAsset,
    nonce: '0',
    gasPrice: '20',
    address: '',
    gasLimit: '',
    network,
    maxFeePerGas: '20',
    maxPriorityFeePerGas: '1'
  });

  const filteredAccounts = getAccountsWithAssetBalance(relevantAccounts, defaultAsset, '0.001');
  const TokenMigrationFormSchema = object().shape({
    amount: number()
      .min(0, translateRaw('ERROR_0'))
      .required(translateRaw('REQUIRED'))
      .typeError(translateRaw('ERROR_0'))
  });

  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormik({
    initialValues: getInitialFormikValues(storeDefaultAccount),
    enableReinitialize: true,
    validationSchema: TokenMigrationFormSchema,
    onSubmit: noOp
  });
  const { amount, asset, account: selectedAccount } = values;

  const tokenMigrationConfig = MIGRATION_CONFIGS[migration];

  useEffect(() => {
    if (!values.account) return;
    const accountAssetAmt = values.account.assets.find(
      (a: Asset) => a.uuid === tokenMigrationConfig.fromAssetUuid
    );
    if (!accountAssetAmt || !asset.decimal) {
      return;
    }
    setFieldValue('amount', formatUnits(BigNumber.from(accountAssetAmt.balance), asset.decimal)); // this would be better as a reducer imo.
    setFieldValue('account', values.account); //if this gets deleted, it no longer shows as selected on interface, would like to set only object keys that are needed instead of full object

    handleNonceEstimate(values.account);
  }, [values.account, values.asset]);

  const handleNonceEstimate = async (account: IAccount) => {
    const nonce: number = await getNonce(values.network, account.address);
    setFieldValue('nonce', nonce);
  };

  useEffect(() => {
    if (
      amount &&
      asset &&
      selectedAccount &&
      !getAccountsWithAssetBalance(filteredAccounts, defaultAsset, amount).find(
        (a) => a.uuid === selectedAccount.uuid
      )
    ) {
      setFieldValue('account', undefined);
    }
  }, [amount, asset]);

  const isFormValid = checkFormValid(errors);

  const handleSubmit = () => {
    if (isFormValid) {
      fetchUniversalGasPriceEstimate(values.network, values.account)
        .then(({ estimate: gas }) => {
          onComplete({ ...values, ...gas });
        })
        .catch(console.error);
    }
  };

  const migrationOptions = Object.values(MigrationType).map((m) => ({
    label: m.toString(),
    value: m
  }));
  const migrationValue = migrationOptions.find((m) => m.value === migration);

  const handleMigrationChange = (option: OptionType<MigrationType>) =>
    changeMigration(option.value);

  return (
    <>
      {isDemoMode && <DemoGatewayBanner />}
      <Box mb={SPACING.LG}>
        <Label htmlFor="text-selector">{translate('SELECT_A_MIGRATION')}</Label>
        <TextSelector
          value={migrationValue!}
          options={migrationOptions}
          onChange={handleMigrationChange}
        />
      </Box>
      <Box mb={SPACING.LG}>
        <Label htmlFor="account">{translate('SELECT_YOUR_ACCOUNT')}</Label>
        <AccountSelector
          name={'account'}
          value={values.account || null}
          accounts={filteredAccounts}
          asset={values.asset}
          onSelect={(option: IAccount) => {
            setFieldValue('account', option);
          }}
        />
        {filteredAccounts.length === 0 && (
          <InlineMessage>{translateRaw('NO_RELEVANT_ACCOUNTS')}</InlineMessage>
        )}
      </Box>
      <Box mb={SPACING.LG} display="flex" flexDirection="column">
        <Tooltip tooltip={tokenMigrationConfig.formAmountTooltip}>
          <Label htmlFor="amount">{translate('SEND_ASSETS_AMOUNT_LABEL')}</Label>
        </Tooltip>
        <AmountInput
          disabled={true}
          asset={values.asset}
          value={values.amount || '0'}
          onChange={noOp}
          onBlur={() => {
            setFieldTouched('amount');
          }}
          placeholder={'0.00'}
        />
        {errors && errors.amount && touched && touched.amount ? (
          <InlineMessage className="SendAssetsForm-errors">{errors.amount}</InlineMessage>
        ) : null}
      </Box>
      <FormFieldSubmitButton
        type="submit"
        loading={isSubmitting}
        onClick={handleSubmit}
        disabled={!isFormValid || isDemoMode}
        data-testid="confirm-migrate"
      >
        {tokenMigrationConfig.formActionBtn}
      </FormFieldSubmitButton>
      {error && (
        <InlineMessage
          value={translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', {
            $error: error.reason ? error.reason : error.message
          })}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & TokenMigrationProps;

export default connector(TokenMigrationForm);
