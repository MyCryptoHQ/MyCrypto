# ETH Enclave

Enclave is the communication layer between hardware wallets and the Electron
web view. This layer is necessary if you've disabled node integration, and
enabled context isolation on your webview ([Which is something you should do.](https://github.com/electron/electron/blob/master/docs/tutorial/security.md))

Enclave uses Electron's Protocol API to open up an HTTP-like communication layer
between Electron and the web view. You can read [more about this approach here](https://gist.github.com/wbobeirne/ec3e52b3db1359278c19f29e1bbfd5f1).

## Setup

```js
// Electron main js
import { registerServer } from 'enclave/server';
registerServer(app);
```

```js
// Electron preload js
import { registerProtocol } from 'enclave/preload';
registerProtocol();
```

## Usage

```js
import EnclaveAPI, { WalletTypes } from 'enclave/client';
EnclaveAPI.getChainCode({
  walletType: WalletTypes.LEDGER,
  dpath: "m/44'/60'/0'/0"
}).then(({ publicKey, chainCode }) => {
  // ...
});
```
