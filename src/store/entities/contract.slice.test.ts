import { Contract, NetworkId, TUuid } from '@types';

import slice from './contract.slice';

const reducer = slice.reducer;
const { create, destroy } = slice.actions;

describe('ContractSlice', () => {
  it('has a valid initialState', () => {
    const actual = reducer(undefined, { type: 'dummyAction' });
    expect(Object.keys(actual)).toEqual([
      /**
       * List of contract uuids. Since the uuid is deterministic (address + network.chainId)
       * we can safely assert agains them. The assertion tells us that the json contracts are
       * correctly loaded, parsed, have a generated uuid, and placed set into an object.
       */
      'c9e4c2a2-4d24-5187-9c8c-9bf5e1d7a3a4',
      'e7be0236-b57f-586c-99d0-6289aa505cec',
      'ee08ddc5-a599-5475-b4e0-b6aa81ff977c',
      '0e5f378d-625f-5bb5-992b-b6d7d60858af',
      '7f4bee9a-b3a7-5f5d-9fdd-70a07fc30ccf',
      'a22967bf-7809-5318-976c-3cfd6076b44e',
      '9f5ea8d2-03bb-5acf-8d76-f769c0b2d3c3',
      '293baed2-5548-59dc-9f57-a15c0fb3e967',
      '84b625f6-7814-5da5-8c30-6e1847abdb46',
      'd40ae695-e12f-5d20-8eb7-feba7f9fb771',
      '4c9ed17d-9862-5c1d-8e45-d9ea7a155eff',
      '83c3a8c1-6797-5268-8059-d31f2489bad7',
      'd70c4394-f31a-5bde-b86d-0f804ecb10ab',
      '570e4c2e-05ee-553e-b9ca-3502ccd029ab',
      '138e4404-35cf-5469-8415-dcc0a6e52baa',
      'c2ac20d6-5844-5748-9b12-960e6b6d1812',
      '027ea87c-6029-5648-97e2-fa5207e644c9',
      '13f61e61-fc49-5ae7-a933-d146d5b86127',
      'b6902782-3d18-5179-8a60-9a3cf4bb7667',
      'f93d9c0d-be4e-589b-a1e9-63b62b25bebc',
      'bfe2570d-f158-5bbd-986c-9beffc84781b',
      'da868a97-24fd-5225-b06a-e03a332ad719',
      '6c40b877-2c6c-5b7b-a522-a5812fcad293',
      'd606d804-6280-5795-b79b-1ac0c879a765',
      '29e8e081-2b69-5508-a63c-84abff5277fb',
      '566f9dba-0e28-5dfe-bf78-d0aea8e7b2ff',
      '2f8533df-9b1e-5cf1-a802-b3a87cad7185',
      '4fa8789e-c769-5c20-bf02-ce5669186fa7',
      '4701d934-99dc-5c7e-9575-efed8f694ea6',
      'f51049a5-f560-5d86-8937-4d80ddf71f46',
      'f9b60875-3992-537c-8836-d0b3b3212cd7',
      '08925f01-5d2a-533f-a03c-63ae46b7dc61',
      'c815ccd6-ffae-57e6-baad-7a5dc48a5be1',
      '8156f598-11dd-5a7a-8a3a-805c3acc356b',
      '624d4cb6-b9ba-5b46-b40b-02bf4e435b08',
      'eacdc803-011b-5397-a0f6-b400dc9f61ba',
      '6e7abb55-78c1-56c9-b513-18cb253726d9',
      '86e5fb90-a15f-5173-b774-6454e3c0a014',
      '738d757b-a438-5f21-b116-c18c4decc5e5',
      '635c7c2c-545b-5844-8826-27b5d69f5b29',
      '13bde552-ab9e-5422-b21f-09f3fbad0f2b',
      '7a7bf9a0-723e-5289-96da-8108134dd780',
      'c0432533-f4ac-5459-bc86-06982d9e665e',
      '699f5e11-fdfd-5483-94fe-104d1d59d281',
      '2b6414fc-2156-5b46-818e-08c9fa5ec682',
      'bfe036e3-7307-5433-ba04-1c6b13d5859e',
      '58d07b5b-b38d-5418-ab80-f04d6359f0eb',
      '69bc918a-c841-5c27-9bb5-eb8aa3cb2637',
      'd94e0018-1782-58ff-b4d9-386123acecb5',
      'ad4a648c-0883-5471-b842-867488d380d8',
      '1a39c840-b2fa-5f48-873f-63d7ae7e69e4',
      '76623d8b-9d8e-5c99-b916-156c55d1dc00',
      '5b81cdf5-1f9b-549b-b2f5-6899167ddaff',
      '90138b6b-5d07-5435-9425-f574a164b1c4',
      '03e0f6d6-7f5f-5cfc-8b29-e07d09b41add',
      'd8488fa2-1430-583a-b2ae-3aa04ac2d7a6',
      '5ca8637c-2a3f-5c5d-a984-ff6b61d61072',
      '24ec47a3-eae4-5149-8489-e4600e9ebec6',
      '89b4f486-3fb9-5d27-ab03-ff5b731d5f46',
      '704ef35d-103b-58a6-b5aa-3a64c872dbf5',
      '88098324-4537-5a55-a9fc-b7d6d3479f18',
      '0246bdcb-6367-5f9f-ab61-06828c01b43c',
      '0887559c-f074-5bfa-9509-4d499fdbeef1',
      'b1d15b64-51d4-5ef3-9d0f-6ec587c0f1ef'
    ]);
  });
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as Contract;
    const state = { uuid1: { name: 'MultiSig', uuid: 'uuid1' } } as Record<TUuid, Contract>;
    const actual = reducer(state, create(entity));
    const expected = { ...state, [entity.uuid]: entity };
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const entity = { uuid: 'todestroy' } as Contract;
    const state = { [entity.uuid]: entity } as Record<Partial<NetworkId>, Contract>;
    const actual = reducer(state, destroy(entity.uuid));
    const expected = {};
    expect(actual).toEqual(expected);
  });
});
