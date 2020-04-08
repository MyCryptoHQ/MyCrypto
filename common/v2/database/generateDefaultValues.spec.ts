import { LocalStorage, LSKeys } from 'v2/types';
import { toArray } from 'v2/utils';

import { createDefaultValues } from './generateDefaultValues';
import { SCHEMA_BASE, NETWORKS_CONFIG } from './data';

describe('Schema', () => {
  let defaultData: LocalStorage;

  beforeAll(() => {
    defaultData = createDefaultValues(SCHEMA_BASE, NETWORKS_CONFIG);
  });

  it('defaultData has with valid properties', () => {
    const ref = Object.keys(SCHEMA_BASE);
    const real = Object.keys(defaultData);
    expect(ref).toEqual(real);
  });

  it('excludes testAccounts by default', () => {
    const accounts = toArray(defaultData[LSKeys.ACCOUNTS]);
    expect(accounts.length).toEqual(0);
  });

  describe('Seed: Contracts', () => {
    it('add Contracts to Store', () => {
      const contracts = toArray(defaultData[LSKeys.CONTRACTS]);
      expect(contracts.length).toBeGreaterThanOrEqual(40);
    });
  });

  describe('Seed: Networks', () => {
    it('adds Contracts to Networks', () => {
      const contracts = toArray(defaultData[LSKeys.NETWORKS]).flatMap(n => n.contracts);
      expect(contracts.length).toBeGreaterThanOrEqual(42);
    });

    it('adds Nodes to each Network', () => {
      const nodes = toArray(defaultData[LSKeys.NETWORKS]).flatMap(n => n.nodes);
      expect(nodes.length).toBe(40);
    });

    it('adds BaseAssets to Networks', () => {
      const networkBaseAssets = toArray(defaultData[LSKeys.NETWORKS]).map(
        ({ baseAsset }) => baseAsset
      );
      const networkAssets = toArray(defaultData[LSKeys.NETWORKS]).flatMap(({ assets }) => assets);

      networkBaseAssets.forEach(baseAsset => {
        const match = networkAssets.findIndex(aUuid => aUuid === baseAsset);
        expect(match).toBeGreaterThanOrEqual(0);
      });
    });

    it('adds Tokens to Networks', () => {
      const allAssets = defaultData[LSKeys.ASSETS];
      const tokens = toArray(allAssets)
        .filter(({ type }) => type === 'erc20')
        .filter(Boolean);
      const networkAssets = toArray(defaultData[LSKeys.NETWORKS])
        .flatMap(({ assets }) => assets)
        // @ts-ignore
        .filter(uuid => allAssets[uuid].type === 'erc20')
        .filter(Boolean); // Not all networks have assets!

      expect(networkAssets.length).toBeGreaterThan(1);
      expect(networkAssets.length).toEqual(tokens.length);
    });
  });

  describe('Seed: Assets', () => {
    it("adds each Network's baseAsset to Assets", () => {
      const networks = toArray(defaultData[LSKeys.NETWORKS]);
      const baseAssets = toArray(defaultData[LSKeys.ASSETS]).filter(({ type }) => type === 'base');
      expect(baseAssets.length).toEqual(networks.length);
    });

    it('adds default Fiats as Assets', () => {
      const fiats = toArray(defaultData[LSKeys.ASSETS]).filter(({ type }) => type === 'fiat');
      expect(fiats.length).toBeGreaterThanOrEqual(3);
    });

    it('adds Tokens to Assets', () => {
      const tokens = toArray(defaultData[LSKeys.ASSETS]).filter(({ type }) => type === 'erc20');
      expect(tokens.length).toEqual(1786);
    });
  });
});
