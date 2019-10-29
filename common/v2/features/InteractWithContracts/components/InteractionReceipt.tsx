import React from 'react';

interface Props {
  setStep(step: number): void;
}

export default function InteractionReceipt(props: Props) {
  const { setStep } = props;

  const handleInteractionComplete = () => {
    setStep(0);
  };

  return (
    <>
      <p>Interaction receipt</p>
      <button onClick={handleInteractionComplete}>Another Interaction</button>
    </>
  );
}
