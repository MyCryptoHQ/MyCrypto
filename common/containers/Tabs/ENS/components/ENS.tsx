import * as React from 'react';
import Title from './Title';
import { GeneralInfoPanel } from './GeneralInfoPanel';
// import UnfinishedBanner from './UnfinishedBanner';
import NameInput from './NameInput';
import { NameResolve } from './NameResolve';
import { AppState } from 'reducers';
import TabSection from 'containers/TabSection';

interface Props {
  ensState: AppState['ens'];
  resolveDomainRequested(domain: string): void;
  // TODO: Add open bid modal action to NameResolver
}

const ENS = (props: Props) => {
  return (
    <TabSection>
      {/* <UnfinishedBanner /> */}
      <Title />
      <NameInput resolveDomainRequested={props.resolveDomainRequested} />
      <NameResolve {...props.ensState} />
      <GeneralInfoPanel />
    </TabSection>
  );
};

export default ENS;
