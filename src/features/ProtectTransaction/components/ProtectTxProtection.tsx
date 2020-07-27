import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';

import { isWeb3Wallet as checkIsWeb3Wallet } from '@utils';
import { RatesContext, StoreContext, SettingsContext } from '@services';
import { IAccount, IFormikFields, Fiat } from '@types';
import { COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';
import { Amount, Button, PoweredByText } from '@components';
import { translateRaw } from '@translations';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { getFiat } from '@config/fiats';

import { getProtectTxFee, checkFormForProtectTxErrors } from '../utils';
import ProtectTxBase from './ProtectTxBase';
import CloseIcon from '@components/icons/CloseIcon';
import ProtectIcon from '@components/icons/ProtectIcon';
import WarningIcon from '@components/icons/WarningIcon';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';

import feeIcon from '@assets/images/icn-fee.svg';
import { ProtectTxContext, IFeeAmount } from '../ProtectTxProvider';
import { ProtectTxError } from '..';
import { ProtectTxMissingInfo } from './ProtectTxMissingInfo';

import bulletIcon from 'assets/images/icn-bullet.svg';

const SProtectionThisTransaction = styled(ProtectTxBase)`
  svg:nth-of-type(2) {
    height: 100%;
    max-height: 73px;
  }

  .description-text {
    max-width: 300px;
    font-size: ${FONT_SIZE.BASE};
    line-height: ${LINE_HEIGHT.XL};
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
    list-style-type: none;
    padding-left: ${SPACING.SM};
    margin-left: -${SPACING.SM};
    margin-bottom: 15px;
    background-image: url(${bulletIcon});
    background-position: 0 ${SPACING.SM};
    background-size: 5px 5px;
    background-repeat: no-repeat;
    text-align: left;
    max-width: 280px;
    font-weight: 400;

    &:last-child {
      margin-bottom: 16px;
    }

    h6 {
      color: ${COLORS.PURPLE};
      margin: 0;
      font-size: ${FONT_SIZE.SM};
      line-height: ${LINE_HEIGHT.XL};
      text-transform: uppercase;
    }

    p {
      font-size: 14px;
      line-height: ${LINE_HEIGHT.XL};
    }
  }
`;

const FeeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 300px;
  font-size: ${FONT_SIZE.BASE};
  line-height: ${LINE_HEIGHT.XL};

  img {
    height: 23px;
    width: 24px;
  }

  && svg {
    height: 23px;
    width: 24px;
  }

  &:nth-of-type(2) {
    margin-top: ${SPACING.SM};
  }

  .fee-label {
    flex: 0 0 140px;
    min-width: 140px;
    max-width: 140px;
    padding-left: ${SPACING.SM};
    margin-bottom: 0;
    text-align: left;
  }
`;

const Header = styled.h4`
  display: flex;
  align-items: center;

  && {
    svg {
      margin-right: ${SPACING.XS};
    }
  }
`;

const PoweredByWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: flex-end;
`;

interface Props {
  handleProtectTxSubmit(payload: IFormikFields): Promise<void>;
}

export const ProtectTxProtection: FC<Props> = ({ handleProtectTxSubmit }) => {
  const { getAssetRate } = useContext(RatesContext);
  const { isMyCryptoMember } = useContext(StoreContext);
  const { settings } = useContext(SettingsContext);

  const [isLoading, setIsLoading] = useState(false);

  const {
    state: { isWeb3Wallet: web3Wallet, web3WalletName, formValues: sendAssetsValues, feeAmount },
    setFeeAmount,
    setReceiverInfo,
    setWeb3Wallet,
    showHideProtectTx
  } = useContext(ProtectTxContext);

  useEffect(() => {
    const {
      account: { wallet: walletId }
    } = sendAssetsValues as { account: IAccount };
    setWeb3Wallet(walletId && checkIsWeb3Wallet(walletId), walletId);
  }, [sendAssetsValues]);

  useEffect(() => {
    const { asset } = sendAssetsValues!;
    const rate = getAssetRate(asset);

    const { amount, fee } = getProtectTxFee(sendAssetsValues!, rate);

    setFeeAmount({ amount, fee, rate: rate ? rate : null });
  }, [sendAssetsValues, getAssetRate]);

  const onProtectMyTransactionClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        await setReceiverInfo(sendAssetsValues!.address.value, sendAssetsValues!.network);
        await handleProtectTxSubmit({
          ...sendAssetsValues!,
          amount: feeAmount.amount ? feeAmount.amount.toFixed(DEFAULT_ASSET_DECIMAL) : ''
        });
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    },
    [feeAmount, setIsLoading]
  );

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (showHideProtectTx) {
        showHideProtectTx(false);
      }
    },
    []
  );

  const error =
    sendAssetsValues !== undefined &&
    checkFormForProtectTxErrors(
      sendAssetsValues,
      getAssetRate(sendAssetsValues.asset),
      isMyCryptoMember
    );

  return (
    <ProtectTxProtectionUI
      error={error}
      fiat={getFiat(settings)}
      feeAmount={feeAmount}
      isLoading={isLoading}
      isMyCryptoMember={isMyCryptoMember}
      onProtect={onProtectMyTransactionClick}
      onCancel={onProtectMyTransactionCancelClick}
      web3Wallet={{ isWeb3Wallet: web3Wallet, name: web3WalletName }}
    />
  );
};

export interface UIProps {
  error: ProtectTxError | false;
  fiat: Fiat;
  feeAmount: IFeeAmount;
  isMyCryptoMember: boolean;
  isLoading: boolean;
  web3Wallet: { isWeb3Wallet: boolean; name: string | null };
  onCancel(e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>): void;
  onProtect(e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>): void;
}

export const ProtectTxProtectionUI = ({
  error,
  feeAmount,
  fiat,
  isLoading,
  isMyCryptoMember,
  web3Wallet,
  onCancel,
  onProtect
}: UIProps) => {
  const getAssetValue = (amount: BigNumber | null) => {
    if (amount === null) return '--';
    return `${amount.toFixed(6)} ETH`;
  };

  const getFiatValue = useCallback(
    (amount: BigNumber | null) => {
      if (amount === null || feeAmount.rate === null) return '--';
      return amount.multipliedBy(feeAmount.rate).toFixed(2);
    },
    [feeAmount]
  );

  const { isWeb3Wallet, name } = web3Wallet;

  const hasError = error !== ProtectTxError.NO_ERROR;
  const hasMissingInfoError = error === ProtectTxError.INSUFFICIENT_DATA;

  return (
    <SProtectionThisTransaction>
      <CloseIcon size="md" onClick={onCancel} />
      {hasMissingInfoError && (
        <>
          <ProtectTxMissingInfo />
          <hr />
        </>
      )}
      {!hasMissingInfoError && <ProtectIcon size="lg" />}
      <Header>
        {hasMissingInfoError && <ProtectIcon size="sm" />}
        {translateRaw('PROTECTED_TX_PROTECT_THIS_TRANSACTION')}
      </Header>
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
      {isWeb3Wallet && (
        <div className="description-text-wrapper">
          <WarningIcon />
          <p className="description-text description-text-danger">
            {translateRaw('PROTECTED_TX_WEB3_WALLET_DESC', { $web3WalletName: name! })}
          </p>
        </div>
      )}
      {!isWeb3Wallet && (
        <p className="description-text">{translateRaw('PROTECTED_TX_NOT_WEB3_WALLET_DESC')}</p>
      )}
      {!hasMissingInfoError && !isMyCryptoMember && (
        <>
          <hr />
          <h4 className="send-with-confidence">
            {translateRaw('PROTECTED_TX_SEND_WITH_CONFIDENCE')}
          </h4>
          <FeeContainer>
            <ProtectIconCheck size="sm" />
            <p className="fee-label">{translateRaw('PROTECTED_TX_PRICE')}</p>
            <Amount
              assetValue={getAssetValue(feeAmount.amount)}
              fiat={{ symbol: fiat.symbol, amount: getFiatValue(feeAmount.amount) }}
            />
          </FeeContainer>
          <FeeContainer>
            <img src={feeIcon} alt="Fee" />
            <p className="fee-label">{translateRaw('PROTECTED_TX_FEE')}</p>
            <Amount
              assetValue={getAssetValue(feeAmount.fee)}
              fiat={{ symbol: fiat.symbol, amount: getFiatValue(feeAmount.fee) }}
            />
          </FeeContainer>
        </>
      )}
      <Button
        type="button"
        className={`protect-transaction ${isLoading ? 'loading' : ''}`}
        onClick={onProtect}
        disabled={isLoading || hasError}
      >
        {translateRaw('PROTECTED_TX_PROTECT_MY_TX')}
      </Button>
      <button type="button" className="cancel" onClick={onCancel}>
        {translateRaw('PROTECTED_TX_DONT_PROTECT_MY_TX')}
      </button>
      <PoweredByWrapper>
        <PoweredByText provider="NANSEN" />
      </PoweredByWrapper>
    </SProtectionThisTransaction>
  );
};
