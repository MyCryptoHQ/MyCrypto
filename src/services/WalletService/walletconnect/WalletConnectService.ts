import WalletConnect from '@walletconnect/client';
import { ITxData, IWalletConnectSession } from '@walletconnect/types';

import { TAddress } from '@types';
import { noOp } from '@utils';

import { IWalletConnectService } from './types';

const WALLET_CONNECT_BRIDGE_URI = 'https://bridge.walletconnect.org';

/*
  Wrapper around WalletConnect library to facilitate decoupling.
  We pass the eventHandlers on initialisaiton
*/

interface EventHandlers {
  handleInit(uri: string): void;
  handleConnect({
    address,
    chainId,
    session
  }: {
    address: TAddress;
    chainId: number;
    session: IWalletConnectSession;
  }): void;
  handleError(error: Error): void;
  handleReject(error: Error): void;
  handleUpdate({ address, chainId }: { address: TAddress; chainId: number }): void;
  handleSessionRequest?(uri: string): void;
  handleDisconnect(params: any): void;
}

export default function WalletConnectService({
  handleInit,
  handleConnect,
  handleError,
  handleReject,
  handleUpdate,
  handleDisconnect = noOp
}: EventHandlers): IWalletConnectService {
  const connector = new WalletConnect({
    bridge: WALLET_CONNECT_BRIDGE_URI
  });

  // Helper to extract message from payload.
  const getMessage = (payload: any) => (payload.params ? payload.params[0].message : false);

  const sendTx = async (tx: ITxData) => connector.sendTransaction(tx);

  const signMessage = async (msg: string, address: string) =>
    connector.signPersonalMessage([msg, address]);

  const kill = async () => connector.killSession();

  const init = async () => {
    // Make sure we are dealing with the same session.
    if (connector.connected) await kill();

    connector.createSession().then(() => {
      // get uri for QR Code modal
      handleInit(connector.uri);
    });
  };

  // Subscribe to connection events
  connector.on('connect', (error, payload) => {
    if (error) {
      return handleError(error);
    }

    const { accounts, chainId } = payload.params[0];
    handleConnect({ address: accounts[0] as TAddress, chainId, session: connector.session });
  });

  connector.on('session_update', (error, payload) => {
    if (error) {
      return handleError(error);
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    handleUpdate({ address: accounts[0] as TAddress, chainId });
  });

  connector.on('disconnect', (error, payload) => {
    if (error) {
      return handleError(error);
    }

    // Call handler when it exists and we are dealing with a normal disconnect
    if (handleReject && getMessage(payload) === 'Session Rejected') {
      handleReject(payload.params);
    } else {
      // here the message is 'Session Disconnected'
      handleDisconnect(payload);
    }
  });

  return {
    init,
    kill,
    sendTx,
    signMessage,
    isConnected: connector.connected
  };
}
