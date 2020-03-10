import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@mycrypto/ui';
import { convertToFiat, isWeb3Wallet } from '../../../utils';
import { ProtectTransactionUtils } from '../utils';
import { RatesContext } from '../../../services';
import { IAccount, IFormikFields } from '../../../types';
import { COLORS } from '../../../theme';
import { IWithProtectApi } from '../types';

import ProtectedTransactionBase from './ProtectedTransactionBase';
import { Amount } from '../../../components';
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
      <h4>Protect This Transaction</h4>
      <h5>Send your transaction with confidence by learning about who you're sending to:</h5>
      <BulletList>
        <li>
          <h6>SCAN OUR PARTNER DATABASES</h6>
          <span>We'll let you know if the recipient account is known anywhere.</span>
        </li>
        <li>
          <h6>RECIPIENT’S ACCOUNT BALANCE</h6>
          <span>How much does the account hold?</span>
        </li>
        <li>
          <h6>RECIPIENT’S LATEST TRANSACTION</h6>
          <span>How active is the account?</span>
        </li>
        <li>
          <h6>LINK TO BLOCK EXPLORER COMMENTS</h6>
          <span>If the account is malicious, there will oftentimes be user comments.</span>
        </li>
      </BulletList>
      {web3Wallet && (
        <div className="description-text-wrapper">
          <WarningIcon />
          <p className="description-text description-text-danger">
            Due to technical limitations, the 20 second cancellation timer is unavailable for
            transactions using
            {` ${web3WalletName} `}
            and other Web 3 providers.
          </p>
        </div>
      )}
      {!web3Wallet && (
        <p className="description-text">
          Once you confirm and sign the transaction, you'll have 20 seconds to cancel sending if you
          change your mind. Still not convinced? Learn more.
        </p>
      )}
      <hr />
      <h4 className="send-with-confidence">Send with Confidence</h4>
      <FeeContainer>
        <img src={feeIcon} alt="Fee" />
        <p className="fee-label">Protected Transaction Fee:</p>
        <Amount assetValue={getAssetValue()} fiatValue={getFiatValue()} />
      </FeeContainer>
      <Button
        type="button"
        className={`protect-transaction ${isLoading ? 'loading' : ''}`}
        onClick={onProtectMyTransactionClick}
        disabled={isLoading}
      >
        Protect My Transaction
      </Button>
      <button type="button" className="cancel" onClick={onProtectMyTransactionCancelClick}>
        I don't want to protect my transaction.
      </button>
    </ProtectionThisTransactionStyled>
  );
};
