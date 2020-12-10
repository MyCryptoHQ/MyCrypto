import { Dispatch } from 'react';

import { ActionPayload, ActionT, ActionV } from '@store/legacy.reducer';
import { SymmetricDifference } from 'utility-types';

import { DataStoreEntry, DataStoreItem, DSKeys, ISettings, Network, TUuid } from '@types';

type createPayload = (m: DSKeys) => <T>(v: T) => ActionPayload<T>;
const createPayload: createPayload = (model) => (v) => ({ model, data: v });

export function ActionFactory(model: DSKeys, dispatch: Dispatch<ActionV>) {
  const generatePayload = createPayload(model);

  const create = (item: DataStoreItem): void => {
    dispatch({
      type: ActionT.ADD_ITEM,
      payload: generatePayload(item)
    });
  };

  const createWithID = (
    item: SymmetricDifference<DataStoreItem, ISettings | Network>,
    uuid: TUuid
  ): void => {
    dispatch({
      type: ActionT.ADD_ITEM,
      payload: generatePayload({ ...item, uuid })
    });
  };

  // Ideally we would want to add a Union constraint to our Generic param.
  // https://github.com/microsoft/TypeScript/issues/13995
  // In the mean time we have to cast our id.
  const update = <T>(uuid: T, item: DataStoreItem): void => {
    dispatch({
      type: ActionT.UPDATE_ITEM,
      payload: generatePayload({ ...item, uuid: (uuid as unknown) as TUuid })
    });
  };

  const updateAll = (entry: DataStoreEntry): void => {
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: generatePayload(entry)
    });
  };

  const destroy = (item: DataStoreItem): void => {
    dispatch({
      type: ActionT.DELETE_ITEM,
      payload: generatePayload(item)
    });
  };

  return {
    create,
    createWithID,
    update,
    updateAll,
    destroy
  };
}
