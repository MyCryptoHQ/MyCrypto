import { decrypt, encrypt, hashPassword } from './encryption';

const password = 'test';
const hashedPassword = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
const data = 'data';
const encryptedData = '20cecf52';

describe('hashPassword', () => {
  it('correctly SHA256 hashes a string', () => {
    const result = hashPassword(password);
    const expected = hashedPassword;
    expect(result).toBe(expected);
  });
});

describe('encrypt', () => {
  it('correctly encrypts data with AES encryption', () => {
    const encrypted = encrypt('data', hashedPassword);
    expect(encrypted).toBe(encryptedData);
  });
});

describe('decrypt', () => {
  it('correctly decrypts AES encrypted data', () => {
    const decrypted = decrypt(encryptedData, hashedPassword);
    expect(decrypted).toBe(data);
  });
});
