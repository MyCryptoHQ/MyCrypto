import { Dispatch } from 'react';
import { SymmetricDifference } from 'utility-types';
import {
  LSKeys,
  TUuid,
  DataStore,
  DataStoreEntry,
  DataStoreItem,
  Network,
  NetworkId,
  ISettings,
  LocalStorage
} from 'v2/types';
import { ActionPayload, ActionV, ActionT } from './reducer';
import { marshallState, deMarshallState } from './utils';

type createPayload = (m: LSKeys) => <T>(v: T) => ActionPayload<T>;
const createPayload: createPayload = model => v => ({ model, data: v });

export function ActionFactory(model: LSKeys, dispatch: Dispatch<ActionV>, state: DataStore) {
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
  const update = <T>(
    uuid: T,
    item: T extends NetworkId
      ? Network
      : T extends TUuid
      ? SymmetricDifference<DataStoreItem, Network>
      : never
  ): void => {
    if (model === LSKeys.NETWORKS) {
      dispatch({
        type: ActionT.UPDATE_NETWORK,
        payload: generatePayload({ ...item, id: (uuid as unknown) as NetworkId })
      });
    } else {
      dispatch({
        type: ActionT.UPDATE_ITEM,
        payload: generatePayload({ ...item, uuid: (uuid as unknown) as TUuid })
      });
    }
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

  const destroyStorage = () => {
    console.debug('Destroy Storage');
  };

  const importStorage = (data: string) => {
    const d = JSON.parse(data);
    // @TODO: perfom version and validity check.
    dispatch({
      type: ActionT.RESET,
      payload: createPayload(model)(marshallState(d))
    });
  };

  // DataContext state is our Single source of truth,
  // so we use it for our exporting.
  const exportStorage = (): Omit<LocalStorage, 'mtime'> => {
    return deMarshallState(state);
  };

  return {
    create,
    createWithID,
    update,
    updateAll,
    destroy,
    exportStorage,
    importStorage,
    destroyStorage
  };
}
