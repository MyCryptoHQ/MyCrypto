# MyEtherWallet V4+ (ALPHA - VISIT [V3](https://github.com/kvhnuke/etherwallet) for the production site)

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

## Style Guides and Philosophies

The following are guides for developers to follow for writing compliant code.



### Redux and Actions

Each reducer has one file in `reducers/[namespace].js` that contains the reducer
and initial state, one file in `actions/[namespace].js` that contains the action
creators and their return types, and optionally one file in
`sagas/[namespace].js` that handles action side effects using
[`redux-saga`](https://github.com/redux-saga/redux-saga).

The files should be laid out as follows:

#### Reducer

* State should be explicitly defined and exported
* Initial state should match state flow typing, define every key
* Reducer function should handle all cases for actions. If state does not change
as a result of an action (Because it merely kicks off side-effects in saga) then
define the case above default, and have it fall through.

```js
// @flow
import type { NamespaceAction } from "actions/namespace";

export type State = { /* Flowtype definition for state object */ };
export const INITIAL_STATE: State = { /* Initial state shape */ };

export function namespace(
	state: State = INITIAL_STATE,
	action: NamespaceAction
): State {
	switch (action.type) {
		case 'NAMESPACE_NAME_OF_ACTION':
			return {
				...state,
				// Alterations to state
			};

		case 'NAMESPACE_NAME_OF_SAGA_ACTION':
		default:
			// Ensures every action was handled in reducer
			// Unhandled actions should just fall into default
			(action: empty);
			return state;
	}
}
```

#### Actions

* Define each action object type beside the action creator
* Export a union of all of the action types for use by the reducer

```js
/*** Name of action ***/
export type NameOfActionAction = {
	type: 'NAMESPACE_NAME_OF_ACTION',
	/* Rest of the action object shape */
};

export function nameOfAction(): NameOfActionAction {
	return {
		type: 'NAMESPACE_NAME_OF_ACTION',
		/* Rest of the action object */
	};
};

/*** Action Union ***/
export type NamespaceAction =
	| ActionOneAction
	| ActionTwoAction
	| ActionThreeAction;
```

#### Action Constants

Action constants are not used thanks to flow type checking. To avoid typos, we
use `(action: empty)` in the default case which assures every case is accounted
for. If you need to use another reducer's action, import that action type into
your reducer, and create a new action union of your actions, and the other
action types used.




### Styling

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

#### Converting Styles

When working on a module that has styling in Less, try to do the following:

* Screenshot the component in question
* Create a new SCSS file in the same directory
* Remove styling from LESS file, convert it to the SCSS file (Mostly s/@/$)
* Convert class names to SuitCSS naming convention
* Convert any utility classes from `etherewallet-utilities.less` into mixins
* Convert as many element selectors to class name selectors as possible
* Convert as many `<br/>` tags or `&nbsp;`s to margins
* Ensure that there has been little to no deviation from screenshot
