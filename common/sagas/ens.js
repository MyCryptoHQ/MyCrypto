// @flow
import { takeEvery, put, select, apply } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { cacheEnsAddress } from 'actions/ens';
import type { ResolveEnsNameAction } from 'actions/ens';
import { getEnsAddress } from 'selectors/ens';
import { getNetworkConfig, getNodeLib } from 'selectors/config';
import type { NetworkConfig } from 'config/data';
import { RegistryContract, ResolverContract } from 'libs/ens';
import type { BaseNode } from 'libs/nodes';
import { toChecksumAddress } from 'ethereumjs-util';

function* resolveEns(action?: ResolveEnsNameAction) {
  if (!action) return;

  const node: BaseNode = yield select(getNodeLib);
  const network: NetworkConfig = yield select(getNetworkConfig);
  const chainId: number = network.chainId;
  const ens = network.ens;
  const ensName = action.payload;

  if (!ens) {
    return;
  }

  const cachedEnsAddress = yield select(getEnsAddress, ensName);
  if (cachedEnsAddress) {
    return;
  }

  const resolver = yield apply(node, node.call, [
    ens.registry,
    RegistryContract.resolver(ensName)
  ]);
  const resolverAddress = RegistryContract.$resolver(resolver);
  if (resolverAddress === '0x0000000000000000000000000000000000000000') {
    yield put(cacheEnsAddress(chainId, ensName, resolverAddress));
    return;
  }

  const address = yield apply(node, node.call, [
    resolverAddress,
    ResolverContract.addr(ensName)
  ]);
  const resolvedAddress = ResolverContract.$addr(address);
  yield put(
    cacheEnsAddress(chainId, ensName, toChecksumAddress(resolvedAddress))
  );
}

export default function* notificationsSaga(): Generator<Effect, void, any> {
  yield takeEvery('ENS_RESOLVE', resolveEns);
}
