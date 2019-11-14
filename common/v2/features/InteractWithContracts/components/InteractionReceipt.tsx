import React from 'react';

interface Props {
  goToFirstStep(): void;
}

export default function InteractionReceipt(props: Props) {
  const { goToFirstStep } = props;

  return (
    <>
      <p>Interaction receipt</p>
      <button onClick={goToFirstStep}>Another Interaction</button>
    </>
  );
}
