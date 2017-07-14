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

## Styling

Legacy styles are housed under `common/assets/styles` and written with LESS.
However, going forward, each styled component should create a a `.scss` file of
the same name in the same folder, and import it like so:

```js
import React from "react";

import "./MyComponent.scss";

export default class MyComponent extends React.component {
	render() {
		return (
			<div className="MyComponent">
				<div className="MyComponent-child">Hello!</div>
			</div>
		);
	}
}
```

These style modules adhere to [SuitCSS naming convention](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md):

```scss
.MyComponent {
	/* Styles */

	&-child {
		/* Styles */

		&.is-hidden {
			display: none;
		}
	}
}
```

All elements inside of a component should extend its parent class namespace, or
create a new namespace (Potentially breaking that out into its own component.)

Variables and mixins can be imported from the files in `common/styles`:

```scss
@import "sass/colors";

code {
	color: $code-color;
}
```
