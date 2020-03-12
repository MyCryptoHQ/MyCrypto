import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { convertToFiat, isWeb3Wallet } from 'v2/utils';
import { RatesContext } from 'v2/services';
import { IAccount, IFormikFields } from 'v2/types';
import { COLORS } from 'v2/theme';
import { Amount } from 'v2/components';
import { translateRaw } from 'v2/translations';

import { IWithProtectApi } from '../types';
import { ProtectTransactionUtils } from '../utils';
import ProtectedTransactionBase from './ProtectedTransactionBase';
import CloseIcon from './icons/CloseIcon';
import ProtectIcon from './icons/ProtectIcon';
import WarningIcon from './icons/WarningIcon';

import feeIcon from 'assets/images/icn-fee.svg';

const ProtectionThisTransactionStyled = styled(ProtectedTransactionBase)`
  .description-text {
    max-width: 300px;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 16px;
  }

  .description-text-danger {
    color: ${COLORS.PASTEL_RED};
  }

  .description-text-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 300px;

    > svg {
      display: flex;
      align-self: flex-start;
    }

    > .description-text-danger {
      max-width: 260px;
      padding-left: 16px;
      text-align: left;
    }
  }

  .send-with-confidence {
    margin: 0 0 15px;
  }

  .protect-transaction {
    width: 280px;
    margin: 12px 0 16px;
  }

  .cancel {
    background: none;
    border: none;
    color: ${COLORS.BLUE_BRIGHT};
    text-align: center;
  }
`;

const BulletList = styled.ul`
  li {
    padding-left: 10px;
    margin-left: -10px;
    margin-bottom: 15px;
    background-image: url('~assets/images/icn-bullet.svg');
    background-position: 0 10px;
    background-size: 5px 5px;
    background-repeat: no-repeat;
    text-align: left;
    max-width: 280px;

    &:last-child {
      margin-bottom: 16px;
    }

    h6 {
      color: ${COLORS.PURPLE};
      margin: 0;
      font-size: 14px;
      line-height: 24px;
      text-transform: uppercase;
    }

    p {
      font-size: 14px;
      line-height: 24px;
    }
  }
`;

const FeeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 300px;
  font-size: 16px;
  line-height: 24px;

  img {
    height: 23px;
    width: 24px;
  }

  .fee-label {
    flex: 0 0 140px;
    max-width: 140px;
    padding-left: 10px;
    margin-bottom: 0;
    text-align: left;
  }
`;

interface ProtectionThisTransactionProps extends IWithProtectApi {
  sendAssetsValues: IFormikFields | null;
  handleProtectedTransactionSubmit(payload: IFormikFields): Promise<void>;
}

export const ProtectionThisTransaction: FC<ProtectionThisTransactionProps> = ({
  sendAssetsValues,
  withProtectApi,
  handleProtectedTransactionSubmit
}) => {
  const { getAssetRate } = useContext(RatesContext);

  const [isLoading, setIsLoading] = useState(false);

  const [feeAmount, setFeeAmount] = useState<{
    amount: number | null;
    fee: number | null;
    rate: number | null;
  }>({ amount: null, fee: null, rate: null });

  const {
    withProtectState: { isWeb3Wallet: web3Wallet, web3WalletName },
    showHideTransactionProtection,
    goOnNextStep,
    setReceiverInfo,
    setWeb3Wallet
  } = withProtectApi!;

  useEffect(() => {
    const {
      account: { wallet: walletId }
    } = sendAssetsValues as { account: IAccount };
    setWeb3Wallet(walletId && isWeb3Wallet(walletId), walletId);
  }, [sendAssetsValues]);

  useEffect(() => {
    const { asset } = sendAssetsValues!;
    const rate = getAssetRate(asset);

    const { amount, fee } = ProtectTransactionUtils.getProtectTransactionFee(
      sendAssetsValues!,
      rate
    );

    setFeeAmount({ amount, fee, rate: rate ? rate : null });
  }, [sendAssetsValues, getAssetRate, setFeeAmount]);

  const onProtectMyTransactionClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        await setReceiverInfo(sendAssetsValues!.address.value, sendAssetsValues!.network.id);
        await handleProtectedTransactionSubmit({
          ...sendAssetsValues!,
          amount: feeAmount.amount ? feeAmount.amount.toString() : ''
        });
        setIsLoading(false);
        goOnNextStep();
      } catch (e) {
        console.error(e);
      }
    },
    [feeAmount, setIsLoading]
  );

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (showHideTransactionProtection) {
        showHideTransactionProtection(false);
      }
    },
    []
  );

  const getAssetValue = useCallback(() => {
    if (feeAmount.amount === null || feeAmount.fee === null) return '--';
    return `${parseFloat((feeAmount.amount + feeAmount.fee).toString()).toFixed(6)} ETH`;
  }, [feeAmount]);

  const getFiatValue = useCallback(() => {
    if (feeAmount.amount === null || feeAmount.fee === null || feeAmount.rate === null) return '--';
    return `$${convertToFiat(
      parseFloat((feeAmount.amount + feeAmount.fee).toString()),
      feeAmount.rate
    ).toFixed(2)}`;
  }, [feeAmount]);

  return (
    <ProtectionThisTransactionStyled>
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      <h4>{translateRaw('PROTECTED_TX_PROTECT_THIS_TRANSACTION')}</h4>
      <h5>{translateRaw('PROTECTED_TX_PROTECT_THIS_TRANSACTION_DESC')}</h5>
      <BulletList>
        <li>
          <h6>{translateRaw('PROTECTED_TX_SCAN_PARTNER_DB')}</h6>
          <span>{translateRaw('PROTECTED_TX_SCAN_PARTNER_DB_DESC')}</span>
        </li>
        <li>
          <h6>{translateRaw('PROTECTED_TX_SCAN_ACCOUNT_BALANCE')}</h6>
          <span>{translateRaw('PROTECTED_TX_SCAN_ACCOUNT_BALANCE_DESC')}</span>
        </li>
        <li>
          <h6>{translateRaw('PROTECTED_TX_SCAN_LATEST_TX')}</h6>
          <span>{translateRaw('PROTECTED_TX_SCAN_LATEST_TX_DESC')}</span>
        </li>
        <li>
          <h6>{translateRaw('PROTECTED_TX_SCAN_COMMENTS')}</h6>
          <span>{translateRaw('PROTECTED_TX_SCAN_COMMENTS_DESC')}</span>
        </li>
      </BulletList>
      {web3Wallet && (
        <div className="description-text-wrapper">
          <WarningIcon />
          <p className="description-text description-text-danger">
            {translateRaw('PROTECTED_TX_WEB3_WALLET_DESC', { $web3WalletName: web3WalletName! })}
          </p>
        </div>
      )}
      {!web3Wallet && (
        <p className="description-text">{translateRaw('PROTECTED_TX_NOT_WEB3_WALLET_DESC')}</p>
      )}
      <hr />
      <h4 className="send-with-confidence">{translateRaw('PROTECTED_TX_SEND_WITH_CONFIDENCE')}</h4>
      <FeeContainer>
        <img src={feeIcon} alt="Fee" />
        <p className="fee-label">{translateRaw('PROTECTED_TX_FEE')}</p>
        <Amount assetValue={getAssetValue()} fiatValue={getFiatValue()} />
      </FeeContainer>
      <Button
        type="button"
        className={`protect-transaction ${isLoading ? 'loading' : ''}`}
        onClick={onProtectMyTransactionClick}
        disabled={isLoading}
      >
        {translateRaw('PROTECTED_TX_PROTECT_MY_TX')}
      </Button>
      <button type="button" className="cancel" onClick={onProtectMyTransactionCancelClick}>
        {translateRaw('PROTECTED_TX_DONT_PROTECT_MY_TX')}
      </button>
    </ProtectionThisTransactionStyled>
  );
};
