import { FallbackProvider } from 'ethers/providers';
import ERC20 from 'v2/libs/erc20';
import RPCRequests from 'v2/libs/nodes/rpc/requests';
import * as units from 'v2/libs/units';
import { Asset } from 'v2/services/Asset/types';

export default class MyCryptoProvider extends FallbackProvider {
  public getTokenBalance(address: string, token: Asset): Promise<string> {
    return this.call({
      to: RPCRequests.getTokenBalance(address, token).params[0].to,
      data: RPCRequests.getTokenBalance(address, token).params[0].data
    })
      .then(data => ERC20.balanceOf.decodeOutput(data))
      .then(({ balance }) => {
        if (token.decimal) {
          return units.baseToConvertedUnit(balance, token.decimal);
        }
        return units.baseToConvertedUnit(balance, 18);
      });
  }
}

//All of the wrappings were duplicating this: node_modules/ethers/providers/abstract-provider.d.ts
// but we can add getTokenBalance call to the methods that ethers provides
