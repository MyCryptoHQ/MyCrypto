import React from 'react';

interface Props {
  goToNextStep(): void;
}

export default function Interact(props: Props) {
  const { goToNextStep } = props;

  return (
    <>
      <p>Interact form</p>
      <button onClick={goToNextStep}>Next</button>
    </>
  );
}
