// @flow

export default class BaseNode {
  // FIXME bignumber?
  queryBalance(address: string): Promise<number> {
    throw 'Implement me';
  }
}
