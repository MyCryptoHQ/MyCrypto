import { useEffect, useReducer } from 'react';

import { createSignConfirmAndReceiptSteps } from '@components';
import { default as GeneralStepper, IStepperPath } from '@components/GeneralStepper';
import { ROUTE_PATHS } from '@config';
import { getAccountsWithAssetBalance } from '@features/SwapAssets/helpers';
import { useTxMulti } from '@hooks';
import { getAssets, getStoreAccounts, useSelector } from '@store';
import { translateRaw } from '@translations';
import { ITokenMigrationFormFull, ITxStatus, MigrationType, TokenMigrationState } from '@types';

import ConfirmTokenMigration from './components/TokenMigrationConfirm';
import TokenMigrationForm from './components/TokenMigrationForm';
import ConfirmTokenMigrationMultiTx from './components/TokenMigrationMultiTx';
import TokenMigrationReceipt from './components/TokenMigrationReceipt';
import { MIGRATION_CONFIGS } from './config';
import { tokenMigrationReducer } from './TokenMigrationStepper.reducer';

const TokenMigrationStepper = () => {
  const accounts = useSelector(getStoreAccounts);
  const assets = useSelector(getAssets);

  const defaultMigration = Object.values(MigrationType).find((migration) => {
    const config = MIGRATION_CONFIGS[migration];
    const asset = assets.find((a) => a.uuid === config.fromAssetUuid);
    const filteredAccounts = asset && getAccountsWithAssetBalance(accounts, asset, '0.001');
    return filteredAccounts && filteredAccounts.length > 0;
  });

  const [reducerState, dispatch] = useReducer(tokenMigrationReducer, {
    migration: MigrationType.REP
  });

  useEffect(() => {
    if (defaultMigration) {
      handleMigrationChange(defaultMigration);
    }
  }, [defaultMigration]);

  const { state, prepareTx, sendTx, stopYield, initWith } = useTxMulti();
  const { canYield, isSubmitting, transactions, error } = state;
  const { account, amount, migration }: TokenMigrationState = reducerState;

  const tokenMigrationConfig = MIGRATION_CONFIGS[migration];

  const handleMigrationChange = (payload: MigrationType) =>
    dispatch({ type: tokenMigrationReducer.actionTypes.SELECT_MIGRATION, payload });

  const steps: IStepperPath[] = [
    {
      label: translateRaw('TOKEN_MIGRATION_HEADER'),
      component: TokenMigrationForm,
      props: {
        changeMigration: handleMigrationChange,
        migration,
        account,
        isSubmitting,
        error
      },
      actions: (formData: ITokenMigrationFormFull) => {
        initWith(
          () => {
            const txs = tokenMigrationConfig.txConstructionConfigs.map((txConstructionConfig) => ({
              ...txConstructionConfig.constructTxFn(formData),
              txType: txConstructionConfig.txType,
              metadata: { receivingAsset: tokenMigrationConfig.toAssetUuid }
            }));
            return Promise.resolve(txs);
          },
          formData.account,
          formData.account.network
        );
        dispatch({ type: tokenMigrationReducer.actionTypes.FORM_SUBMIT, payload: formData });
      }
    },
    ...createSignConfirmAndReceiptSteps({
      transactions,
      backStepTitle: translateRaw('TOKEN_MIGRATION_HEADER'),
      amount: amount!,
      account: account!,
      error,
      flowConfig: tokenMigrationConfig,
      receiptTitle: tokenMigrationConfig.receiptTitle,
      multiTxTitle: translateRaw('CONFIRM_TRANSACTION'),
      isSubmitting,
      receiptComponent: TokenMigrationReceipt,
      multiTxComponent:
        transactions.length > 1 ? ConfirmTokenMigrationMultiTx : ConfirmTokenMigration,
      sendTx,
      prepareTx
    })
  ];

  return (
    <GeneralStepper
      onRender={(goToNextStep) => {
        // Allows to execute code when state has been updated after MTX hook has run
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!canYield) return;
          // Make sure to prepare ETH tx before showing to user
          if (transactions.length === 1 && transactions[0].status === ITxStatus.PREPARING) {
            prepareTx(transactions[0].txRaw);
          } else {
            // Go to next step after preparing tx for MTX
            goToNextStep();
          }
          stopYield();
        }, [canYield]);
      }}
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={ROUTE_PATHS.DASHBOARD.title}
    />
  );
};
export default TokenMigrationStepper;
