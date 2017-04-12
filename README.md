# MyEtherWallet
MyEtherWallet (v4+)

### What is it?

Production-ready, optimized, robust, fully-featured boilerplate/example.

#### Includes:

- **[React](https://facebook.github.io/react/)** and **[Redux](http://redux.js.org/)**
- **[React-Router](https://github.com/ReactTraining/react-router)** + **[React-Router-Redux](https://github.com/reactjs/react-router-redux)**
- **[JSON-server](https://github.com/typicode/json-server)** - mock db.
- **[Redux-thunk](https://github.com/gaearon/redux-thunk)** and **[Redux-Devtools-Extension](https://github.com/zalmoxisus/redux-devtools-extension)**
- **[Fetch polyfill](https://github.com/github/fetch)**
- **[Semantic-ui-react](http://react.semantic-ui.com/)** -  UI components.
- **[Store2](https://github.com/nbubna/store)** - LocalStorage access.
- **[Webpack 2](https://webpack.js.org)** - babel (stage-0), **HMR**, build, devServer, hotMiddleware.
- **[Jest](https://facebook.github.io/jest/)** - awesome library for easy testing.
- **[Babel React Optimize](https://github.com/thejameskyle/babel-react-optimize)** and **[React-Addons-Perf](https://facebook.github.io/react/docs/perf.html)** for better performance optimization.

### Usage

```bash
git clone https://github.com/Metnew/react-semantic.ui-starter.git
cd react-semantic.ui-starter && rm -rf .git  
npm install
```

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
│ Reatty
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
├── db // mock db
├── static - static assets(imgs, media)
├── webpack_config - Webpack configuration
├── jest_config - Jest configuration
```