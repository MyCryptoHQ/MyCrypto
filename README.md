# MyCrypto Web & Desktop Apps


[![Build Status](https://travis-ci.org/MyCryptoHQ/MyCrypto.svg?branch=develop)](https://travis-ci.org/MyCryptoHQ/MyCrypto)
[![Coverage Status](https://coveralls.io/repos/github/MyCryptoHQ/MyCrypto/badge.svg?branch=develop)](https://coveralls.io/github/MyCryptoHQ/MyCrypto?branch=develop)

* **Just looking to download?** Grab our [latest release](https://github.com/MyCryptoHQ/MyCrypto/releases).
* **Looking for the old site?** Check out [https://legacy.mycrypto.com](https://legacy.mycrypto.com) or the source at [MyCryptoHQ/mycrypto.com](https://github.com/MyCryptoHQ/mycrypto.com)

## Requirements

* Node 8.9.4\*
* Yarn >= 1.7.0\*\*
* Python 2.7.X\*\*\*

<sub>\*Higher versions should work fine, but may cause inconsistencies. It's suggested you run 8.9.4 using `nvm`.</sub>
<br/>
<sub>**npm is NOT supported for package management. MyCrypto uses yarn.lock to ensure sub-dependency versions are pinned, so yarn is required to install node_modules</sub>
<br/>
<sub>\***Python 3 is **not** supported, since our dependencies use `node-gyp`.</sub>
<br/>
<sub>\***For users trying to build with WSL, you'll need to have install libpng via `sudo apt-get install libpng16-dev`.</sub>

## Running the App

After `yarn`ing all dependencies you can run various commands depending on what you want to do:

#### Development

```bash
# run app in dev mode in browser, rebuild on file changes
yarn dev
```

```bash
# run app in dev mode in electron, rebuild on file changes
yarn dev:electron
```

#### Build Releases

```bash
# builds the production server app
yarn build
```

```bash
# builds the downloadable version of the site
yarn build:downloadable
```

```bash
# builds the electron apps
yarn build:electron

# builds only one OS's electron app
yarn build:electron:(osx|linux|windows)
```

All of these builds are output to a folder in `dist/`.

#### Unit Tests:

```bash
# run unit tests with Jest
yarn test
```

#### Integration Tests:

```bash
# run integration tests with Jest
yarn test:int
```

#### Dev (HTTPS):

Some parts of the site, such as the Ledger wallet, require an HTTPS environment to work. To develop on HTTPS, do the following:

1.  Create your own SSL Certificate (Heroku has a [nice guide here](https://devcenter.heroku.com/articles/ssl-certificate-self))
2.  Move the `.key` and `.crt` files into `webpack_config/server.*`
3.  Run the following command:

```bash
yarn dev:https
```

#### Address Derivation Checker:

EthereumJS-Util previously contained a bug that would incorrectly derive addresses from private keys with a 1/128 probability of occurring. A summary of this issue can be found [here](https://www.reddit.com/r/ethereum/comments/48rt6n/using_myetherwalletcom_just_burned_me_for/d0m4c6l/).

As a reactionary measure, the address derivation checker was created.

To test for correct address derivation, the address derivation checker uses multiple sources of address derivation (EthereumJS and PyEthereum) to ensure that multiple official implementations derive the same address for any given private key.

##### The derivation checker utility assumes that you have:

1.  Docker installed/available
2.  [dternyak/eth-priv-to-addr](https://hub.docker.com/r/dternyak/eth-priv-to-addr/) pulled from DockerHub

##### Docker setup instructions:

1.  Install docker (on macOS, [Docker for Mac](https://docs.docker.com/docker-for-mac/) is suggested)
2.  `docker pull dternyak/eth-priv-to-addr`

##### Run Derivation Checker

The derivation checker utility runs as part of the integration test suite.

```bash
yarn test:int
```

## Folder structure:

```
│
├── common
│   ├── api - Services and XHR utils
│   ├── assets - Images, fonts, etc.
│   ├── components - Components according to "Redux philosophy"
│   ├── config - Various config data and hard-coded json
│   ├── containers - Containers according to "Redux philosophy"
|   ├── features - State management and async operations, organized per "feature", follows "ducks" philosophy, see: https://github.com/MyCryptoHQ/MyCrypto/issues/1435
│   ├── libs - Framework-agnostic libraries and business logic
|       ├── contracts - Takes in a contract interface ABI and returns an object with keys equivalent to the ABI function names that each have `.encodeInput`,  `.decodeInput`, `decodeOutput` methods. 
|       ├── ens - Basic ENS functions for getting a name hash and mapping returned ENS contract values to human-readable strings
|       ├── nodes - Configures Shepherd (https://github.com/MyCryptoHQ/shepherd) and exports a singleton provider
|       ├── scheduling - Functionality for enabling Ethereum Alarm Clock usage for scheduled transactions. See https://github.com/MyCryptoHQ/MyCrypto/pull/1343
|       ├── transaction - Utilities for signing / parsing / validating transactions
|       ├── wallet - Wallet implementations for deterministic (hw wallets, mnemonic wallets, etc), and non-deterministic (web3, parity signer, etc.) wallets.
|       ├── web-workers - Web-worker implementation of generateKeystore + fromV3 for non-blocking encrypt/decryption
|       ├── erc20 - `libs/contracts` instance of erc20 abi
|       ├── formatters - Hex string formatters
|       ├── signing - Message signing and signature verification
|       ├── units - Helper functions for working with Ethereum / Token units in both base and unit form. Use these instead of using bn.js directly
|       ├── validators - Validation functions for addresses, hex strings, keys, numbers, derivation paths, EAC values, Ethereum values, etc.
|       ├── values - Functions for building EIP681 requests, numberical sanitization, string padding, bn.js conversion
│   ├── sass - SCSS styles, variables, mixins
│   ├── translations - Language JSON dictionaries
│   ├── typescript - Typescript definition files
│   ├── utils - Common use utility functions
│   ├── index.tsx - Entry point for app
│   ├── index.html - Html template file for html-webpack-plugin
│   ├── Root.tsx - Root component for React
├── electron-app - Code for the native electron app
├── jest_config - Jest testing configuration
├── spec - Jest unit tests, mirror's common's structure
├── static - Files that don't get compiled, just moved to build
└── webpack_config - Webpack configuration
```

## Typescript Resources:
- https://basarat.gitbooks.io/typescript/
- https://blog.mariusschulz.com/series/typescript-evolution

### More information is available on the [Wiki Pages](https://github.com/MyCryptoHQ/MyCrypto/wiki)

## Branching Model

MyCrypto is open-source and encourages pull-requests from third-parties. Our branching model is described below.

To start, fork this repository and have your own remote repository on GitHub.

### Naming Convention

Your branch name must meet our naming conventions to help with administration and identify what type of branch it is.

We name our branches like `<type>/<name>` - examples below;

* `feature/foo` - A feature branch for a feature to do with foo.
* `enhancement/foo` - An enhancement branch to an already built feature called foo.
* `hotfix/foo` - A hotfix branch called foo (something affecting current production)
* `bugfix/foo` - A bugfix branch called foo (something affecting current staging)
* `release/1.4.2` - A release branch for tag 1.4.2
* `revert/foo` - A branch to revert a logic to do with foo.

### Feature branches

Feature branches are used to implement new enhancements for upcoming releases. A feature branch should be ephemeral (only lasting as long as the feature itself is in development. Once the feature is completed, it must be merged back into the `develop` branch and/or discarded.)

We begin on the latest `develop` branch and branch off with the naming convention of `feature/foo`.

Please also make yourself familiar with our [Contributor Guidelines](https://github.com/MyCryptoHQ/MyCrypto/wiki/Contributor-Guidelines).

```sh
$ git checkout -b feature/foo develop
```

You should use `feature/foo` to implement and commit all changed required for your new feature.

* Make many small commits so that the history of development for you feature branch is clear and so that it is easy to pinpoint and edit or cherry-pick specific commits if necessary.
* Avoid merging your feature branch with out feature branches being developed in parallel.
* Add neccessary unit tests for your features code.

When your feature is complete, push it to your remote repo and prepare it for a pull request.

When you are creating a pull request, make sure the base is `MyCryptoHQ/mycrypto/develop` and compare to `feature/foo`.

## Thanks & Support

<a href="https://browserstack.com/">
<img src="https://i.imgur.com/Rib9y9E.png" align="left" />
</a>

Cross browser testing and debugging provided by the very lovely team at BrowserStack.
