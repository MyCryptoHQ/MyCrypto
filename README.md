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

#### Dev (HTTPS):

1. Create your own SSL Certificate (Heroku has a [nice guide here](https://devcenter.heroku.com/articles/ssl-certificate-self))
2. Move the `.key` and `.crt` files into `webpack_config/server.*`
3. Run the following command:

```bash
npm run dev:https
```

#### Derivation Check:
##### The derivation checker utility assumes that you have:
1. Docker installed/available
2. [dternyak/eth-priv-to-addr](https://hub.docker.com/r/dternyak/eth-priv-to-addr/) pulled from DockerHub

##### Docker setup instructions:
1. Install docker (on macOS, [Docker for Mac](https://docs.docker.com/docker-for-mac/)is suggested)
2. `docker pull dternyak/eth-priv-to-addr`

##### Run Derivation Checker
```bash
npm run derivation-checker
```

## Folder structure:

```
│
├── common
│   ├── actions - application actions
│   ├── api - Services and XHR utils(also custom form validation, see InputComponent from components/common)
│   ├── components - components according to "Redux philosophy"
│   ├── config - frontend config depending on REACT_WEBPACK_ENV
│   ├── containers - containers according to "Redux philosophy"
│   ├── reducers - application reducers
│   ├── routing - application routing
│   ├── index.tsx - entry
│   ├── index.html
├── static
├── webpack_config - Webpack configuration
├── jest_config - Jest configuration
```

## Style Guides and Philosophies

The following are guides for developers to follow for writing compliant code.


### Redux and Actions

Each reducer has one file in `reducers/[namespace].ts` that contains the reducer
and initial state, one file in `actions/[namespace].ts` that contains the action
creators and their return types, and optionally one file in
`sagas/[namespace].ts` that handles action side effects using
[`redux-saga`](https://github.com/redux-saga/redux-saga).

The files should be laid out as follows:

#### Reducer

* State should be explicitly defined and exported
* Initial state should match state typing, define every key

```ts
import { NamespaceAction } from "actions/[namespace]";
import { TypeKeys } from 'actions/[namespace]/constants';

export interface State { /* definition for state object */ };
export const INITIAL_STATE: State = { /* Initial state shape */ };

export function [namespace](
	state: State = INITIAL_STATE,
	action: NamespaceAction
): State {
	switch (action.type) {
		case TypeKeys.NAMESPACE_NAME_OF_ACTION:
			return {
				...state,
				// Alterations to state
			};		  
		default:
			return state;
	}
}
```

#### Actions
* Define each action creator in `actionCreator.ts`
* Define each action object type in `actionTypes.ts`
    * Export a union of all of the action types for use by the reducer
* Define each action type as a string enum in `constants.ts`  
* Export `actionCreators` and `actionTypes` from module file `index.ts`  

```
├── common
    ├── actions - application actions
        ├── [namespace] - action namespace
            ├── actionCreators.ts - action creators
            ├── actionTypes.ts - action interfaces / types
            ├── constants.ts - string enum
            ├── index.ts - exports all action creators and action object types
```
##### constants.ts
```ts
export enum TypeKeys {
  NAMESPACE_NAME_OF_ACTION = 'NAMESPACE_NAME_OF_ACTION'
}
```
##### actionTypes.ts
```ts
/*** Name of action ***/
export interface NameOfActionAction {
	type: TypeKeys.NAMESPACE_NAME_OF_ACTION,
	/* Rest of the action object shape */
};

/*** Action Union ***/
export type NamespaceAction =
	| ActionOneAction
	| ActionTwoAction
	| ActionThreeAction;
```
##### actionCreators.ts
```ts
import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export interface TNameOfAction = typeof nameOfAction;
export function nameOfAction(): interfaces.NameOfActionAction {
	return {
		type: TypeKeys.NAMESPACE_NAME_OF_ACTION,
		payload: {}
	};
};
```
##### index.ts
```ts
export * from './actionCreators';
export * from './actionTypes';
```
### Higher Order Components

#### Typing Injected Props
Props made available through higher order components can be tricky to type. Normally, if a component requires a prop, you add it to the component's interface and it just works. However, working with injected props from [higher order components](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e), you will be forced to supply all required props whenever you compose the component.  

```ts
interface MyComponentProps {
  name: string;
  countryCode?: string;
  router: InjectedRouter;
}

...

class OtherComponent extends React.Component<{}, {}> {
  render() {
    return (
      <MyComponent
        name="foo"
        countryCode="CA"
        // Error: 'router' is missing!
        />
    );
  }
```

Instead of tacking the injected props on to the MyComponentProps interface itself, put them on another interface that extends the main interface:

```ts
interface MyComponentProps {
  name: string;
  countryCode?: string;
}

interface InjectedProps extends MyComponentProps {
  router: InjectedRouter;
}
```

Now you can add a [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) to the component to derive the injected props from the props object at runtime:

```ts
class MyComponent extends React.Component<MyComponentProps, {}> {
  get injected() {
    return this.props as InjectedProps;
  }

  render() {
    const { name, countryCode } = this.props;
    const { router } = this.injected;
    ...
  }
}
```

All the injected props are now strongly typed, while staying private to the module, and not polluting the public props interface.

## Event Handlers

Event handlers such as `onChange` and `onClick`, should be properly typed. For example, if you have an event listener on an input element inside a form:
```ts
public onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(
        e.currentTarget.value,
        this.props.unit
      );
    }
  };
```
Where you type the event as a `React.FormEvent` of type `HTML<TYPE>Element`. 

## Class names

Dynamic class names should use the `classnames` module to simplify how they are created instead of using string template literals with expressions inside. 

### Styling

Legacy styles are housed under `common/assets/styles` and written with LESS.
However, going forward, each styled component should create a a `.scss` file of
the same name in the same folder, and import it like so:

```ts
import React from "react";

import "./MyComponent.scss";

export default class MyComponent extends React.component<{}, {}> {
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



## Thanks & Support

<a href="https://browserstack.com/">
<img src="https://i.imgur.com/Rib9y9E.png" align="left" />
</a>

Cross browser testing and debugging provided by the very lovely team at BrowserStack.
