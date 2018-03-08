declare module 'idna-uts46' {
  export interface Options {
    transitional?: boolean;
    useStd3ASCII?: boolean;
    verifyDnsLength?: boolean;
  }

  export function toAscii(domain: string, options: Options): string;
  export function toUnicode(domain: string, args: Options): string;
}
