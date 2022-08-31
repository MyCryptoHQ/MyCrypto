import approval from '@assets/images/transactions/approval.svg';
import contractDeploy from '@assets/images/transactions/contract-deploy.svg';
import contractInteract from '@assets/images/transactions/contract-interact.svg';
import defizap from '@assets/images/transactions/defizap.svg';
import inbound from '@assets/images/transactions/inbound.svg';
import membershipPurchase from '@assets/images/transactions/membership-purchase.svg';
import outbound from '@assets/images/transactions/outbound.svg';
import swap from '@assets/images/transactions/swap.svg';
import transfer from '@assets/images/transactions/transfer.svg';
import { translateRaw } from '@translations';
import { Asset, ITxTypeMeta } from '@types';

import { ITxHistoryType } from '../types';
import { ITxTypeConfigObj } from './RecentTransactionList';

export const constructTxTypeConfig = ({ type, protocol }: ITxTypeMeta): ITxTypeConfigObj => ({
  label: (asset: Asset) => {
    switch (type) {
      default:
        return protocol
          ? translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
              $platform: translateRaw(protocol, { $ticker: asset.ticker }),
              $action: translateRaw(`PLATFORM_${type}`, { $ticker: asset.ticker })
            })
          : translateRaw(`PLATFORM_${type}`, { $ticker: asset.ticker });
      case 'GENERIC_CONTRACT_CALL' as ITxHistoryType:
      case ITxHistoryType.CONTRACT_INTERACT:
        return translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.INBOUND:
        return translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.OUTBOUND:
        return translateRaw('RECENT_TX_LIST_LABEL_SENT', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.TRANSFER:
        return translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
          $ticker: asset.ticker || translateRaw('UNKNOWN')
        });
      case ITxHistoryType.REP_TOKEN_MIGRATION:
      case ITxHistoryType.GOLEM_TOKEN_MIGRATION:
      case ITxHistoryType.ANT_TOKEN_MIGRATION:
        return protocol
          ? translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
              $platform: translateRaw(protocol, { $ticker: asset.ticker }),
              $action: translateRaw(`PLATFORM_MIGRATION`, { $ticker: asset.ticker })
            })
          : translateRaw(`PLATFORM_MIGRATION`, { $ticker: asset.ticker });
      case ITxHistoryType.PURCHASE_MEMBERSHIP:
        return translateRaw('PLATFORM_MEMBERSHIP_PURCHASED');
    }
  },
  icon: () => {
    switch (type) {
      case 'DEPOSIT':
      case 'WITHDRAW':
      case 'DEPOSIT_TOKEN':
      case 'ROUTER_TO':
      case 'BORROW':
      case 'REPAY':
      case 'MINT':
      case 'NAME_REGISTERED':
      case 'NAME_RENEWED':
      case 'CANCEL_ORDER':
      case 'GENERIC_CONTRACT_CALL':
      case 'CONTRACT_INTERACT':
      case 'NFT_MINT':
        return contractInteract;
      case 'EXCHANGE':
      case 'SWAP':
      case 'BRIDGE_IN':
      case 'BRIDGE_OUT':
      case 'NFT_EXCHANGE':
        return swap;
      case 'APPROVAL':
      case 'APPROVE':
      case 'NFT_APPROVE':
        return approval;
      case 'FAUCET':
      case 'MINING_PAYOUT':
      case 'CLAIM':
      case 'INBOUND':
        return inbound;
      case 'OUTBOUND':
        return outbound;
      case 'PURCHASE_MEMBERSHIP':
        return membershipPurchase;
      case 'DEFIZAP':
        return defizap;
      case 'CONTRACT_DEPLOY':
        return contractDeploy;
      default:
        return transfer;
    }
  }
});
