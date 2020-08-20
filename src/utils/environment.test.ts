import { isE2E } from './environment';

test('it is false when running on localhost', () => {
  const res = isE2E('localhost');
  expect(res).toBe(false);
});

test('it is false when running on mycryptobuilds', () => {
  const res = isE2E('mycryptobuilds');
  expect(res).toBe(false);
});

test('it is false when running on mycrypto', () => {
  const res = isE2E('mycrypto');
  expect(res).toBe(false);
});

test('it is true for any other value', () => {
  const res = isE2E('192.123.168');
  expect(res).toBe(true);
});
