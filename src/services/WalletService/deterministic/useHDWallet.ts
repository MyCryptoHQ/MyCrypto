import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { processScannedAccounts, Wallet } from '@services';
import {
  addCustomDPaths,
  connectHDWallet,
  getAccounts,
  selectHDWalletAccountQueue,
  selectHDWalletAsset,
  selectHDWalletCustomDPaths,
  selectHDWalletIsCompleted,
  selectHDWalletIsConnected,
  selectHDWalletIsConnecting,
  selectHDWalletIsGettingAccounts,
  selectHDWalletNetwork,
  selectHDWalletScannedAccounts,
  triggerComplete,
  updateAsset as updateScannerAsset
} from '@store/hdWallet.slice';
import { DPathFormat, ExtendedAsset, Network } from '@types';

import { ExtendedDPath, IUseHDWallet } from './types';

const useHDWallet = (dpaths: ExtendedDPath[], walletId: DPathFormat, gap: number): IUseHDWallet => {
  const [session, setSession] = useState((undefined as unknown) as Wallet);
  const dispatch = useDispatch();
  const isConnected = useSelector(selectHDWalletIsConnected);
  const isConnecting = useSelector(selectHDWalletIsConnecting);
  const customDPaths = useSelector(selectHDWalletCustomDPaths);
  const isCompleted = useSelector(selectHDWalletIsCompleted);
  const isGettingAccounts = useSelector(selectHDWalletIsGettingAccounts);
  const network = useSelector(selectHDWalletNetwork);
  const accountQueue = useSelector(selectHDWalletAccountQueue);
  const scannedAccounts = useSelector(selectHDWalletScannedAccounts);
  const selectedAsset = useSelector(selectHDWalletAsset);

  // On first connection && on asset update
  useEffect(() => {
    if (!isConnected || !network || !session || scannedAccounts.length !== 0) return;
    dispatch(getAccounts({ session, dpaths }));
  }, [isConnected, scannedAccounts]);

  useEffect(() => {
    if (scannedAccounts.length === 0 || !session) return;
    const { newGapItems, customDPathItems } = processScannedAccounts(
      scannedAccounts,
      customDPaths,
      gap
    );
    if (newGapItems.length !== 0) {
      dispatch(getAccounts({ session, dpaths: newGapItems }));
      return;
    }
    if (customDPathItems.length > 0) {
      dispatch(getAccounts({ session, dpaths: customDPathItems }));
      return;
    }
    // trigger completion
    if (!isGettingAccounts) {
      dispatch(triggerComplete());
    }
    return;
  }, [scannedAccounts, isCompleted]);

  const addDPaths = (cstmDPaths: ExtendedDPath[]) => {
    if (!isConnected || !network || !session) {
      return;
    }
    dispatch(addCustomDPaths(cstmDPaths));
  };

  const updateAsset = (ast: ExtendedAsset) => {
    dispatch(updateScannerAsset(ast));
  };

  const scanMoreAddresses = (dpath: ExtendedDPath) => {
    if (!isConnected || !network || !session) return;
    dispatch(getAccounts({ session, dpaths: [dpath] }));
  };

  const requestConnection = (network: Network, asset: ExtendedAsset) => {
    dispatch(connectHDWallet({ walletId, network, asset, dpaths, setSession }));
  };

  return {
    scannedAccounts,
    isCompleted,
    isConnecting,
    selectedAsset,
    isConnected,
    accountQueue,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses
  };
};

export default useHDWallet;
