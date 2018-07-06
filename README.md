# MyCrypto Web & Desktop Apps

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
│   ├── actions - Application actions
│   ├── api - Services and XHR utils
│   ├── assets - Images, fonts, etc.
│   ├── components - Components according to "Redux philosophy"
│   ├── config - Various config data and hard-coded json
│   ├── containers - Containers according to "Redux philosophy"
│   ├── libs - Framework-agnostic libraries and business logic
│   ├── reducers - Redux reducers
│   ├── sagas - Redux sagas
│   ├── sass - SCSS styles, variables, mixins
│   ├── selectors - Redux selectors
│   ├── translations - Language JSON dictionaries
│   ├── typescript - Typescript definition files
│   ├── utils - Common use utility functions
│   ├── index.tsx - Entry point for app
│   ├── index.html - Html template file for html-webpack-plugin
│   ├── Root.tsx - Root component for React
│   └── store.ts - Redux reducer combiner and middleware injector
├── electron-app - Code for the native electron app
├── jest_config - Jest testing configuration
├── spec - Jest unit tests, mirror's common's structure
├── static - Files that don't get compiled, just moved to build
└── webpack_config - Webpack configuration
```

### More information is available on the [Wiki Pages](https://github.com/MyCryptoHQ/MyCrypto/wiki)

## Thanks & Support

<a href="https://browserstack.com/">
<img src="https://i.imgur.com/Rib9y9E.png" align="left" />
</a>

Cross browser testing and debugging provided by the very lovely team at BrowserStack.
