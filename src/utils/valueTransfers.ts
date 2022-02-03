import { ITxTransferEvent } from "@components/TransactionFlow/TxReceipt";
import { DEFAULT_ASSET_DECIMAL } from "@config";
import { Asset, ExtendedContact, IFullTxHistoryValueTransfer, TAddress } from "@types";

import { bigify } from "./bigify";
import { fromTokenBase } from "./units";

export const addBaseAssetValueTransfer = (valueTransfers: IFullTxHistoryValueTransfer[], from: TAddress, to: TAddress, value: string, asset: Asset) => 
  ([ ...valueTransfers, { from, to, asset, amount: fromTokenBase(bigify(value), DEFAULT_ASSET_DECIMAL).toString() }]);

export const buildTransferEvent = (
  to: TAddress,
  toContact: ExtendedContact | undefined,
  from: TAddress,
  fromContact:  ExtendedContact | undefined, 
  asset: Asset,
  rate: number,
  amount: string | undefined
): ITxTransferEvent => ({
  to,
  toContact,
  from,
  fromContact,
  asset,
  rate,
  amount
})

export const addTransferEvent = (
  transferEvents: ITxTransferEvent[],
  to: TAddress,
  toContact: ExtendedContact | undefined,
  from: TAddress,
  fromContact:  ExtendedContact | undefined, 
  asset: Asset,
  rate: number,
  amount: string | undefined
): ITxTransferEvent[] => ([
  ...transferEvents,
  buildTransferEvent(to, toContact, from, fromContact, asset, rate, amount)
])