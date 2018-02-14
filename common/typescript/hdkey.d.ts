interface HDKeyProps {
  versions: any[];
  depth: number;
  index: number;
  _privateKey: any;
  _publicKey: any;
  chainCode: any;
  _fingerprint: any;
  parentFingerprint: number;
}

declare class HDCLass<HDKeyProps> {
  constructor();
}

declare namespace HDKey {

}
