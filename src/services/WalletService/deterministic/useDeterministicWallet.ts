import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  addCustomDPaths,
  connectToHDWallet,
  getAccounts,
  getHDWalletAsset,
  getHDWalletCustomDPaths,
  getHDWalletFinishedAccounts,
  getHDWalletIsCompleted,
  getHDWalletIsConnected,
  getHDWalletIsConnecting,
  getHDWalletIsGettingAccounts,
  getHDWalletNetwork,
  getHDWalletQueuedAccounts,
  scanMoreAddresses as scanMoreHDAddresses,
  triggerComplete,
  updateAsset as updateScannerAsset
} from '@store/hdWallet.slice';
import { DPathFormat, ExtendedAsset, Network } from '@types';

import { processFinishedAccounts, Wallet } from '..';
import { ExtendedDPath, IUseDeterministicWallet } from './types';

const useDeterministicWallet = (
  dpaths: ExtendedDPath[],
  walletId: DPathFormat,
  gap: number
): IUseDeterministicWallet => {
  const [session, setSession] = useState((undefined as unknown) as Wallet);
  const dispatch = useDispatch();
  const isConnected = useSelector(getHDWalletIsConnected);
  const isConnecting = useSelector(getHDWalletIsConnecting);
  const customDPaths = useSelector(getHDWalletCustomDPaths);
  const isCompleted = useSelector(getHDWalletIsCompleted);
  const isGettingAccounts = useSelector(getHDWalletIsGettingAccounts);
  const network = useSelector(getHDWalletNetwork);
  const queuedAccounts = useSelector(getHDWalletQueuedAccounts);
  const finishedAccounts = useSelector(getHDWalletFinishedAccounts);
  const selectedAsset = useSelector(getHDWalletAsset);

  // On first connection && on asset update
  useEffect(() => {
    if (!isConnected || !network || !session || finishedAccounts.length !== 0) return;
    dispatch(getAccounts({ session, dpaths }));
  }, [isConnected, finishedAccounts]);

  // On scan more
  useEffect(() => {
    if (!isConnected || !network || !session || isCompleted) return;
    dispatch(getAccounts({ session, dpaths }));
  }, [isCompleted]);

  useEffect(() => {
    if (finishedAccounts.length === 0 || !session) return;
    const { newGapItems, customDPathItems } = processFinishedAccounts(
      finishedAccounts,
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
  }, [finishedAccounts, isCompleted]);

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
    dispatch(scanMoreHDAddresses({ session, dpath }));
  };

  const requestConnection = (network: Network, asset: ExtendedAsset) => {
    dispatch(connectToHDWallet({ walletId, network, asset, dpaths, setSession }));
  };

  return {
    finishedAccounts,
    isCompleted,
    isConnecting,
    selectedAsset,
    isConnected,
    queuedAccounts,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses
  };
};

export default useDeterministicWallet;
