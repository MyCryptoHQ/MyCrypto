import { ModeOfOperation, utils } from 'aes-js';
import SHA256 from 'sha256';

// Encryption methods used exclusively for encryption of local storage for ScreenLock

export const decrypt = (data: string, key: string) => {
  const aes = new ModeOfOperation.ctr(utils.hex.toBytes(key));
  const decryptedBytes = aes.decrypt(utils.hex.toBytes(data));
  return utils.utf8.fromBytes(decryptedBytes);
};

export const encrypt = (data: string, key: string) => {
  const aes = new ModeOfOperation.ctr(utils.hex.toBytes(key));
  const encryptedBytes = aes.encrypt(utils.utf8.toBytes(data));
  return utils.hex.fromBytes(encryptedBytes);
};

export const hashPassword = (password: string) => {
  return utils.hex.fromBytes(SHA256(password, { asBytes: true }));
};
