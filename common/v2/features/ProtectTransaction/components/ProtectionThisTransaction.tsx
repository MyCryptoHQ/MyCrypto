import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import { Button } from '@mycrypto/ui';
import { IFormikFields } from '../../../types';
import { ProtectTransactionUtils } from '../utils';
import { Amount } from '../../../components';
import { convertToFiat } from '../../../utils';
import { RatesContext } from '../../../services';

import './ProtectionThisTransaction.scss';

import ProtectIcon from './icons/ProtectIcon';
import feeIcon from 'assets/images/icn-fee.svg';
import { WithProtectApiFactory } from '../withProtectStateFactory';

export const ProtectionThisTransaction: FC<{
  withProtectApi: WithProtectApiFactory;
  sendAssetsValues: IFormikFields | null;
  handleProtectedTransactionSubmit(payload: IFormikFields): Promise<void>;
}> = ({ sendAssetsValues, withProtectApi, handleProtectedTransactionSubmit }) => {
  const { getAssetRate } = useContext(RatesContext);

  const [isLoading, setIsLoading] = useState(false);

  const [feeAmount, setFeeAmount] = useState<{
    amount: number | null;
    fee: number | null;
    rate: number | null;
  }>({ amount: null, fee: null, rate: null });

  const { showHideTransactionProtection, goOnNextStep, setReceiverAddress } = withProtectApi;

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
        await setReceiverAddress(sendAssetsValues!.address.value);
        await handleProtectedTransactionSubmit({
          ...sendAssetsValues!,
          amount: feeAmount.amount ? feeAmount.amount.toString() : ''
        });
        goOnNextStep();
        setIsLoading(false);
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
    <div className="ProtectionThisTransaction">
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      <h4 className="ProtectionThisTransaction-title">Protect This Transaction</h4>
      <h5 className="ProtectionThisTransaction-subtitle">
        Send your transaction with confidence by learning about who you're sending to:
      </h5>
      <ul>
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
      </ul>
      <p className="ProtectionThisTransaction-confirm-text">
        Once you confirm and sign the transaction, you'll have 20 seconds to cancel sending if you
        change your mind. Still not convinced? Learn more.
      </p>
      <hr />
      <h4 className="ProtectionThisTransaction-title ProtectionThisTransaction-send-with-confidence">
        Send with Confidence
      </h4>
      <div className="ProtectionThisTransaction-fee">
        <img src={feeIcon} alt="Fee" />
        <p className="fee-label">Protected Transaction Fee:</p>
        <Amount assetValue={getAssetValue()} fiatValue={getFiatValue()} />
      </div>
      <Button
        type="button"
        className={`ProtectionThisTransaction-protect-transaction ${isLoading ? 'loading' : ''}`}
        onClick={onProtectMyTransactionClick}
      >
        Protect My Transaction
      </Button>
      <button
        type="button"
        className="ProtectionThisTransaction-cancel"
        onClick={onProtectMyTransactionCancelClick}
      >
        I don't want to protect my transaction.
      </button>
    </div>
  );
};
