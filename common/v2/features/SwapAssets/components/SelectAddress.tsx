import React from 'react';

interface Props {
  goToNextStep(): void;
}

export default function SelectAddress(props: Props) {
  const { goToNextStep } = props;

  return (
    <div>
      <div>Select Address</div>
      <button onClick={goToNextStep}>Next</button>
    </div>
  );
}
