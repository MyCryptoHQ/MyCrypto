import { getRootDomain } from './getRootDomain';

test('it handles undefined', () => {
  const hostname = undefined;
  const res = getRootDomain(hostname);
  expect(res).toEqual('');
});

test('it handles localhost', () => {
  const hostname = 'localhost';
  const res = getRootDomain(hostname);
  expect(res).toEqual(hostname);
});

test('it removes the subdomain from a host name', () => {
  const hostname = 'sub.root.com';
  const res = getRootDomain(hostname);
  expect(res).toEqual('root.com');
});

test('it handles multiple sub-domains', () => {
  const hostname = 'sub1.sub2.sub3.root.com';
  const res = getRootDomain(hostname);
  expect(res).toEqual('root.com');
});

test('it handles multiple rc hostname', () => {
  const hostname = 'rc.app.mycrypto.com';
  const res = getRootDomain(hostname);
  expect(res).toEqual('mycrypto.com');
});
