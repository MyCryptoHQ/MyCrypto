# MyEtherWallet
MyEtherWallet (v4+)

#### Run:

```bash
npm run dev # run app in dev mode
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
│   ├── actions - application actions
│   ├── api - Services and XHR utils(also custom form validation, see InputComponent from components/common)
│   ├── components - components according to "Redux philosophy"
│   ├── config - frontend config depending on REACT_WEBPACK_ENV
│   ├── containers - containers according to "Redux philosophy"
│   ├── reducers - application reducers
│   ├── routing - application routing
│   ├── index.jsx - entry
│   ├── index.html
├── static
├── webpack_config - Webpack configuration
├── jest_config - Jest configuration
```

## Docker setup
You should already have docker and docker-compose setup for your platform as a pre-req.

```bash
docker-compose up
```
