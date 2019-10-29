import React from 'react';
import styled from 'styled-components';

import { NetworkSelectDropdown } from 'v2/components';

const NetworkSelectorWrapper = styled.div`
  margin-bottom: 15px;

  label {
    font-weight: normal;
  }
`;

interface Props {
  network: string;
  setNetwork(network: string): void;
  goToNextStep(): void;
}

export default function Interact(props: Props) {
  const { goToNextStep, network, setNetwork } = props;

  return (
    <>
      <NetworkSelectorWrapper>
        <NetworkSelectDropdown network={network} onChange={setNetwork} />
      </NetworkSelectorWrapper>
      <button onClick={goToNextStep}>Next</button>
    </>
  );
}
