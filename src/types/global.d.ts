// Styled Components are missing types for 'refs'. We create and alias now to
// enable a fast change once the typings are fixed
// https://spectrum.chat/styled-components/general/typescript-refs~5857d917-966e-4a71-940f-524206896f43
type SCref = any;

interface CustomWindow extends Window {
  // Web3
  ethereum?: any;
  web3?: any;
  Web3Provider?: ethers.providers.Web3Provider;
  Web3Signer?: Web3Provider;

  // Makes FeatureFlagProvider functions available during E2E testing
  setFeatureFlag?(key: keyof IIS_ACTIVE_FEATURE, value: boolean): void;
  resetFeatureFlags?(): void;
}
