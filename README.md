# MyEtherWallet V4+ (ALPHA - VISIT [V3](https://github.com/kvhnuke/etherwallet) for the production site)

[![Greenkeeper badge](https://badges.greenkeeper.io/MyEtherWallet/MyEtherWallet.svg)](https://greenkeeper.io/)

#### Run:

```bash
npm run dev # run app in dev mode
```

#### Build:

```bash
npm run build # build app
```

It generates app in `dist` folder.

#### Unit Tests:

```bash
npm run test # run tests with Jest
```

#### Integration Tests:

```bash
npm run test:int # run tests with Jest
```

#### Dev (HTTPS):

1. Create your own SSL Certificate (Heroku has a [nice guide here](https://devcenter.heroku.com/articles/ssl-certificate-self))
2. Move the `.key` and `.crt` files into `webpack_config/server.*`
3. Run the following command:

```bash
npm run dev:https
```

#### Address Derivation Checker:

EthereumJS-Util previously contained a bug that would incorrectly derive addresses from private keys with a 1/128 probability of occurring. A summary of this issue can be found [here](https://www.reddit.com/r/ethereum/comments/48rt6n/using_myetherwalletcom_just_burned_me_for/d0m4c6l/).

As a reactionary measure, the address derivation checker was created.

To test for correct address derivation, the address derivation checker uses multiple sources of address derivation (EthereumJS and PyEthereum) to ensure that multiple official implementations derive the same address for any given private key.

##### The derivation checker utility assumes that you have:

1. Docker installed/available
2. [dternyak/eth-priv-to-addr](https://hub.docker.com/r/dternyak/eth-priv-to-addr/) pulled from DockerHub

##### Docker setup instructions:

1. Install docker (on macOS, [Docker for Mac](https://docs.docker.com/docker-for-mac/) is suggested)
2. `docker pull dternyak/eth-priv-to-addr`

##### Run Derivation Checker

The derivation checker utility runs as part of the integration test suite.

```bash
npm run test:int
```

## Folder structure:

```
│
├── common
│   ├── actions - application actions
│   ├── api - Services and XHR utils
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
  type: TypeKeys.NAMESPACE_NAME_OF_ACTION;
  /* Rest of the action object shape */
}

/*** Action Union ***/
export type NamespaceAction = ActionOneAction | ActionTwoAction | ActionThreeAction;
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

### Typing Redux-Connected Components

Components that receive props directly from redux as a result of the `connect`
function should use AppState for typing, rather than manually defining types.
This makes refactoring reducers easier by catching mismatches or changes of
types in components, and reduces the chance for inconsistency. It's also less
code overall.

```
// Do this
import { AppState } from 'reducers';

interface Props {
	wallet: AppState['wallet']['inst'];
	rates: AppState['rates']['rates'];
	// ...
}

// Not this
import { IWallet } from 'libs/wallet';
import { Rates } from 'libs/rates';

interface Props {
	wallet: IWallet;
	rates: Rates;
	// ...
}
```

However, if you have a sub-component that takes in props from a connected
component, it's OK to manually specify the type. Especially if you go from
being type-or-null to guaranteeing the prop will be passed (because of a
conditional render.)

### Higher Order Components

#### Typing Injected Props

Props made available through higher order components can be tricky to type. You can inherit the injected props, and in the case of react router, specialize the generic in `withRouter` so it can omit all of its injected props from the component.

```ts
import { RouteComponentProps } from 'react-router-dom';

interface MyComponentProps extends RouteComponentProps<{}> {
  name: string;
  countryCode?: string;
}
```

```ts
class MyComponent extends React.Component<MyComponentProps, {}> {

  render() {
    const { name, countryCode, location } = this.props; // location being the one of the injected props from the withRouter HOC
    ...
  }
}

export default withRouter<Props>(MyComponent);
```

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
import React from 'react';

import './MyComponent.scss';

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
@import 'sass/colors';

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

#### Adding Icon-fonts

1. Download chosen icon-font
1. Declare css font-family:
   ```
   @font-face {
   	font-family: 'social-media';
   	src: url('../assets/fonts/social-media.eot');
   	src: url('../assets/fonts/social-media.eot') format('embedded-opentype'),
   		url('../assets/fonts/social-media.woff2') format('woff2'),
   		url('../assets/fonts/social-media.woff') format('woff'),
   		url('../assets/fonts/social-media.ttf') format('truetype'),
   		url('../assets/fonts/social-media.svg') format('svg');
   	font-weight: normal;
   	font-style: normal;
   }
   ```
1. Create classes for each icon using their unicode character
   ```
   .sm-logo-facebook:before {
       content: '\ea02';
     }
   ```
   * [How to get unicode icon values?](https://stackoverflow.com/questions/27247145/get-the-unicode-icon-value-from-a-custom-font)
1. Write some markup:
   ```
   <a href="/">
   	<i className={`sm-icon sm-logo-${text} sm-24px`} />
   	Hello World
   </a>
   ```

## Thanks & Support

<a href="https://browserstack.com/">
<img src="https://i.imgur.com/Rib9y9E.png" align="left" />
</a>

Cross browser testing and debugging provided by the very lovely team at BrowserStack.
