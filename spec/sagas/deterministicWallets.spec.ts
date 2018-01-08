import { configuredStore } from 'store';
import { INode } from 'libs/nodes/INode';
import { cloneableGenerator } from 'redux-saga/utils';
import { all, apply, fork, put, select } from 'redux-saga/effects';
import RpcNode from 'libs/nodes/rpc';
import { getDesiredToken, getWallets } from 'selectors/deterministicWallets';
import { getTokens } from 'selectors/wallet';
import { getNodeLib } from 'selectors/config';
import * as dWalletActions from 'actions/deterministicWallets';
import { Token } from 'config/data';
import {
  getDeterministicWallets,
  updateWalletValues,
  updateWalletTokenValues
} from 'sagas/deterministicWallets';
import { TokenValue, Wei } from 'libs/units';

// init module
configuredStore.getState();

const genWalletData1 = () => ({
  index: 0,
  address: '0x0',
  value: TokenValue('100'),
  tokenValues: {
    OMG: {
      value: TokenValue('100'),
      decimal: 16
    }
  }
});

const genWalletData2 = () => ({
  index: 1,
  address: '0x1',
  value: TokenValue('100'),
  tokenValues: {
    BAT: {
      value: TokenValue('100'),
      decimal: 16
    }
  }
});

const genBalances = () => [Wei('100'), Wei('200')];

describe('getDeterministicWallets*', () => {
  describe('starting from seed', () => {
    const dWallet = {
      seed:
        '1ba4b713b9cf6f91e8e2eea015fc4e107452fa7d8ade32322207967371e5c0fb93289d4dde94ce13625ecc60279d211b6d677c67f54b9e97c7e68afc9ca1b5ea',
      dPath: "m/44'/60'/0'/0"
    };
    const action = dWalletActions.getDeterministicWallets(dWallet);
    const gen = getDeterministicWallets(action);

    it('should match put snapshot', () => {
      expect(gen.next().value).toMatchSnapshot();
    });

    it('should fork updateWalletValues', () => {
      expect(gen.next().value).toEqual(fork(updateWalletValues));
    });

    it('should fork updateWalletTokenValues', () => {
      expect(gen.next().value).toEqual(fork(updateWalletTokenValues));
    });
  });

  describe('starting from publicKey & chainCode', () => {
    const dWallet = {
      dPath: '',
      publicKey: '02fcba7ecf41bc7e1be4ee122d9d22e3333671eb0a3a87b5cdf099d59874e1940f',
      chainCode: '180c998615636cd875aa70c71cfa6b7bf570187a56d8c6d054e60b644d13e9d3',
      limit: 10,
      offset: 0
    };

    const action = dWalletActions.getDeterministicWallets(dWallet);
    const gen = getDeterministicWallets(action);

    it('should match put snapshot', () => {
      expect(gen.next().value).toMatchSnapshot();
    });

    it('should fork updateWalletValues', () => {
      expect(gen.next().value).toEqual(fork(updateWalletValues));
    });

    it('should fork updateWalletTokenValues', () => {
      expect(gen.next().value).toEqual(fork(updateWalletTokenValues));
    });
  });
});

describe('updateWalletValues*', () => {
  const walletData1 = genWalletData1();
  const walletData2 = genWalletData2();
  const wallets: dWalletActions.DeterministicWalletData[] = [walletData1, walletData2];
  const balances = genBalances();
  const node: INode = new RpcNode('');
  const gen = updateWalletValues();

  it('should select getNodeLib', () => {
    expect(gen.next().value).toEqual(select(getNodeLib));
  });

  it('should select getWallets', () => {
    expect(gen.next(node).value).toEqual(select(getWallets));
  });

  it('should get balance for all wallets', () => {
    expect(gen.next(wallets).value).toEqual(
      all([
        apply(node, node.getBalance, [walletData1.address]),
        apply(node, node.getBalance, [walletData2.address])
      ])
    );
  });

  it('should put updateDeterministicWallet for wallet1', () => {
    expect(gen.next(balances).value).toEqual(
      put(
        dWalletActions.updateDeterministicWallet({
          ...walletData1,
          value: balances[0]
        })
      )
    );
  });

  it('should put updateDeterministicWallet for wallet2', () => {
    expect(gen.next(balances).value).toEqual(
      put(
        dWalletActions.updateDeterministicWallet({
          ...walletData2,
          value: balances[1]
        })
      )
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('updateWalletTokenValues*', () => {
  const walletData1 = genWalletData1();
  const walletData2 = genWalletData2();
  const wallets: dWalletActions.DeterministicWalletData[] = [walletData1, walletData2];
  const node: INode = new RpcNode('');
  const token1: Token = {
    address: '0x2',
    symbol: 'OMG',
    decimal: 16
  };
  const token2: Token = {
    address: '0x3',
    symbol: 'BAT',
    decimal: 16
  };
  const tokens = [token1, token2];
  const tokenBalances = [
    {
      balance: TokenValue('100'),
      error: null
    },
    {
      balance: TokenValue('200'),
      error: null
    }
  ];
  const desiredToken = 'OMG';
  const data = {} as any;
  data.gen = cloneableGenerator(updateWalletTokenValues)();

  it('should select getDesiredToken', () => {
    expect(data.gen.next().value).toEqual(select(getDesiredToken));
  });

  it('should return if desired token is falsey', () => {
    data.clone1 = data.gen.clone();
    data.clone1.next();
    expect(data.clone1.next().done).toEqual(true);
  });

  it('should select getTokens', () => {
    data.clone2 = data.gen.clone();
    expect(data.gen.next(desiredToken).value).toEqual(select(getTokens));
  });

  it('should return if desired token is not amongst tokens', () => {
    data.clone2.next('fakeDesiredToken');
    expect(data.clone2.next(tokens).done).toEqual(true);
  });

  it('should select getNodeLib', () => {
    expect(data.gen.next(tokens).value).toEqual(select(getNodeLib));
  });

  it('should select getWallets', () => {
    expect(data.gen.next(node).value).toEqual(select(getWallets));
  });

  it('should match snapshot of wallet token balances', () => {
    expect(data.gen.next(wallets).value).toMatchSnapshot();
  });

  it('should match snapshot for put wallet1 update', () => {
    expect(data.gen.next(tokenBalances)).toMatchSnapshot();
  });

  it('should match snapshot for put wallet2 update', () => {
    expect(data.gen.next()).toMatchSnapshot();
  });

  it('should be done', () => {
    expect(data.gen.next().done).toEqual(true);
  });
});
