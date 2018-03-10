import { getResolvedAddress } from 'selectors/ens';
import { Address } from 'libs/units';
import { call, select, put, take } from 'redux-saga/effects';
import { isValidETHAddress, isValidENSAddress } from 'libs/validators';
import { setCurrentTo, setField } from 'sagas/transaction/current/currentTo';
import { isEtherTransaction } from 'selectors/transaction';
import { cloneableGenerator } from 'redux-saga/utils';
import { setToField, setTokenTo } from 'actions/transaction';
import { resolveDomainRequested, TypeKeys as ENSTypekeys } from 'actions/ens';

describe('setCurrentTo*', () => {
  const data = {} as any;

  describe('with valid Ethereum address', () => {
    const raw = '0xa';
    const ethAddrPayload = {
      raw,
      value: Address(raw)
    };
    const ethAddrAction: any = {
      payload: raw
    };

    data.validEthGen = setCurrentTo(ethAddrAction);
    it('should call isValidETHAddress', () => {
      expect(data.validEthGen.next().value).toEqual(call(isValidETHAddress, raw));
    });

    it('should call isValidENSAddress', () => {
      expect(data.validEthGen.next(raw).value).toEqual(call(isValidENSAddress, raw));
    });

    it('should call setField', () => {
      expect(data.validEthGen.next(raw).value).toEqual(call(setField, ethAddrPayload));
    });
  });

  describe('with invalid Ethereum address, valid ENS address', () => {
    const raw = 'testing.eth';
    const resolvedAddress = '0xa';
    const [domain] = raw.split('.');
    const ensAddrPayload = {
      raw,
      value: null
    };
    const ensAddrAction: any = {
      payload: raw
    };
    data.validEnsGen = setCurrentTo(ensAddrAction);

    it('should call isValidETHAddress', () => {
      expect(data.validEnsGen.next().value).toEqual(call(isValidETHAddress, raw));
    });

    it('should call isValidENSAddress', () => {
      expect(data.validEnsGen.next(false).value).toEqual(call(isValidENSAddress, raw));
    });

    it('should call setField', () => {
      expect(data.validEnsGen.next(true).value).toEqual(call(setField, ensAddrPayload));
    });

    it('should put resolveDomainRequested', () => {
      expect(data.validEnsGen.next().value).toEqual(put(resolveDomainRequested(domain)));
    });

    it('should take ENS type keys', () => {
      expect(data.validEnsGen.next().value).toEqual(
        take([
          ENSTypekeys.ENS_RESOLVE_DOMAIN_FAILED,
          ENSTypekeys.ENS_RESOLVE_DOMAIN_SUCCEEDED,
          ENSTypekeys.ENS_RESOLVE_DOMAIN_CACHED
        ])
      );
    });

    it('should select getResolvedAddress', () => {
      expect(data.validEnsGen.next().value).toEqual(select(getResolvedAddress, true));
    });

    it('should call setField', () => {
      expect(data.validEnsGen.next(resolvedAddress).value).toEqual(
        call(setField, { raw, value: Address(resolvedAddress) })
      );
    });
  });
});

describe('setField', () => {
  const raw = '0xa';
  const payload = {
    raw,
    value: Address(raw)
  };
  const etherTransaction = cloneableGenerator(setField)(payload);
  it('should select etherTransaction', () => {
    expect(etherTransaction.next().value).toEqual(select(isEtherTransaction));
  });

  it('should put setTokenTo field if its a token transaction ', () => {
    const tokenTransaction = etherTransaction.clone();

    expect(tokenTransaction.next(false).value).toEqual(put(setTokenTo(payload)));
    expect(tokenTransaction.next().done).toBe(true);
  });
  it('should put setToField if its an etherTransaction', () => {
    expect(etherTransaction.next(true).value).toEqual(put(setToField(payload)));
    expect(etherTransaction.next().done).toBe(true);
  });
});
