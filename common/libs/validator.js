import WalletAddressValidator from 'wallet-address-validator';
import ethUtil from 'ethereumjs-util';

export default class Validator {
  isValidETHAddress = function(address) {
    if (address && address === '0x0000000000000000000000000000000000000000')
      return false;
    if (address) {
      return ethUtil.isValidAddress(address);
    }
    return false;
  };
  isValidBTCAddress = function(address) {
    return WalletAddressValidator.validate(address, 'BTC');
  };
}
