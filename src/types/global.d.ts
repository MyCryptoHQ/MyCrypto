// Styled Components are missing types for 'refs'. We create and alias now to
// enable a fast change once the typings are fixed
// https://spectrum.chat/styled-components/general/typescript-refs~5857d917-966e-4a71-940f-524206896f43
type SCref = any;

// Don't use `{}` as a type. `{}` actually means "any non-nullish value"
// ie. https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
type TObject = Record<string, unknown>;

interface CustomWindow extends Window {
  // Web3
  ethereum?: any;
  web3?: any;
  Web3Provider?: ethers.providers.Web3Provider;
  Web3Signer?: Web3Provider;

  // Makes FeatureFlagProvider functions available during E2E testing
  setFeatureFlag?(key: FeatureFlag, value: boolean): void;
  resetFeatureFlags?(): void;
}

interface CustomError extends Error {
  reason?: string; // Used by Ethers.js
}

// Polyfill for ResizeObserver since type is missing from TS
// https://github.com/que-etc/resize-observer-polyfill/blob/master/src/index.d.ts
interface DOMRectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}

interface ResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

declare const ResizeObserver: {
  prototype: ResizeObserver;
  new (callback: ResizeObserverCallback): ResizeObserver;
};

interface ResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}
