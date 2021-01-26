# MyCrypto Beta Web App

[![Build](https://github.com/MyCryptoHQ/MyCrypto/workflows/GitHub%20CI/badge.svg?branch=master)](https://github.com/MyCryptoHQ/MyCrypto/actions)
[![codecov](https://codecov.io/gh/MyCryptoHQ/MyCrypto/branch/master/graph/badge.svg)](https://codecov.io/gh/MyCryptoHQ/MyCrypto)

This repo stores both the beta and production versions of the MyCrypto codebase.

#### The default `master` branch represents the beta code hosted on [beta.mycrypto.com](https://beta.mycrypto.com)

#### The `legacy` branch represents the production code hosted on [mycrypto.com](https://mycrypto.com)

#### Documentation can be found in [our wiki](https://github.com/MyCryptoHQ/MyCrypto/wiki)

- [Getting your token added to MyCrypto](https://github.com/MyCryptoHQ/MyCrypto/wiki/Contributing-%E2%80%90-Adding-Tokens)
- [Adding your Network or Node](https://github.com/MyCryptoHQ/MyCrypto/wiki/Contributing-%E2%80%90-Network-or-Node)
- [Adding your Web3 Wallet & Logo](https://github.com/MyCryptoHQ/MyCrypto/wiki/Contributing-%E2%80%90-Web3-Wallet)
- [MyCryptoBuilds](https://github.com/MyCryptoHQ/MyCrypto/wiki/MyCryptoBuilds) - access a build by commithash, PR number, or branch name without building it yourself!
- [Enabling or disabling experimental features](https://github.com/MyCryptoHQ/MyCrypto/wiki/Feature-flags)

## Development / Build Requirements

- Node 12.14.1\*
- Yarn >= 1.19.1\*\*

On systems where a pre-built version of node-hid is not available (e.g. 32-bit versions of Windows and Linux), you additionally need Python (3+) and node-gyp installed.

<sub>\*Higher versions should work fine, but may cause inconsistencies.</sub>
<br />
<sub>\*\*npm is NOT supported for package management. MyCrypto uses yarn.lock to ensure sub-dependency versions are pinned, so yarn is required to install node_modules</sub>
<br />
<br />
<sub>\*\*\*For users trying to build with WSL, you'll need to have install libpng via `sudo apt-get install libpng16-dev`.</sub>

## Running the App

First, you must run `yarn` to grab all the dependencies. If you are ever having trouble with something, a good place to start is by trying `rm -rf node_modules/ && yarn` which will completely clear all your previously installs dependencies and re-install them from scratch.

Then, you can run various commands depending on what you want to do:

#### Development

```bash
# run app in dev mode in browser, rebuild on file changes
yarn start
```

A development server will be available on https://localhost:3000
If you're using Chrome, you will get a `net::ERR_CERT_AUTHORITY_INVALID` warning.
To disable it you can your settings in chrome: chrome://flags/#allow-insecure-localhost

#### Staging

```bash
# builds staging app version used on mycryptobuilds.com
yarn build:staging
```

#### Production

```bash
# builds production app version used on beta.mycrypto.com
yarn build
```

## Testing

### Unit Tests

```bash
# runs all unit tests using jest
yarn test
```

### End-to-end Tests

```bash
# runs all e2e tests using testcafe
yarn test:e2e
```

To debug E2E tests in the browser

```bash
yarn test:e2e:dev
```

You can also run a single file

```bash
yarn test:e2e:dev __tests__/dashboard.test.js
```

## Environments

In development we use a `.env` file to define required values. The list is defined in `.env.example`. These values are made available to the React code through the `dotenv` webpack plugin.
In production, the values are set through Github secrets and made available to the React app through the `webpack.EnvironmentPlugin`.
NB. Since TestCafe has access to the node, the values are available at `process.env` and do not need to be cloned.

## Product Analytics

We use product analytics to help us understand how to improve our features.

The collection of usage data requires the use of unique identifiers which are stored in the browsers local storage. The id is random and can be removed or reset in the Settings panel. This ensures that our product team can identify places to improve the product, while at the same time protecting the users anonymity.

We strive to provide access to the Ethereum blockchain in the most secure way possible, we refuse any dynamic script injections and only rely on HTTPS calls to the API. The calls are formatted using the excellant [@blockstock/stats](https://github.com/MyCryptoHQ/stats) library.

Finally, since User privacy is part of our core values, we also take special care to ensure that the data we send to thrid-party servers is purged from any information which may be de-anonymised such as:

- Every analytics call is sent to a MYC hosted reverse-proxy, strip of the users ip address and browser fingerprint before being forwarded to the data-warehouse (in this case )

- never sending an ETH address or Transaction hash to our analytics warehouse.
