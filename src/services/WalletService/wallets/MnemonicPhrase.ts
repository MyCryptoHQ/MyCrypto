import { isValidMnemonic, HDNode, fromMnemonic } from 'ethers/utils/hdnode';

import Wallet from './Wallet';

import { WalletId } from '@types';

import { MnemonicPhraseResult } from './types';
import { DPathsList } from '@config/dpaths';
import { getFullPath } from './helpers';

export default class MnemonicPhrase implements Wallet {
  private readonly mnemonicPhrase: string;
  private readonly password: string;

  public constructor(mnemonicPhrase: string, password: string) {
    this.mnemonicPhrase = mnemonicPhrase;
    this.password = password;
  }

  public async getAddress(dPath: DPath, index: number): Promise<MnemonicPhraseResult[]> {
    const hdNode = await this.getHDNode();
    const results: MnemonicPhraseResult[] = [];

    const path = getFullPath(dPath, index);

    results.push({
      type: WalletId.MNEMONIC_PHRASE_NEW,
      address: hdNode.derivePath(path).address,
      withPassword: !!this.password,
      path
    });

    // Extra check without a password if a password was specified
    if (this.password) {
      const passwordlessHdNode = await this.getHDNode(false);

      results.push({
        type: WalletId.MNEMONIC_PHRASE_NEW,
        address: passwordlessHdNode.derivePath(path).address,
        withPassword: false,
        path
      });
    }

    return results;
  }

  public async initialize(): Promise<void> {
    if (!isValidMnemonic(this.mnemonicPhrase)) {
      throw new Error('The mnemonic phrase you provided is invalid.');
    }
  }

  public getDPaths(): DPath[] {
    return Object.values(DPathsList);
  }

  /**
   * Get an instance of the HDNode class.
   *
   * @param {boolean} withPassword Whether to get the HDNode initialized with a password or not.
   * @return {Promise<HDNode>} A Promise with an instance of the HDKey class.
   */
  private async getHDNode(withPassword: boolean = true): Promise<HDNode> {
    return fromMnemonic(this.mnemonicPhrase, undefined, withPassword ? this.password : undefined);
  }
}
