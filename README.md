# MyEtherWallet
MyEtherWallet (v4+)

#### Run:

```bash
npm run dev # run app in dev mode
npm run db  # run mock db for app(from another process)
```

#### Build:

```bash
npm run build # build app
```

It generates app in `dist` folder.

#### Test:

```bash
npm run test # run tests with Jest
```

## Folder structure:

```
│
├── common - Your App
│   └── actions - application actions
│   ├── api - Services and XHR utils(also custom form validation, see InputComponent from components/common)
│   ├── components - components according to "Redux philosophy"
│   ├── config - frontend config depending on REACT_WEBPACK_ENV
│   ├── containers - containers according to "Redux philosophy"
│   ├── reducers - application reducers
│   ├── routing - application routing
│   ├── styles - styles folder with scss vars, mixins, etc.
│   ├── index.jsx - entry
│   ├── index.html
├── webpack_config - Webpack configuration
├── jest_config - Jest configuration
```