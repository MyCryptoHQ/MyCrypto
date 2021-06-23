## File Structure

```
├── components - React components used across multiple features. Components in this directory must be in at least two features.
|   ├── Component.tsx - The React component logic.
|   ├── Component.scss - Styling for the component.
├── config - Configuration constants used across multiple features. Constants in this directory must be in at least two features.
├── features - Related chunks of application functionality.
|   ├── Feature - An individual feature.
|   |   ├── Subfeature - A nested feature that acts as a piece of the feature.
|   |   ├── Feature.tsx - The primary component encapsulating the feature; typically the landing page of a route.
|   |   ├── Feature.scss - Styling for the primary feature component.
|   |   ├── components - Single-use components that are solely used in the feature. If used elsewhere, it should be moved to the global directory.
|   |   ├── constants.ts - Single-use constants that are solely used in the feature. If used elsewhere, it should be moved to the global directory.
|   |   ├── helpers.ts - Single-use helper functions that are solely used in the feature. If used elsewhere, it should be moved to the global directory (in /utils).
|   |   ├── routes.ts - Routing configuration objects that point to the feature and subfeatures.
|   ├── registry.json - Configuration file used to enumerate the various features for the routing mechanism.
├── providers - React components that utilize context, contain domain over one particular set of functionality.
├── routing - Utility functions that gather all of the routes prior to loading in the Root-level component.
├── services - Chunks of business-layer-logic functionality with domain over one particular set of functionality.
|   ├── Service - An individual service.
|   |   ├── Service.ts - The class file for the service.
|   |   ├── constants.ts - Single-use configuration variables only used for the service. If used elsewhere, it should be moved to the global directory.
|   |   ├── helpers.ts - Single-use helper functions only used for the service. If used elsewhere, it should be moved to the global directory.
├── utils - Reusable utility functions that are used across multiple features.
```

## Providers

- `Providers` are special React components that are used to provide functionality potentially many layers deep, while avoiding prop-drilling.
- Each Provider file exports a constant (e.g. `const ExampleContext = createContext()`), as well as a class.
- The class contains a state variable that includes all variables and functions to be accessed down the hierarchy. _Functions are placed in state._
- In the render method of the class, `this.props.children` is returned inside of (e.g. `<ExampleContext.Provider value={this.state} />).
- When `Service` modules need to interact with UI across features, they should use a `Provider`, and communicate changes through state (e.g. ExampleProvider should use an ExampleContext).
- Providers should be placed in the `Layout` feature, wrapping all other components.

## Services

- `Service` modules are business-layer-logic classes that encapsulate interactions with a particular entity.
- The API service module is used to interact with external servers to gather information.
- The Storage and Cache service modules are used to interact with local storage, to aid in persisting data.
- Services should export an abstract class, containing the functionality, as a named export.
- Services should default-export a singleton class which prevents other classes from being instantiated.

## Indexing

- Every level of directory should contain an `index.ts` file which re-exports everything in the directory, recursively.
- Externally interfacing with a directory should always be done with the most senior index file (e.g. `import { Foo } from '@components';` vs. `import Foo from '@components/Foo/Foo';`)
- Internally interfacing with a directory should always be done with relative pathing `../../`.
