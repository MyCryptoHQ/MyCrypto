enum KeystoreTypes {
  presale = 'presale',
  utc = 'v2-v3-utc',
  v1Unencrypted = 'v1-unencrypted',
  v1Encrypted = 'v1-encrypted',
  v2Unencrypted = 'v2-unencrypted'
}

function determineKeystoreType(file: string): string {
  const parsed = JSON.parse(file);
  if (parsed.encseed) {
    return KeystoreTypes.presale;
  } else if (parsed.Crypto || parsed.crypto) {
    return KeystoreTypes.utc;
  } else if (parsed.hash && parsed.locked === true) {
    return KeystoreTypes.v1Encrypted;
  } else if (parsed.hash && parsed.locked === false) {
    return KeystoreTypes.v1Unencrypted;
  } else if (parsed.publisher === 'MyEtherWallet') {
    return KeystoreTypes.v2Unencrypted;
  } else {
    throw new Error('Invalid keystore');
  }
}

const isKeystorePassRequired = (file: string): boolean => {
  const keystoreType = determineKeystoreType(file);
  return (
    keystoreType === KeystoreTypes.presale ||
    keystoreType === KeystoreTypes.v1Encrypted ||
    keystoreType === KeystoreTypes.utc
  );
};

export { isKeystorePassRequired, determineKeystoreType, KeystoreTypes };
