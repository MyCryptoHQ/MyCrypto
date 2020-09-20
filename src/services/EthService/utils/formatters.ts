import { padLeftEven } from './padLeftEven';
import { toTokenBase } from './units';

export const buildEIP681EtherRequest = (
  recipientAddr: string,
  chainId: number,
  etherValue: string
) => `ethereum:${recipientAddr}${chainId !== 1 ? `@${chainId}` : ''}?value=${etherValue}e18`;

export const buildEIP681TokenRequest = (
  recipientAddr: string,
  contractAddr: string,
  chainId: number,
  tokenValue: string,
  decimal: number
) =>
  `ethereum:${contractAddr}${
    chainId !== 1 ? `@${chainId}` : ''
  }/transfer?address=${recipientAddr}&uint256=${toTokenBase(tokenValue, decimal)}
  }`;

export function messageToData(messageToTransform: string): string {
  return (
    '0x' +
    Array.from(Buffer.from(messageToTransform, 'utf8'))
      .map((n) => padLeftEven(n.toString(16)))
      .join('')
  );
}
